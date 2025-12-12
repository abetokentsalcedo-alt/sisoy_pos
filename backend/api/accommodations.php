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
    $query = "SELECT * FROM accommodations ORDER BY name ASC";
    $result = $conn->query($query);
    $accommodations = $result->fetch_all(MYSQLI_ASSOC);
    sendJSON(['data' => $accommodations]);
}

elseif ($action === 'get' && $method === 'GET') {
    $id = $_GET['id'] ?? null;
    if (!$id) handleError('ID required');
    
    $query = "SELECT * FROM accommodations WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        handleError('Accommodation not found', 404);
    }
    
    $accommodation = $result->fetch_assoc();
    sendJSON(['data' => $accommodation]);
}

elseif ($action === 'create' && $method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $required = ['name', 'type', 'capacity', 'price_per_night'];
    foreach ($required as $field) {
        if (!isset($data[$field])) handleError("$field is required");
    }

    $name = $conn->real_escape_string($data['name']);
    $type = $data['type'];
    $capacity = (int)$data['capacity'];
    $price = (float)$data['price_per_night'];
    $description = $conn->real_escape_string($data['description'] ?? '');
    $amenities = isset($data['amenities']) ? json_encode($data['amenities']) : NULL;

    $query = "INSERT INTO accommodations (name, type, capacity, price_per_night, description, amenities) 
              VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('ssidss', $name, $type, $capacity, $price, $description, $amenities);
    
    if (!$stmt->execute()) {
        handleError('Failed to create accommodation');
    }

    $id = $conn->insert_id;
    sendJSON(['success' => true, 'id' => $id, 'message' => 'Accommodation created'], 201);
}

elseif ($action === 'update' && $method === 'PUT') {
    parse_str(file_get_contents('php://input'), $data);
    $id = $_GET['id'] ?? null;
    
    if (!$id) handleError('ID required');

    $updates = [];
    $types = '';
    $values = [];

    if (isset($data['name'])) {
        $updates[] = 'name = ?';
        $types .= 's';
        $values[] = $data['name'];
    }
    if (isset($data['type'])) {
        $updates[] = 'type = ?';
        $types .= 's';
        $values[] = $data['type'];
    }
    if (isset($data['capacity'])) {
        $updates[] = 'capacity = ?';
        $types .= 'i';
        $values[] = (int)$data['capacity'];
    }
    if (isset($data['price_per_night'])) {
        $updates[] = 'price_per_night = ?';
        $types .= 'd';
        $values[] = (float)$data['price_per_night'];
    }
    if (isset($data['status'])) {
        $updates[] = 'status = ?';
        $types .= 's';
        $values[] = $data['status'];
    }

    if (empty($updates)) {
        handleError('No fields to update');
    }

    $values[] = $id;
    $types .= 'i';

    $query = "UPDATE accommodations SET " . implode(', ', $updates) . " WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param($types, ...$values);
    
    if (!$stmt->execute()) {
        handleError('Failed to update accommodation');
    }

    sendJSON(['success' => true, 'message' => 'Accommodation updated']);
}

elseif ($action === 'delete' && $method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) handleError('ID required');

    $query = "DELETE FROM accommodations WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('i', $id);
    
    if (!$stmt->execute()) {
        handleError('Failed to delete accommodation');
    }

    sendJSON(['success' => true, 'message' => 'Accommodation deleted']);
}

else {
    handleError('Invalid action or method', 400);
}
?>
