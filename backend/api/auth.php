<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    handleError('Method not allowed', 405);
}

$action = $_GET['action'] ?? '';

if ($action === 'login') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data || !isset($data['username']) || !isset($data['password'])) {
        handleError('Username and password required');
    }

    $username = $conn->real_escape_string($data['username']);
    $password = $data['password'];

    $query = "SELECT id, username, full_name, role FROM users WHERE username = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('s', $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        handleError('Invalid credentials', 401);
    }

    $user = $result->fetch_assoc();
    
    // For demo purposes, check plain password
    if ($password !== 'admin') {
        handleError('Invalid credentials', 401);
    }

    // Create session token
    $token = bin2hex(random_bytes(32));
    
    sendJSON([
        'success' => true,
        'user' => $user,
        'token' => $token
    ]);
} else {
    handleError('Invalid action');
}
?>
