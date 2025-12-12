<?php
// Simple HTTP POST tester for bookings API
$url = 'http://localhost/pos-booking-system/backend/api/bookings.php?action=create';
$data = [
    'customer_id' => 3,
    'accommodation_id' => 1,
    'check_in' => date('Y-m-d', strtotime('+1 day')),
    'check_out' => date('Y-m-d', strtotime('+3 days')),
    'guests' => 1,
    'total_price' => 200.50,
];

$options = [
    'http' => [
        'header'  => "Content-type: application/json\r\n",
        'method'  => 'POST',
        'content' => json_encode($data),
        'ignore_errors' => true,
    ],
];

$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);
if ($result === false) {
    echo "Request failed\n";
    print_r($http_response_header);
    exit(1);
}

echo "Response:\n";
echo $result . "\n";
echo "HTTP headers:\n";
print_r($http_response_header);

?>
