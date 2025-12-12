<?php
// Load environment variables from project .env if available
$envPath = __DIR__ . '/../../.env';
if (file_exists($envPath)) {
    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        [$key, $value] = array_map('trim', explode('=', $line, 2) + [1 => null]);
        if ($key && !getenv($key)) putenv("$key=$value");
        if ($key && !isset($_ENV[$key])) $_ENV[$key] = $value;
        if ($key && !isset($_SERVER[$key])) $_SERVER[$key] = $value;
    }
}

// Database Configuration (fallback to defaults)
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');
define('DB_NAME', getenv('DB_NAME') ?: 'sisoy_booking');
define('DB_PORT', getenv('DB_PORT') ?: 3306);

// Create connection
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]));
}

// Set charset
$conn->set_charset('utf8mb4');

// Enable error reporting
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

function sendJSON($data, $statusCode = 200) {
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    http_response_code($statusCode);
    echo json_encode($data);
    exit;
}

function handleError($message, $statusCode = 400) {
    sendJSON(['error' => $message], $statusCode);
}
?>
