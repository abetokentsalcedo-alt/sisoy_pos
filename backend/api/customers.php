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
    $query = "SELECT * FROM customers ORDER BY created_at DESC";
    $result = $conn->query($query);
    $customers = $result->fetch_all(MYSQLI_ASSOC);
    sendJSON(['data' => $customers]);
}

elseif ($action === 'search' && $method === 'GET') {
    $term = $_GET['term'] ?? '';
    if (strlen($term) < 2) {
        handleError('Search term too short');
    }

    $term = '%' . $conn->real_escape_string($term) . '%';
    $query = "SELECT * FROM customers WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR phone LIKE ? LIMIT 10";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param('ssss', $term, $term, $term, $term);
    $stmt->execute();
    $result = $stmt->get_result();
    $customers = $result->fetch_all(MYSQLI_ASSOC);
    
    sendJSON(['data' => $customers]);
}

elseif ($action === 'create' && $method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $required = ['first_name', 'last_name'];
    foreach ($required as $field) {
        if (!isset($data[$field])) handleError("$field is required");
    }

    $first_name = $conn->real_escape_string($data['first_name']);
    $last_name = $conn->real_escape_string($data['last_name']);
    $email = $conn->real_escape_string($data['email'] ?? '');
    $phone = $conn->real_escape_string($data['phone'] ?? '');
    $address = $conn->real_escape_string($data['address'] ?? '');
    $city = $conn->real_escape_string($data['city'] ?? '');
    $country = $conn->real_escape_string($data['country'] ?? '');

    $query = "INSERT INTO customers (first_name, last_name, email, phone, address, city, country) 
              VALUES (?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param('sssssss', $first_name, $last_name, $email, $phone, $address, $city, $country);
    
    if (!$stmt->execute()) {
        handleError('Failed to create customer');
    }

    $id = $conn->insert_id;
    sendJSON(['success' => true, 'id' => $id], 201);
}

else {
    handleError('Invalid action or method', 400);
}
?>
