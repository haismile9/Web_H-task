<?php

require_once __DIR__ . '/vendor/autoload.php';

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->boot();

use App\Services\InstagramCrawlerService;

$service = new InstagramCrawlerService();
$images = $service->getImageUrls('https://www.instagram.com/p/test123/');

echo "Testing InstagramCrawlerService:\n";
echo "Images found: " . count($images) . "\n";
foreach ($images as $index => $image) {
    echo ($index + 1) . ". " . $image . "\n";
}
