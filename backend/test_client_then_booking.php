<?php
// Create a customer via API, then create a booking referencing that customer
$apiBase = 'http://localhost/pos-booking-system/backend/api';

// Create customer
$custData = [
    'first_name' => 'WebTestFirst_' . time(),
    'last_name' => 'WebTestLast',
    'email' => 'webtest+' . time() . '@example.com',
    'phone' => '09171234567',
    'address' => 'Test Address',
];

$opts = [
    'http' => [
        'header' => "Content-Type: application/json\r\n",
        'method' => 'POST',
        'content' => json_encode($custData),
        'ignore_errors' => true,
    ],
];

$context = stream_context_create($opts);
$custResp = file_get_contents($apiBase . '/customers.php?action=create', false, $context);
echo "Customer create response:\n";
echo $custResp . "\n";

$cj = json_decode($custResp, true);
if (!($cj && isset($cj['id']))) {
    echo "Failed to create customer via API\n";
    exit(1);
}

$customerId = $cj['id'];

// Determine an accommodation id from the API
$accList = @file_get_contents($apiBase . '/accommodations.php?action=list');
$accId = 1;
if ($accList) {
    $aj = json_decode($accList, true);
    if ($aj && isset($aj['data'][0]['id'])) {
        $accId = $aj['data'][0]['id'];
    }
}

// Create booking
$bookingData = [
    'customer_id' => $customerId,
    'accommodation_id' => $accId,
    'check_in' => date('Y-m-d', strtotime('+2 days')),
    'check_out' => date('Y-m-d', strtotime('+4 days')),
    'guests' => 2,
    'total_price' => 500.75,
];

$opts2 = [
    'http' => [
        'header' => "Content-Type: application/json\r\n",
        'method' => 'POST',
        'content' => json_encode($bookingData),
        'ignore_errors' => true,
    ],
];

$context2 = stream_context_create($opts2);
$bookResp = file_get_contents($apiBase . '/bookings.php?action=create', false, $context2);
echo "Booking create response:\n";
echo $bookResp . "\n";

?>
