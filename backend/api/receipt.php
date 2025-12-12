<?php
// Receipt generation API
header('Content-Type: application/json');
require_once '../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
  $bookingId = $_GET['booking_id'] ?? null;
  
  if (!$bookingId) {
    http_response_code(400);
    echo json_encode(['error' => 'Booking ID is required']);
    exit;
  }

  $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
  if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
  }

  // Get booking details with client and accommodation info
  $query = "
    SELECT 
      b.id, b.total_amount, b.date_from, b.date_to, 
      b.status, b.transaction_id, b.created_at,
      c.first_name, c.last_name,
      a.name as accommodation_name, a.price_per_night
    FROM bookings b
    JOIN clients c ON b.client_id = c.id
    JOIN accommodations a ON b.accommodation_id = a.id
    WHERE b.id = ?
  ";

  $stmt = $conn->prepare($query);
  $stmt->bind_param("s", $bookingId);
  $stmt->execute();
  $result = $stmt->get_result();
  
  if ($result->num_rows === 0) {
    http_response_code(404);
    echo json_encode(['error' => 'Booking not found']);
    exit;
  }

  $booking = $result->fetch_assoc();

  // Calculate nights
  $checkIn = new DateTime($booking['date_from']);
  $checkOut = new DateTime($booking['date_to']);
  $nights = $checkOut->diff($checkIn)->days;

  echo json_encode([
    'success' => true,
    'receipt' => [
      'booking_id' => $booking['id'],
      'guest_name' => $booking['first_name'] . ' ' . $booking['last_name'],
      'accommodation' => $booking['accommodation_name'],
      'check_in' => $booking['date_from'],
      'check_out' => $booking['date_to'],
      'nights' => $nights,
      'price_per_night' => $booking['price_per_night'],
      'total_amount' => $booking['total_amount'],
      'transaction_id' => $booking['transaction_id'],
      'issued_date' => $booking['created_at']
    ]
  ]);

  $stmt->close();
  $conn->close();
  exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
?>
