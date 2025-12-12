import { query } from '@/lib/db.js';

export async function GET(request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const action = searchParams.get('action');

    if (action === 'list') {
      const results = await query(`
        SELECT b.*, c.first_name, c.last_name, a.name as accommodation_name,
          (SELECT t.transaction_reference FROM transactions t WHERE t.booking_id = b.id ORDER BY t.id DESC LIMIT 1) AS transaction_reference,
          (SELECT t.amount FROM transactions t WHERE t.booking_id = b.id ORDER BY t.id DESC LIMIT 1) AS transaction_amount
        FROM bookings b
        LEFT JOIN customers c ON b.customer_id = c.id
        LEFT JOIN accommodations a ON b.accommodation_id = a.id
        ORDER BY b.created_at DESC
      `);
      return Response.json({ data: results });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Booking fetch error:', error);
    return Response.json({ error: 'Failed to fetch bookings: ' + error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const action = searchParams.get('action');
    
    if (action === 'create') {
      const body = await request.json();
      console.log('Booking creation request received:', {
        customer_id: body.customer_id,
        accommodation_id: body.accommodation_id,
        total_price: body.total_price,
        payment_method: body.payment_method,
      });
      
      // Validate required fields (accommodation_id may be non-numeric from legacy/local storage)
      const required = ['customer_id', 'accommodation_id', 'check_in', 'check_out', 'guests', 'total_price'];
      for (const field of required) {
        if (!body[field]) {
          return Response.json({ error: `${field} is required` }, { status: 400 });
        }
      }

      // Generate booking number
      const bookingNumber = `BK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      // Resolve accommodation_id: allow numeric id or resolve by accommodation_name for legacy/local ids
      let accommodationId = parseInt(body.accommodation_id)
      if (isNaN(accommodationId)) {
        if (body.accommodation_name) {
          const acc = await query('SELECT id FROM accommodations WHERE name = ? LIMIT 1', [body.accommodation_name])
          if (acc && acc.length > 0) {
            accommodationId = acc[0].id
          }
        }
      }

      if (isNaN(accommodationId)) {
        return Response.json({ error: 'Invalid accommodation id' }, { status: 400 })
      }

      const customerId = parseInt(body.customer_id)
      if (isNaN(customerId)) {
        return Response.json({ error: 'Invalid customer id' }, { status: 400 })
      }

      const results = await query(
        `INSERT INTO bookings (booking_number, customer_id, accommodation_id, check_in, check_out, guests, total_price, status, notes) 
         VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed', ?)`,
        [
          bookingNumber,
          customerId,
          accommodationId,
          body.check_in,
          body.check_out,
          parseInt(body.guests),
          parseFloat(body.total_price),
          body.notes || '',
        ]
      );
      const bookingId = results.insertId

      // Record transaction for this booking (transactions table)
      let transactionReference = `TXN-${bookingNumber}`
      try {
        console.log('Inserting transaction:', {
          booking_id: bookingId,
          customer_id: customerId,
          amount: body.total_price,
          payment_method: body.payment_method || 'cash',
          transaction_reference: transactionReference,
        });
        await query(
          `INSERT INTO transactions (booking_id, customer_id, amount, payment_method, status, transaction_reference, description) 
           VALUES (?, ?, ?, ?, 'completed', ?, ?)`,
          [
            bookingId,
            customerId,
            parseFloat(body.total_price),
            body.payment_method || 'cash',
            transactionReference,
            `Payment for booking ${bookingNumber}`,
          ]
        );
        console.log('Transaction inserted successfully');
      } catch (txnError) {
        console.error('Transaction record error (non-fatal):', txnError);
      }

      // Also insert into payments table for easier receipt reporting (best-effort)
      try {
        console.log('Inserting payment:', {
          booking_id: bookingId,
          amount: body.total_price,
          payment_method: body.payment_method || 'cash',
          transaction_id: transactionReference,
        });
        await query(
          `INSERT INTO payments (booking_id, amount, payment_method, status, transaction_id) VALUES (?, ?, ?, 'completed', ?)`,
          [bookingId, parseFloat(body.total_price), body.payment_method || 'cash', transactionReference]
        );
        console.log('Payment inserted successfully');
      } catch (payErr) {
        console.error('Payments insert error (non-fatal):', payErr);
      }

      // Fetch the newly created booking and include last transaction info
      const newBooking = await query(
        `SELECT b.*, c.first_name, c.last_name, a.name as accommodation_name 
         FROM bookings b
         LEFT JOIN customers c ON b.customer_id = c.id
         LEFT JOIN accommodations a ON b.accommodation_id = a.id
         WHERE b.id = ?`,
        [results.insertId]
      );

      // Try to fetch last transaction for this booking
      let lastTxn = null
      try {
        const txns = await query(`SELECT * FROM transactions WHERE booking_id = ? ORDER BY id DESC LIMIT 1`, [results.insertId])
        if (txns && txns.length > 0) lastTxn = txns[0]
      } catch (e) {
        // ignore
      }

      return Response.json({
        success: true,
        id: results.insertId,
        booking_number: bookingNumber,
        ...newBooking[0],
        transaction_reference: lastTxn ? lastTxn.transaction_reference : transactionReference,
        transaction_amount: lastTxn ? lastTxn.amount : parseFloat(body.total_price),
      });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Booking error:', error);
    return Response.json({ error: 'Failed to create booking: ' + error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return Response.json({ error: 'id is required' }, { status: 400 });
    }

    const body = await request.json();
    const updates = [];
    const values = [];

    // Build dynamic UPDATE statement
    const allowedFields = ['status', 'check_in', 'check_out', 'guests', 'total_price', 'notes'];
    for (const field of allowedFields) {
      if (body[field] !== undefined && body[field] !== null) {
        updates.push(`${field} = ?`);
        values.push(field === 'total_price' ? parseFloat(body[field]) : body[field]);
      }
    }

    if (updates.length === 0) {
      return Response.json({ error: 'No fields to update' }, { status: 400 });
    }

    values.push(parseInt(id));

    await query(
      `UPDATE bookings SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    // Fetch updated booking
    const updatedBooking = await query(
      `SELECT b.*, c.first_name, c.last_name, a.name as accommodation_name FROM bookings b
       LEFT JOIN customers c ON b.customer_id = c.id
       LEFT JOIN accommodations a ON b.accommodation_id = a.id
       WHERE b.id = ?`,
      [parseInt(id)]
    );

    return Response.json({
      success: true,
      ...updatedBooking[0],
    });
  } catch (error) {
    console.error('Booking update error:', error);
    return Response.json({ error: 'Failed to update booking: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return Response.json({ error: 'id is required' }, { status: 400 });
    }

    const bookingId = parseInt(id);

    // Fetch booking before deleting
    const existing = await query(
      'SELECT * FROM bookings WHERE id = ?',
      [bookingId]
    );

    if (!existing || existing.length === 0) {
      return Response.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Delete related transactions first
    await query('DELETE FROM transactions WHERE booking_id = ?', [bookingId]);

    // Delete related payments
    await query('DELETE FROM payments WHERE booking_id = ?', [bookingId]);

    // Delete the booking
    await query('DELETE FROM bookings WHERE id = ?', [bookingId]);

    return Response.json({
      success: true,
      message: `Booking ${bookingId} deleted successfully`,
      deleted_id: bookingId,
    });
  } catch (error) {
    console.error('Booking delete error:', error);
    return Response.json({ error: 'Failed to delete booking: ' + error.message }, { status: 500 });
  }
}
