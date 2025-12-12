<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/database.php';

$action = $_GET['action'] ?? '';

if ($action === 'daily' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $month = $_GET['month'] ?? date('Y-m');
    
    $query = "SELECT DATE_FORMAT(b.check_in, '%Y-%m-%d') as date, 
                     SUM(b.total_price) as revenue, 
                     COUNT(*) as bookings_count,
                     SUM(CASE WHEN b.status = 'checked-in' THEN 1 ELSE 0 END) as checked_in
              FROM bookings b 
              WHERE DATE_FORMAT(b.check_in, '%Y-%m') = ? AND b.status != 'cancelled'
              GROUP BY DATE(b.check_in) 
              ORDER BY b.check_in DESC";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param('s', $month);
    $stmt->execute();
    $result = $stmt->get_result();
    $dailyData = $result->fetch_all(MYSQLI_ASSOC);
    
    sendJSON(['data' => $dailyData]);
}

elseif ($action === 'monthly' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $year = $_GET['year'] ?? date('Y');
    
    $query = "SELECT DATE_FORMAT(b.check_in, '%Y-%m') as month, 
                     SUM(b.total_price) as revenue, 
                     COUNT(*) as bookings_count,
                     COUNT(DISTINCT b.accommodation_id) as rooms_booked
              FROM bookings b 
              WHERE YEAR(b.check_in) = ? AND b.status != 'cancelled'
              GROUP BY DATE_FORMAT(b.check_in, '%Y-%m') 
              ORDER BY month DESC";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param('s', $year);
    $stmt->execute();
    $result = $stmt->get_result();
    $monthlyData = $result->fetch_all(MYSQLI_ASSOC);
    
    sendJSON(['data' => $monthlyData]);
}

elseif ($action === 'occupancy' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $query = "SELECT a.name, a.type, 
                     SUM(DATEDIFF(b.check_out, b.check_in)) as occupied_days,
                     COUNT(*) as bookings_count
              FROM bookings b 
              JOIN accommodations a ON b.accommodation_id = a.id 
              WHERE b.status != 'cancelled'
              GROUP BY a.id 
              ORDER BY occupied_days DESC";
    
    $result = $conn->query($query);
    $occupancyData = $result->fetch_all(MYSQLI_ASSOC);
    
    sendJSON(['data' => $occupancyData]);
}

else {
    handleError('Invalid action', 400);
}
?>
