<?php
return [
    'pusher' => [
    'driver' => 'pusher',
    'key' => env('PUSHER_APP_KEY', 'local'),
    'secret' => env('PUSHER_APP_SECRET', 'secret'),
    'app_id' => env('PUSHER_APP_ID', 'app-id'),
    'options' => [
        'cluster' => env('PUSHER_APP_CLUSTER', 'mt1'),
        'useTLS' => true,
        'host' => '127.0.0.1',
        'port' => 6001,
        'scheme' => 'http',
    ],
],
];
