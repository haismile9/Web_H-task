<?php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'http://127.0.0.1:5173',
        'http://localhost:5173',
        'https://web-h-task-o43rg5et9-nguyenhonghaimwg2005-5242s-projects.vercel.app',
        'https://*.vercel.app',
    ],
    'allowed_origins_patterns' => [
        'https://*-nguyenhonghaimwg2005-5242s-projects\.vercel\.app',
    ],
    'allowed_headers' => ['*'],
    'supports_credentials' => true,
];
