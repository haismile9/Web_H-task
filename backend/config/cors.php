<?php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['*'], // Allow all origins for development
    'allowed_origins_patterns' => [
        'https://*-nguyenhonghaimwg2005-5242s-projects\.vercel\.app',
    ],
    'allowed_headers' => ['*'],
    'supports_credentials' => true,
];
