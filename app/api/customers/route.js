import { query } from '@/lib/db.js';

export async function GET(request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const action = searchParams.get('action');

    if (action === 'list') {
      const results = await query('SELECT * FROM customers ORDER BY created_at DESC');
      return Response.json({ data: results });
    }

    if (action === 'search') {
      const term = searchParams.get('term') || '';
      if (term.length < 2) {
        return Response.json({ data: [] });
      }

      const searchTerm = `%${term}%`;
      const results = await query(
        `SELECT * FROM customers 
         WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR phone LIKE ?
         LIMIT 10`,
        [searchTerm, searchTerm, searchTerm, searchTerm]
      );

      return Response.json({ data: results });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Customer error:', error);
    return Response.json({ error: 'Failed to fetch customers: ' + error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const action = searchParams.get('action');

    if (action === 'create') {
      const body = await request.json();

      const results = await query(
        `INSERT INTO customers (first_name, last_name, email, phone, address) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          body.first_name || '',
          body.last_name || '',
          body.email || '',
          body.phone || '',
          body.address || '',
        ]
      );

      // Fetch the newly created customer
      const newCustomer = await query(
        'SELECT * FROM customers WHERE id = ?',
        [results.insertId]
      );

      return Response.json({ 
        success: true, 
        id: results.insertId,
        ...newCustomer[0] 
      });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Customer create error:', error);
    return Response.json({ error: 'Failed to create customer: ' + error.message }, { status: 500 });
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
    const allowedFields = ['first_name', 'last_name', 'email', 'phone', 'address'];
    for (const field of allowedFields) {
      if (body[field] !== undefined && body[field] !== null) {
        updates.push(`${field} = ?`);
        values.push(body[field]);
      }
    }

    if (updates.length === 0) {
      return Response.json({ error: 'No fields to update' }, { status: 400 });
    }

    values.push(parseInt(id));

    await query(
      `UPDATE customers SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    // Fetch updated customer
    const updated = await query(
      'SELECT * FROM customers WHERE id = ?',
      [parseInt(id)]
    );

    return Response.json({
      success: true,
      ...updated[0],
    });
  } catch (error) {
    console.error('Customer update error:', error);
    return Response.json({ error: 'Failed to update customer: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return Response.json({ error: 'id is required' }, { status: 400 });
    }

    const customerId = parseInt(id);

    // Fetch customer before deleting
    const existing = await query(
      'SELECT * FROM customers WHERE id = ?',
      [customerId]
    );

    if (!existing || existing.length === 0) {
      return Response.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Check if customer has active bookings
    const activeBookings = await query(
      'SELECT COUNT(*) as count FROM bookings WHERE customer_id = ? AND status IN ("pending", "confirmed")',
      [customerId]
    );

    if (activeBookings[0].count > 0) {
      return Response.json({ 
        error: `Cannot delete customer with active bookings (${activeBookings[0].count} found)` 
      }, { status: 409 });
    }

    // Delete customer (and related transactions will cascade if foreign key set)
    await query('DELETE FROM customers WHERE id = ?', [customerId]);

    return Response.json({
      success: true,
      message: `Customer ${customerId} deleted successfully`,
      deleted_id: customerId,
    });
  } catch (error) {
    console.error('Customer delete error:', error);
    return Response.json({ error: 'Failed to delete customer: ' + error.message }, { status: 500 });
  }
}
