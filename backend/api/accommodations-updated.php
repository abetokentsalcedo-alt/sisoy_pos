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

if ($action === 'list' && $method === 'GET') {
    $query = "SELECT * FROM accommodations ORDER BY type ASC, name ASC";
    $result = $conn->query($query);
    $accommodations = $result->fetch_all(MYSQLI_ASSOC);
    sendJSON(['success' => true, 'data' => $accommodations, 'total' => count($accommodations)]);
}

elseif ($action === 'availability' && $method === 'GET') {
    $check_in = $_GET['check_in'] ?? null;
    $check_out = $_GET['check_out'] ?? null;
    
    if (!$check_in || !$check_out) {
        handleError('check_in and check_out dates required');
    }

    $query = "SELECT a.*, 
              CASE 
                WHEN a.status = 'maintenance' THEN 'maintenance'
                WHEN EXISTS (
                  SELECT 1 FROM bookings b 
                  WHERE b.accommodation_id = a.id 
                  AND b.status IN ('confirmed', 'checked-in')
                  AND b.check_in <= ? AND b.check_out >= ?
                ) THEN 'booked'
                ELSE 'available'
              END as availability
              FROM accommodations a
              ORDER BY a.type ASC, a.name ASC";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param('ss', $check_out, $check_in);
    $stmt->execute();
    $result = $stmt->get_result();
    $accommodations = $result->fetch_all(MYSQLI_ASSOC);
    
    sendJSON(['success' => true, 'data' => $accommodations, 'total' => count($accommodations)]);
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
    sendJSON(['success' => true, 'data' => $accommodation]);
}

else {
    handleError('Invalid action or method', 400);
}
?>
