<?php
// Simple DB connection tester
require __DIR__ . '/config/database.php';

$ok = (isset($conn) && !$conn->connect_error);
header('Content-Type: application/json');
echo json_encode(['connected' => $ok, 'error' => $conn->connect_error ?? null]);

?>
