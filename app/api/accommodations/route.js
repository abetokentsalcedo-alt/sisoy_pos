import { query } from '@/lib/db.js';

export async function GET(request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const action = searchParams.get('action');

    if (action === 'list') {
      const results = await query('SELECT * FROM accommodations WHERE status = "active" ORDER BY name ASC');
      return Response.json({ data: results });
    }

    if (action === 'get') {
      const id = searchParams.get('id');
      const results = await query('SELECT * FROM accommodations WHERE id = ?', [parseInt(id || '0')]);

      if (!results.length) {
        return Response.json({ error: 'Not found' }, { status: 404 });
      }

      return Response.json(results[0]);
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Accommodation error:', error);
    return Response.json({ error: 'Failed to fetch accommodations: ' + error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const action = searchParams.get('action');

    if (action === 'create') {
      const body = await request.json();

      const results = await query(
        `INSERT INTO accommodations (name, type, capacity, price_per_night, description, status) 
         VALUES (?, ?, ?, ?, ?, 'active')`,
        [
          body.name || '',
          body.type || 'Room',
          parseInt(body.capacity || '2'),
          parseFloat(body.price_per_night || '0'),
          body.description || '',
        ]
      );

      // Fetch the newly created accommodation
      const newAccommodation = await query(
        'SELECT * FROM accommodations WHERE id = ?',
        [results.insertId]
      );

      return Response.json({ 
        success: true, 
        id: results.insertId,
        ...newAccommodation[0] 
      });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Accommodation create error:', error);
    return Response.json({ error: 'Failed to create accommodation: ' + error.message }, { status: 500 });
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
    const allowedFields = ['name', 'type', 'capacity', 'price_per_night', 'description', 'status'];
    for (const field of allowedFields) {
      if (body[field] !== undefined && body[field] !== null) {
        updates.push(`${field} = ?`);
        values.push(field === 'capacity' || field === 'price_per_night' ? parseFloat(body[field]) : body[field]);
      }
    }

    if (updates.length === 0) {
      return Response.json({ error: 'No fields to update' }, { status: 400 });
    }

    values.push(parseInt(id));

    await query(
      `UPDATE accommodations SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    // Fetch updated accommodation
    const updated = await query(
      'SELECT * FROM accommodations WHERE id = ?',
      [parseInt(id)]
    );

    return Response.json({
      success: true,
      ...updated[0],
    });
  } catch (error) {
    console.error('Accommodation update error:', error);
    return Response.json({ error: 'Failed to update accommodation: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return Response.json({ error: 'id is required' }, { status: 400 });
    }

    const accommodationId = parseInt(id);

    // Fetch accommodation before deleting
    const existing = await query(
      'SELECT * FROM accommodations WHERE id = ?',
      [accommodationId]
    );

    if (!existing || existing.length === 0) {
      return Response.json({ error: 'Accommodation not found' }, { status: 404 });
    }

    // Check if accommodation has active bookings
    const activeBookings = await query(
      'SELECT COUNT(*) as count FROM bookings WHERE accommodation_id = ? AND status IN ("pending", "confirmed")',
      [accommodationId]
    );

    if (activeBookings[0].count > 0) {
      return Response.json({ 
        error: `Cannot delete accommodation with active bookings (${activeBookings[0].count} found)` 
      }, { status: 409 });
    }

    // Soft delete by setting status to inactive
    await query('UPDATE accommodations SET status = ? WHERE id = ?', ['inactive', accommodationId]);

    return Response.json({
      success: true,
      message: `Accommodation ${accommodationId} deleted successfully`,
      deleted_id: accommodationId,
    });
  } catch (error) {
    console.error('Accommodation delete error:', error);
    return Response.json({ error: 'Failed to delete accommodation: ' + error.message }, { status: 500 });
  }
}
