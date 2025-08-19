<?php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'sanctum/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['*'], // Allow all origins for development
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'supports_credentials' => true,
];
