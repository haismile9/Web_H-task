# Multi-stage build for Render deployment
FROM php:8.2-fpm as base

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    zip \
    unzip \
    nginx \
    supervisor \
    && docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql mbstring exif pcntl bcmath gd \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy composer files for better Docker layer caching
COPY composer.json composer.lock ./

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-autoloader

# Copy application code
COPY . .

# Complete composer setup
RUN composer dump-autoload --no-dev --optimize

# Set proper permissions
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www/storage \
    && chmod -R 755 /var/www/bootstrap/cache

# Configure Nginx
RUN rm /etc/nginx/sites-enabled/default
COPY nginx.conf /etc/nginx/sites-available/default
RUN ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/

# Configure Supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Create entrypoint script
RUN echo '#!/bin/bash\n\
set -e\n\
\n\
echo "🚀 Starting Laravel application..."\n\
\n\
# Generate app key if not set\n\
if [ -z "$APP_KEY" ]; then\n\
    echo "🔑 Generating application key..."\n\
    php artisan key:generate --force\n\
fi\n\
\n\
# Wait for database\n\
echo "⏳ Waiting for database..."\n\
until php artisan migrate --dry-run 2>/dev/null; do\n\
    echo "Database not ready, waiting..."\n\
    sleep 2\n\
done\n\
\n\
# Run migrations\n\
echo "🗄️ Running migrations..."\n\
php artisan migrate --force\n\
\n\
# Seed database if needed\n\
if [ "$SEED_DATABASE" = "true" ]; then\n\
    echo "🌱 Seeding database..."\n\
    php artisan db:seed --force || echo "Seeding failed or not needed"\n\
fi\n\
\n\
# Cache configuration\n\
echo "⚡ Caching configuration..."\n\
php artisan config:cache\n\
php artisan route:cache\n\
php artisan view:cache\n\
\n\
# Create log directory\n\
mkdir -p /var/log/supervisor\n\
\n\
echo "✅ Application ready!"\n\
\n\
# Start supervisor\n\
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf\n\
' > /entrypoint.sh

RUN chmod +x /entrypoint.sh

# Expose port 10000 (Render requirement)
EXPOSE 10000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:10000/api/health || exit 1

# Use custom entrypoint
ENTRYPOINT ["/entrypoint.sh"] 