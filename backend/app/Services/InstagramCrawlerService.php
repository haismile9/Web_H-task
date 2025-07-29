<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Log;

class InstagramCrawlerService
{
    protected $client;

    public function __construct()
    {
        $this->client = new Client([
            'timeout' => 30,
            'headers' => [
                'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language' => 'en-US,en;q=0.5',
                'Accept-Encoding' => 'gzip, deflate',
                'Connection' => 'keep-alive',
            ]
        ]);
    }

    public function crawlPost(string $url): array
    {
        try {
            // Extract Instagram post ID from URL
            $postId = $this->extractPostId($url);
            if (!$postId) {
                throw new \Exception('Invalid Instagram URL');
            }

            // Try to get post data via Instagram's embed endpoint
            $embedUrl = "https://www.instagram.com/p/{$postId}/embed/";
            
            $response = $this->client->get($embedUrl);
            $html = $response->getBody()->getContents();

            // Parse the HTML to extract data
            $data = $this->parseInstagramEmbed($html, $url);
            
            return $data;

        } catch (RequestException $e) {
            Log::error('Instagram crawl failed: ' . $e->getMessage());
            throw new \Exception('Failed to fetch Instagram post data');
        }
    }

    protected function extractPostId(string $url): ?string
    {
        // Handle different Instagram URL formats
        $patterns = [
            '/instagram\.com\/p\/([A-Za-z0-9_-]+)/',
            '/instagram\.com\/reel\/([A-Za-z0-9_-]+)/',
            '/instagram\.com\/tv\/([A-Za-z0-9_-]+)/',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $url, $matches)) {
                return $matches[1];
            }
        }

        return null;
    }

    protected function parseInstagramEmbed(string $html, string $originalUrl): array
    {
        // Extract data from the embed HTML
        $data = [
            'title' => null,
            'caption' => null,
            'image_urls' => [],
            'username' => null,
            'instagram_id' => null,
            'likes_count' => 0,
            'posted_at' => null,
        ];

        // Try to extract image URLs
        preg_match_all('/"display_url":"([^"]+)"/', $html, $imageMatches);
        if (!empty($imageMatches[1])) {
            $data['image_urls'] = array_map(function($url) {
                return str_replace('\u0026', '&', $url);
            }, $imageMatches[1]);
        }

        // Try to extract caption
        if (preg_match('/"edge_media_to_caption":\{"edges":\[\{"node":\{"text":"([^"]+)"/', $html, $captionMatch)) {
            $data['caption'] = html_entity_decode($captionMatch[1]);
            $data['title'] = $this->extractTitle($data['caption']);
        }

        // Try to extract username
        if (preg_match('/"owner":\{"username":"([^"]+)"/', $html, $usernameMatch)) {
            $data['username'] = $usernameMatch[1];
        }

        // If no images found, try alternative method
        if (empty($data['image_urls'])) {
            preg_match_all('/src="([^"]*instagram[^"]*)"/', $html, $altImageMatches);
            if (!empty($altImageMatches[1])) {
                $data['image_urls'] = array_filter($altImageMatches[1], function($url) {
                    return strpos($url, 'instagram') !== false && strpos($url, '.jpg') !== false;
                });
            }
        }

        // Fallback: if still no images, create a placeholder
        if (empty($data['image_urls'])) {
            $data['image_urls'] = ['https://via.placeholder.com/400x400?text=Instagram+Post'];
        }

        $data['instagram_id'] = $this->extractPostId($originalUrl);

        return $data;
    }

    protected function extractTitle(string $caption): string
    {
        // Extract first line or first sentence as title
        $lines = explode("\n", $caption);
        $firstLine = trim($lines[0]);
        
        if (strlen($firstLine) > 100) {
            return substr($firstLine, 0, 97) . '...';
        }
        
        return $firstLine ?: 'Instagram Post';
    }
}
