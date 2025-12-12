<?php
require __DIR__ . '/config/database.php';

// Find a customer and an accommodation to reference
$custRes = $conn->query("SELECT id FROM customers ORDER BY id DESC LIMIT 1");
$accRes = $conn->query("SELECT id FROM accommodations ORDER BY id DESC LIMIT 1");

$cust = $custRes->fetch_assoc();
$acc = $accRes->fetch_assoc();

if (!$cust || !$acc) {
    echo json_encode(['success' => false, 'error' => 'No customer or accommodation found. Create a customer and accommodation first.']);
    exit;
}

$customer_id = (int)$cust['id'];
$accommodation_id = (int)$acc['id'];
$check_in = date('Y-m-d', strtotime('+1 day'));
$check_out = date('Y-m-d', strtotime('+3 days'));
$guests = 2;
$total_price = 1234.56;

$booking_number = 'CLI-BK-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -4));

$query = "INSERT INTO bookings (booking_number, customer_id, accommodation_id, check_in, check_out, guests, total_price, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'confirmed')";
$stmt = $conn->prepare($query);
$notes = 'Inserted via CLI test';
$stmt->bind_param('siissids', $booking_number, $customer_id, $accommodation_id, $check_in, $check_out, $guests, $total_price, $notes);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'id' => $conn->insert_id]);
} else {
    echo json_encode(['success' => false, 'error' => $stmt->error]);
}

$stmt->close();
$conn->close();

?>
