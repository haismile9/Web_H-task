<?php

require_once __DIR__ . '/vendor/autoload.php';

use GuzzleHttp\Client;

$client = new Client();
$rapidApiKey = 'dbe8ec4b6dmsh4d75d7ba0cc75c3p165647jsnd5a3d3ad7d75';
$rapidApiHost = 'instagram120.p.rapidapi.com';

// Thử các endpoint từ hình ảnh
$endpoints = [
    '/get',
    '/his', 
    '/links',
    '/profile',
    '/stories',
    '/story',
    '/highlights',
    '/highlight_stories',
    '/userInfo',
    '/reels',
    '/posts'
];

foreach ($endpoints as $endpoint) {
    try {
        echo "Testing endpoint: $endpoint\n";
        
        $response = $client->request('GET', "https://instagram120.p.rapidapi.com$endpoint", [
            'headers' => [
                'X-RapidAPI-Host' => $rapidApiHost,
                'X-RapidAPI-Key' => $rapidApiKey,
            ],
            'timeout' => 10
        ]);

        echo "Status: " . $response->getStatusCode() . "\n";
        echo "Response: " . $response->getBody() . "\n\n";
        break; // Nếu endpoint hoạt động, dừng lại
        
    } catch (\Exception $e) {
        echo "Error: " . $e->getMessage() . "\n\n";
    }
}
