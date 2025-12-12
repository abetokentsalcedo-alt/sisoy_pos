<?php
// Enhanced bookings API with receipt support
header('Content-Type: application/json');
require_once '../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
  $data = json_decode(file_get_contents('php://input'), true);
  
  $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
  if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
  }

  // Create new booking
  $id = 'BK' . time();
  $clientId = $data['client_id'] ?? null;
  $accommodationId = $data['accommodation_id'] ?? null;
  $dateFrom = $data['date_from'] ?? null;
  $dateTo = $data['date_to'] ?? null;
  $totalAmount = $data['total_amount'] ?? 0;

  if (!$clientId || !$accommodationId || !$dateFrom || !$dateTo) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
  }

  // Calculate nights
  $from = new DateTime($dateFrom);
  $to = new DateTime($dateTo);
  $nights = $to->diff($from)->days;

  $query = "
    INSERT INTO bookings 
    (id, client_id, accommodation_id, date_from, date_to, status, total_amount, payment_status, receipt_generated)
    VALUES (?, ?, ?, ?, ?, 'confirmed', ?, 'paid', FALSE)
  ";

  $stmt = $conn->prepare($query);
  $stmt->bind_param("sssssd", $id, $clientId, $accommodationId, $dateFrom, $dateTo, $totalAmount);

  if ($stmt->execute()) {
    // Create payment record
    $transactionId = 'TXN' . time();
    $paymentQuery = "
      INSERT INTO payments (id, booking_id, amount, payment_method, transaction_id)
      VALUES (?, ?, ?, ?, ?)
    ";
    
    $paymentId = 'PMT' . time();
    $method = $data['payment_method'] ?? 'cash';
    $paymentStmt = $conn->prepare($paymentQuery);
    $paymentStmt->bind_param("ssdss", $paymentId, $id, $totalAmount, $method, $transactionId);
    $paymentStmt->execute();

    echo json_encode([
      'success' => true,
      'booking' => [
        'id' => $id,
        'client_id' => $clientId,
        'accommodation_id' => $accommodationId,
        'date_from' => $dateFrom,
        'date_to' => $dateTo,
        'nights' => $nights,
        'total_amount' => $totalAmount,
        'status' => 'confirmed',
        'payment_status' => 'paid',
        'transaction_id' => $transactionId
      ]
    ]);
  } else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to create booking']);
  }

  $stmt->close();
  $conn->close();
  exit;
}

if ($method === 'GET') {
  $bookingId = $_GET['id'] ?? null;
  
  if ($bookingId) {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if ($conn->connect_error) {
      http_response_code(500);
      echo json_encode(['error' => 'Database connection failed']);
      exit;
    }

    $query = "SELECT * FROM bookings WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $bookingId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
      echo json_encode([
        'success' => true,
        'booking' => $result->fetch_assoc()
      ]);
    } else {
      http_response_code(404);
      echo json_encode(['error' => 'Booking not found']);
    }

    $stmt->close();
    $conn->close();
  }
  exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
?>
