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

function sendJSON($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

function handleError($message, $code = 400) {
    sendJSON(['error' => $message], $code);
}

if ($action === 'create' && $method === 'POST') {
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
    $stmt->bind_param('siissiis', $booking_number, $customer_id, $accommodation_id, $check_in, $check_out, $guests, $total_price, $notes);
    
    if (!$stmt->execute()) {
        handleError('Failed to create booking');
    }

    $id = $conn->insert_id;
    $payment_query = "INSERT INTO payments (booking_id, amount, payment_method, status) VALUES (?, ?, 'cash', 'pending')";
    $payment_stmt = $conn->prepare($payment_query);
    $payment_stmt->bind_param('id', $id, $total_price);
    $payment_stmt->execute();

    sendJSON(['success' => true, 'id' => $id, 'booking_number' => $booking_number], 201);
}

elseif ($action === 'list' && $method === 'GET') {
    $status = $_GET['status'] ?? '';
    $query = "SELECT b.*, c.first_name, c.last_name, a.name as accommodation_name, a.type as accommodation_type
              FROM bookings b 
              JOIN customers c ON b.customer_id = c.id 
              JOIN accommodations a ON b.accommodation_id = a.id";
    
    if ($status) {
        $query .= " WHERE b.status = '" . $conn->real_escape_string($status) . "'";
    }
    
    $query .= " ORDER BY b.check_in DESC";
    $result = $conn->query($query);
    $bookings = $result->fetch_all(MYSQLI_ASSOC);
    sendJSON(['success' => true, 'data' => $bookings, 'total' => count($bookings)]);
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
    sendJSON(['success' => true, 'data' => $booking]);
}

else {
    handleError('Invalid action or method', 400);
}
?>
