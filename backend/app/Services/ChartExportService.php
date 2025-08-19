<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ChartExportService
{
    /**
     * Generate chart image from data using Chart.js via Node.js
     */
    public function generateChartImage($chartData, $chartType = 'bar', $options = [])
    {
        try {
            // Default options
            $defaultOptions = [
                'width' => 800,
                'height' => 600,
                'backgroundColor' => '#ffffff',
                'title' => 'Progress Report Chart',
                'subtitle' => '',
            ];

            $options = array_merge($defaultOptions, $options);

            // Prepare chart configuration
            $chartConfig = $this->prepareChartConfig($chartData, $chartType, $options);

            // Generate unique filename
            $filename = 'chart_' . time() . '_' . uniqid() . '.png';
            $filepath = storage_path('app/public/charts/' . $filename);

            // Ensure directory exists
            if (!file_exists(dirname($filepath))) {
                mkdir(dirname($filepath), 0777, true);
            }

            // Generate chart using different methods based on available tools
            if ($this->generateWithCanvasJS($chartConfig, $filepath)) {
                return [
                    'success' => true,
                    'filename' => $filename,
                    'path' => $filepath,
                    'url' => asset('storage/charts/' . $filename)
                ];
            }

            // Fallback: Generate with PHP GD (basic charts)
            if ($this->generateWithGD($chartData, $chartType, $filepath, $options)) {
                return [
                    'success' => true,
                    'filename' => $filename,
                    'path' => $filepath,
                    'url' => asset('storage/charts/' . $filename)
                ];
            }

            return [
                'success' => false,
                'message' => 'Could not generate chart image'
            ];

        } catch (\Exception $e) {
            Log::error('Chart generation failed: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Chart generation failed: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Generate chart with CanvasJS (requires Node.js script)
     */
    private function generateWithCanvasJS($chartConfig, $filepath)
    {
        // This would require a Node.js script with canvas and Chart.js
        // For now, we'll return false to use fallback
        return false;
    }

    /**
     * Generate basic chart with PHP GD library
     */
    private function generateWithGD($data, $type, $filepath, $options)
    {
        if (!extension_loaded('gd')) {
            return false;
        }

        $width = $options['width'];
        $height = $options['height'];

        // Create image
        $image = imagecreate($width, $height);
        
        // Colors
        $backgroundColor = imagecolorallocate($image, 255, 255, 255);
        $textColor = imagecolorallocate($image, 0, 0, 0);
        $chartColors = [
            imagecolorallocate($image, 54, 162, 235),  // Blue
            imagecolorallocate($image, 255, 99, 132),  // Red
            imagecolorallocate($image, 255, 205, 86),  // Yellow
            imagecolorallocate($image, 75, 192, 192),  // Green
            imagecolorallocate($image, 153, 102, 255), // Purple
            imagecolorallocate($image, 255, 159, 64),  // Orange
        ];

        // Draw background
        imagefill($image, 0, 0, $backgroundColor);

        // Draw title
        $title = $options['title'];
        $titleX = ($width - strlen($title) * 10) / 2;
        imagestring($image, 5, $titleX, 20, $title, $textColor);

        if ($type === 'bar') {
            $this->drawBarChart($image, $data, $chartColors, $textColor, $width, $height);
        } elseif ($type === 'pie') {
            $this->drawPieChart($image, $data, $chartColors, $textColor, $width, $height);
        }

        // Save image
        $result = imagepng($image, $filepath);
        imagedestroy($image);

        return $result;
    }

    /**
     * Draw bar chart with GD
     */
    private function drawBarChart($image, $data, $colors, $textColor, $width, $height)
    {
        if (empty($data)) return;

        $marginLeft = 80;
        $marginRight = 50;
        $marginTop = 80;
        $marginBottom = 80;

        $chartWidth = $width - $marginLeft - $marginRight;
        $chartHeight = $height - $marginTop - $marginBottom;

        // Find max value
        $maxValue = 0;
        foreach ($data as $item) {
            $value = $item['completion_percentage'] ?? $item['value'] ?? 0;
            if ($value > $maxValue) $maxValue = $value;
        }

        if ($maxValue == 0) $maxValue = 100;

        // Draw bars
        $barWidth = $chartWidth / count($data) - 10;
        $x = $marginLeft + 5;

        $colorIndex = 0;
        foreach ($data as $item) {
            $value = $item['completion_percentage'] ?? $item['value'] ?? 0;
            $label = $item['name'] ?? $item['label'] ?? '';

            $barHeight = ($value / $maxValue) * $chartHeight;
            $barTop = $marginTop + $chartHeight - $barHeight;

            // Draw bar
            $color = $colors[$colorIndex % count($colors)];
            imagefilledrectangle($image, $x, $barTop, $x + $barWidth, $marginTop + $chartHeight, $color);

            // Draw value on top of bar
            $valueText = number_format($value, 1) . '%';
            imagestring($image, 3, $x + ($barWidth - strlen($valueText) * 6) / 2, $barTop - 20, $valueText, $textColor);

            // Draw label
            if (strlen($label) > 10) $label = substr($label, 0, 10) . '...';
            imagestring($image, 2, $x + ($barWidth - strlen($label) * 6) / 2, $marginTop + $chartHeight + 10, $label, $textColor);

            $x += $barWidth + 10;
            $colorIndex++;
        }

        // Draw axes
        imageline($image, $marginLeft, $marginTop, $marginLeft, $marginTop + $chartHeight, $textColor);
        imageline($image, $marginLeft, $marginTop + $chartHeight, $marginLeft + $chartWidth, $marginTop + $chartHeight, $textColor);

        // Draw Y-axis labels
        for ($i = 0; $i <= 4; $i++) {
            $value = ($maxValue / 4) * $i;
            $y = $marginTop + $chartHeight - ($chartHeight / 4) * $i;
            imagestring($image, 2, 10, $y - 6, number_format($value, 0) . '%', $textColor);
            imageline($image, $marginLeft - 5, $y, $marginLeft, $y, $textColor);
        }
    }

    /**
     * Draw pie chart with GD
     */
    private function drawPieChart($image, $data, $colors, $textColor, $width, $height)
    {
        if (empty($data)) return;

        $centerX = $width / 2;
        $centerY = $height / 2;
        $radius = min($width, $height) / 3;

        // Calculate total
        $total = 0;
        foreach ($data as $item) {
            $total += $item['value'] ?? $item['completion_percentage'] ?? 0;
        }

        if ($total == 0) return;

        // Draw pie slices
        $startAngle = 0;
        $colorIndex = 0;
        $legendY = 50;

        foreach ($data as $item) {
            $value = $item['value'] ?? $item['completion_percentage'] ?? 0;
            $label = $item['label'] ?? $item['name'] ?? '';
            
            $sliceAngle = ($value / $total) * 360;
            $endAngle = $startAngle + $sliceAngle;

            $color = $colors[$colorIndex % count($colors)];

            // Draw slice
            imagefilledarc($image, $centerX, $centerY, $radius * 2, $radius * 2, $startAngle, $endAngle, $color, IMG_ARC_PIE);

            // Draw legend
            imagefilledrectangle($image, $width - 200, $legendY, $width - 180, $legendY + 15, $color);
            $legendText = $label . ': ' . number_format(($value / $total) * 100, 1) . '%';
            imagestring($image, 3, $width - 170, $legendY, $legendText, $textColor);
            
            $startAngle = $endAngle;
            $legendY += 25;
            $colorIndex++;
        }
    }

    /**
     * Prepare chart configuration for Chart.js
     */
    private function prepareChartConfig($data, $type, $options)
    {
        $config = [
            'type' => $type,
            'data' => $this->formatDataForChartJS($data, $type),
            'options' => [
                'responsive' => false,
                'width' => $options['width'],
                'height' => $options['height'],
                'plugins' => [
                    'title' => [
                        'display' => true,
                        'text' => $options['title']
                    ]
                ]
            ]
        ];

        return $config;
    }

    /**
     * Format data for Chart.js
     */
    private function formatDataForChartJS($data, $type)
    {
        if ($type === 'bar') {
            $labels = [];
            $values = [];
            
            foreach ($data as $item) {
                $labels[] = $item['name'] ?? $item['label'] ?? '';
                $values[] = $item['completion_percentage'] ?? $item['value'] ?? 0;
            }

            return [
                'labels' => $labels,
                'datasets' => [
                    [
                        'label' => 'Completion %',
                        'data' => $values,
                        'backgroundColor' => [
                            'rgba(54, 162, 235, 0.8)',
                            'rgba(255, 99, 132, 0.8)',
                            'rgba(255, 205, 86, 0.8)',
                            'rgba(75, 192, 192, 0.8)',
                            'rgba(153, 102, 255, 0.8)',
                        ]
                    ]
                ]
            ];
        }

        if ($type === 'pie') {
            $labels = [];
            $values = [];
            
            foreach ($data as $item) {
                $labels[] = $item['label'] ?? $item['name'] ?? '';
                $values[] = $item['value'] ?? $item['completion_percentage'] ?? 0;
            }

            return [
                'labels' => $labels,
                'datasets' => [
                    [
                        'data' => $values,
                        'backgroundColor' => [
                            'rgba(54, 162, 235, 0.8)',
                            'rgba(255, 99, 132, 0.8)',
                            'rgba(255, 205, 86, 0.8)',
                            'rgba(75, 192, 192, 0.8)',
                            'rgba(153, 102, 255, 0.8)',
                        ]
                    ]
                ]
            ];
        }

        return [];
    }

    /**
     * Clean up old chart images
     */
    public function cleanupOldCharts($olderThan = 24)
    {
        $chartDir = storage_path('app/public/charts');
        
        if (!is_dir($chartDir)) {
            return;
        }

        $files = glob($chartDir . '/*.png');
        $now = time();

        foreach ($files as $file) {
            if (is_file($file)) {
                $fileTime = filemtime($file);
                if (($now - $fileTime) > ($olderThan * 3600)) {
                    unlink($file);
                }
            }
        }
    }
}
