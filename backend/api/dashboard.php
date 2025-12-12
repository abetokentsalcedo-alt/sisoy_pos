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

if ($action === 'stats' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    // Total Revenue
    $revenue = $conn->query("SELECT SUM(total_price) as total FROM bookings WHERE status != 'cancelled'");
    $totalRevenue = $revenue->fetch_assoc()['total'] ?? 0;

    // Total Bookings
    $bookings = $conn->query("SELECT COUNT(*) as count FROM bookings WHERE status != 'cancelled'");
    $totalBookings = $bookings->fetch_assoc()['count'] ?? 0;

    // Occupied Rooms Today
    $today = date('Y-m-d');
    $occupied = $conn->query("SELECT COUNT(DISTINCT accommodation_id) as count FROM bookings 
                              WHERE status IN ('checked-in', 'confirmed') 
                              AND check_in <= '$today' AND check_out > '$today'");
    $occupiedRooms = $occupied->fetch_assoc()['count'] ?? 0;

    // Available Rooms
    $total_rooms = $conn->query("SELECT COUNT(*) as count FROM accommodations WHERE status = 'active'");
    $totalRooms = $total_rooms->fetch_assoc()['count'] ?? 0;
    $availableRooms = $totalRooms - $occupiedRooms;

    sendJSON([
        'totalRevenue' => (float)$totalRevenue,
        'totalBookings' => (int)$totalBookings,
        'occupiedRooms' => (int)$occupiedRooms,
        'availableRooms' => (int)$availableRooms,
        'totalRooms' => (int)$totalRooms
    ]);
}

elseif ($action === 'today-bookings' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $today = date('Y-m-d');
    $tomorrow = date('Y-m-d', strtotime('+1 day'));
    
    $query = "SELECT b.id, b.booking_number, c.first_name, c.last_name, a.name, b.guests, b.total_price, b.status 
              FROM bookings b 
              JOIN customers c ON b.customer_id = c.id 
              JOIN accommodations a ON b.accommodation_id = a.id 
              WHERE b.check_in = '$today' OR (b.status = 'checked-in' AND b.check_out = '$tomorrow')
              ORDER BY b.check_in DESC LIMIT 10";
    
    $result = $conn->query($query);
    $todayBookings = $result->fetch_all(MYSQLI_ASSOC);
    
    sendJSON(['data' => $todayBookings]);
}

else {
    handleError('Invalid action', 400);
}
?>
