<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/database.php';

$action = $_GET['action'] ?? '';

if ($action === 'get' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $booking_id = $_GET['booking_id'] ?? null;
    if (!$booking_id) handleError('Booking ID required');
    
    $query = "SELECT * FROM payments WHERE booking_id = ? ORDER BY created_at DESC";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('i', $booking_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $payments = $result->fetch_all(MYSQLI_ASSOC);
    
    sendJSON(['data' => $payments]);
}

elseif ($action === 'process' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $required = ['booking_id', 'amount', 'payment_method'];
    foreach ($required as $field) {
        if (!isset($data[$field])) handleError("$field is required");
    }

    $booking_id = (int)$data['booking_id'];
    $amount = (float)$data['amount'];
    $payment_method = $data['payment_method'];
    $transaction_id = $data['transaction_id'] ?? 'TXN-' . time();

    // Verify booking exists
    $booking_check = $conn->query("SELECT id FROM bookings WHERE id = $booking_id");
    if ($booking_check->num_rows === 0) {
        handleError('Booking not found', 404);
    }

    // Create payment record
    $query = "INSERT INTO payments (booking_id, amount, payment_method, status, transaction_id) 
              VALUES (?, ?, ?, 'completed', ?)";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param('idss', $booking_id, $amount, $payment_method, $transaction_id);
    
    if (!$stmt->execute()) {
        handleError('Failed to process payment');
    }

    $payment_id = $conn->insert_id;
    
    sendJSON([
        'success' => true,
        'payment_id' => $payment_id,
        'transaction_id' => $transaction_id,
        'message' => 'Payment processed successfully'
    ], 201);
}

elseif ($action === 'refund' && $_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);
    $payment_id = $_GET['id'] ?? null;
    
    if (!$payment_id) handleError('Payment ID required');

    $query = "UPDATE payments SET status = 'refunded' WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('i', $payment_id);
    
    if (!$stmt->execute()) {
        handleError('Failed to refund payment');
    }

    sendJSON(['success' => true, 'message' => 'Payment refunded']);
}

else {
    handleError('Invalid action or method', 400);
}
?>
