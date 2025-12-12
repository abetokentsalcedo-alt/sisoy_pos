import { query } from '@/lib/db.js';

export async function GET(request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const action = searchParams.get('action');
    const id = searchParams.get('id');

    if (action === 'list') {
      const results = await query(`
        SELECT * FROM transactions 
        ORDER BY id DESC
      `);
      return Response.json({ data: results });
    }

    if (action === 'get' && id) {
      const results = await query(
        'SELECT * FROM transactions WHERE id = ?',
        [id]
      );
      return Response.json(results[0] || null);
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Transaction fetch error:', error);
    return Response.json({ error: 'Failed to fetch transactions: ' + error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const action = searchParams.get('action');

    if (action === 'create') {
      const body = await request.json();

      const required = ['booking_id', 'customer_id', 'amount', 'payment_method'];
      for (const field of required) {
        if (body[field] === undefined || body[field] === null) {
          return Response.json({ error: `${field} is required` }, { status: 400 });
        }
      }

      const results = await query(
        `INSERT INTO transactions (booking_id, customer_id, amount, payment_method, status, transaction_reference, description) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          parseInt(body.booking_id),
          parseInt(body.customer_id),
          parseFloat(body.amount),
          body.payment_method,
          body.status || 'completed',
          body.transaction_reference || `TXN-${Date.now()}`,
          body.description || '',
        ]
      );

      const newTransaction = await query(
        'SELECT * FROM transactions WHERE id = ?',
        [results.insertId]
      );

      return Response.json({
        success: true,
        id: results.insertId,
        ...newTransaction[0],
      });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Transaction create error:', error);
    return Response.json({ error: 'Failed to create transaction: ' + error.message }, { status: 500 });
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
    const allowedFields = ['amount', 'payment_method', 'status', 'transaction_reference', 'description'];
    for (const field of allowedFields) {
      if (body[field] !== undefined && body[field] !== null) {
        updates.push(`${field} = ?`);
        values.push(field === 'amount' ? parseFloat(body[field]) : body[field]);
      }
    }

    if (updates.length === 0) {
      return Response.json({ error: 'No fields to update' }, { status: 400 });
    }

    values.push(parseInt(id));

    const results = await query(
      `UPDATE transactions SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const updatedTransaction = await query(
      'SELECT * FROM transactions WHERE id = ?',
      [id]
    );

    return Response.json({
      success: true,
      id: parseInt(id),
      ...updatedTransaction[0],
    });
  } catch (error) {
    console.error('Transaction update error:', error);
    return Response.json({ error: 'Failed to update transaction: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return Response.json({ error: 'id is required' }, { status: 400 });
    }

    const transactionId = parseInt(id);

    // Fetch transaction before deleting
    const existing = await query(
      'SELECT * FROM transactions WHERE id = ?',
      [transactionId]
    );

    if (!existing || existing.length === 0) {
      return Response.json({ error: 'Transaction not found' }, { status: 404 });
    }

    await query('DELETE FROM transactions WHERE id = ?', [transactionId]);

    return Response.json({
      success: true,
      message: `Transaction ${transactionId} deleted successfully`,
      deleted_id: transactionId,
    });
  } catch (error) {
    console.error('Transaction delete error:', error);
    return Response.json({ error: 'Failed to delete transaction: ' + error.message }, { status: 500 });
  }
}
