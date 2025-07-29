<?php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
        'allowed_origins' => [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'https://web-h-task-dspris3yo-nguyenhonghaimwg2005-5242s-projects.vercel.app',
        'https://*.vercel.app', // Allow all Vercel subdomains
    ],
    'allowed_origins_patterns' => [
        'https://*-nguyenhonghaimwg2005-5242s-projects\.vercel\.app',
    ],
    'allowed_headers' => ['*'],
    'supports_credentials' => true,
];
