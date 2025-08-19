#!/bin/bash

echo "🚀 Starting Laravel application..."

# Run migrations
php artisan migrate --force

# Clear cache
php artisan cache:clear
php artisan config:cache
php artisan route:cache

# Start PHP-FPM
php-fpm -D

# Start Nginx
nginx -g "daemon off;"
