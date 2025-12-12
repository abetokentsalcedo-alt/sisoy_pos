<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/database.php';

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

if ($action === 'list' && $method === 'GET') {
    $status = $_GET['status'] ?? '';
    $query = "SELECT b.*, c.first_name, c.last_name, a.name as accommodation_name 
              FROM bookings b 
              JOIN customers c ON b.customer_id = c.id 
              JOIN accommodations a ON b.accommodation_id = a.id";
    
    if ($status) {
        $query .= " WHERE b.status = '" . $conn->real_escape_string($status) . "'";
    }
    
    $query .= " ORDER BY b.check_in DESC";
    $result = $conn->query($query);
    $bookings = $result->fetch_all(MYSQLI_ASSOC);
    sendJSON(['data' => $bookings]);
}

elseif ($action === 'get' && $method === 'GET') {
    $id = $_GET['id'] ?? null;
    if (!$id) handleError('ID required');
    
    $query = "SELECT b.*, c.first_name, c.last_name, c.email, c.phone, a.name as accommodation_name, a.price_per_night 
              FROM bookings b 
              JOIN customers c ON b.customer_id = c.id 
              JOIN accommodations a ON b.accommodation_id = a.id 
              WHERE b.id = ?";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        handleError('Booking not found', 404);
    }
    
    $booking = $result->fetch_assoc();
    sendJSON(['data' => $booking]);
}

elseif ($action === 'create' && $method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $required = ['customer_id', 'accommodation_id', 'check_in', 'check_out', 'guests', 'total_price'];
    foreach ($required as $field) {
        if (!isset($data[$field])) handleError("$field is required");
    }

    // Generate booking number
    $booking_number = 'BK-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -4));
    
    $customer_id = (int)$data['customer_id'];
    $accommodation_id = (int)$data['accommodation_id'];
    $check_in = $data['check_in'];
    $check_out = $data['check_out'];
    $guests = (int)$data['guests'];
    $total_price = (float)$data['total_price'];
    $notes = $conn->real_escape_string($data['notes'] ?? '');

    $query = "INSERT INTO bookings (booking_number, customer_id, accommodation_id, check_in, check_out, guests, total_price, notes, status) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'confirmed')";
    
    $stmt = $conn->prepare($query);
    // Types: s=string(booking_number), i=customer_id, i=accommodation_id, s=check_in, s=check_out,
    // i=guests, d=total_price (double), s=notes
    $stmt->bind_param('siissids', $booking_number, $customer_id, $accommodation_id, $check_in, $check_out, $guests, $total_price, $notes);
    
    if (!$stmt->execute()) {
        handleError('Failed to create booking');
    }

    $id = $conn->insert_id;
    sendJSON(['success' => true, 'id' => $id, 'booking_number' => $booking_number], 201);
}

elseif ($action === 'update' && $method === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $_GET['id'] ?? null;
    
    if (!$id) handleError('ID required');

    $updates = [];
    $types = '';
    $values = [];

    if (isset($data['status'])) {
        $updates[] = 'status = ?';
        $types .= 's';
        $values[] = $data['status'];
    }
    if (isset($data['check_in'])) {
        $updates[] = 'check_in = ?';
        $types .= 's';
        $values[] = $data['check_in'];
    }
    if (isset($data['check_out'])) {
        $updates[] = 'check_out = ?';
        $types .= 's';
        $values[] = $data['check_out'];
    }
    if (isset($data['total_price'])) {
        $updates[] = 'total_price = ?';
        $types .= 'd';
        $values[] = (float)$data['total_price'];
    }
    if (isset($data['notes'])) {
        $updates[] = 'notes = ?';
        $types .= 's';
        $values[] = $data['notes'];
    }

    if (empty($updates)) {
        handleError('No fields to update');
    }

    $values[] = $id;
    $types .= 'i';

    $query = "UPDATE bookings SET " . implode(', ', $updates) . " WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param($types, ...$values);
    
    if (!$stmt->execute()) {
        handleError('Failed to update booking');
    }

    sendJSON(['success' => true, 'message' => 'Booking updated']);
}

elseif ($action === 'delete' && $method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) handleError('ID required');

    // Soft delete by setting status to cancelled
    $query = "UPDATE bookings SET status = 'cancelled' WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('i', $id);
    
    if (!$stmt->execute()) {
        handleError('Failed to delete booking');
    }

    sendJSON(['success' => true, 'message' => 'Booking cancelled']);
}

else {
    handleError('Invalid action or method', 400);
}
?>
