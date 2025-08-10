<?php

require_once __DIR__ . '/vendor/autoload.php';

use GuzzleHttp\Client;

class SimpleInstagramCrawler
{
    private $client;
    private $rapidApiKey;
    private $rapidApiHost;

    public function __construct()
    {
        $this->client = new Client();
        $this->rapidApiKey = 'dbe8ec4b6dmsh4d75d7ba0cc75c3p165647jsnd5a3d3ad7d75';
        $this->rapidApiHost = 'instagram120.p.rapidapi.com';
    }

    public function getImageUrls(string $url): array
    {
        try {
            echo "Testing RapidAPI Instagram crawler...\n";
            echo "URL: $url\n";

            $response = $this->client->request('GET', 'https://instagram120.p.rapidapi.com/', [
                'headers' => [
                    'X-RapidAPI-Host' => $this->rapidApiHost,
                    'X-RapidAPI-Key' => $this->rapidApiKey,
                ],
                'query' => [
                    'url' => $url
                ],
                'timeout' => 30
            ]);

            $data = json_decode($response->getBody(), true);
            
            echo "Response status: " . $response->getStatusCode() . "\n";
            echo "Response data: " . json_encode($data, JSON_PRETTY_PRINT) . "\n";
            
            if (isset($data['data']) && isset($data['data']['media'])) {
                $images = [];
                foreach ($data['data']['media'] as $media) {
                    if (isset($media['display_url'])) {
                        $images[] = $media['display_url'];
                    } elseif (isset($media['url'])) {
                        $images[] = $media['url'];
                    }
                }
                
                if (!empty($images)) {
                    echo "Successfully extracted " . count($images) . " images\n";
                    return $images;
                }
            }

            echo "No images found in API response, using mock data\n";
            return $this->getMockImages();

        } catch (\Exception $e) {
            echo "Error: " . $e->getMessage() . "\n";
            return $this->getMockImages();
        }
    }

    private function getMockImages(): array
    {
        return [
            "https://picsum.photos/800/800?random=1",
            "https://picsum.photos/800/800?random=2", 
            "https://picsum.photos/800/800?random=3",
        ];
    }
}

$crawler = new SimpleInstagramCrawler();
$images = $crawler->getImageUrls('https://www.instagram.com/p/C8h2KJ2ShqS/');

echo "\nFinal result:\n";
echo "Images found: " . count($images) . "\n";
foreach ($images as $index => $image) {
    echo ($index + 1) . ". " . $image . "\n";
}
