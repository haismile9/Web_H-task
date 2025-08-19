#!/bin/bash

# Build script for production deployment

echo "🚀 Starting production build..."

# Install dependencies
echo "📦 Installing dependencies..."
composer install --no-dev --optimize-autoloader

# Generate application key if not set
echo "🔑 Generating application key..."
php artisan key:generate --force

# Clear any cached config first
echo "🧹 Clearing cache..."
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

# Run database migrations
echo "🗄️ Running database migrations..."
php artisan migrate --force

# Seed database with sample data (optional)
echo "🌱 Seeding database..."
php artisan db:seed --force || echo "Seeding failed or not needed"

# Cache config for production
echo "⚡ Optimizing application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set proper permissions
echo "🔒 Setting permissions..."
chmod -R 775 storage bootstrap/cache

echo "✅ Production build completed!"
