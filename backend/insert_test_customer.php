<?php
require __DIR__ . '/config/database.php';

$first = 'TestFirst_' . time();
$last = 'TestLast';
$email = 'test+' . time() . '@example.com';

$stmt = $conn->prepare("INSERT INTO customers (first_name, last_name, email) VALUES (?, ?, ?)");
$stmt->bind_param('sss', $first, $last, $email);
if ($stmt->execute()) {
    echo json_encode(['success' => true, 'id' => $conn->insert_id, 'first_name' => $first]);
} else {
    echo json_encode(['success' => false, 'error' => $conn->error]);
}

$stmt->close();
$conn->close();

?>
