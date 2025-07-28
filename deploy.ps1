# HTask Deployment Script for Windows PowerShell
# This script deploys the entire application (Frontend + Backend + Database)

param(
    [switch]$SkipBuild,
    [switch]$SkipHealthCheck
)

Write-Host "🚀 Starting HTask deployment..." -ForegroundColor Green

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Check if Docker is installed
try {
    docker --version | Out-Null
    Write-Status "Docker is installed"
} catch {
    Write-Error "Docker is not installed. Please install Docker Desktop first."
    exit 1
}

# Check if Docker Compose is installed
try {
    docker-compose --version | Out-Null
    Write-Status "Docker Compose is installed"
} catch {
    Write-Error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
}

# Stop existing containers
Write-Status "Stopping existing containers..."
docker-compose down --remove-orphans

# Build and start services
Write-Status "Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
Write-Status "Waiting for services to be ready..."
Start-Sleep -Seconds 30

# Check if services are running
Write-Status "Checking service status..."
docker-compose ps

# Run database migrations
Write-Status "Running database migrations..."
docker-compose exec backend php artisan migrate --force

# Clear and cache Laravel config
Write-Status "Optimizing Laravel application..."
docker-compose exec backend php artisan config:cache
docker-compose exec backend php artisan route:cache
docker-compose exec backend php artisan view:cache

# Set proper permissions
Write-Status "Setting file permissions..."
docker-compose exec backend chown -R www-data:www-data /var/www/storage
docker-compose exec backend chown -R www-data:www-data /var/www/bootstrap/cache
docker-compose exec backend chmod -R 775 /var/www/storage
docker-compose exec backend chmod -R 775 /var/www/bootstrap/cache

# Health check
Write-Status "Performing health checks..."
try {
    $response = Invoke-WebRequest -Uri "http://localhost/health" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Status "✅ Application is running successfully!"
        Write-Host ""
        Write-Host "🌐 Application URLs:" -ForegroundColor Cyan
        Write-Host "   Frontend: http://localhost" -ForegroundColor White
        Write-Host "   Backend API: http://localhost/api" -ForegroundColor White
        Write-Host "   Health Check: http://localhost/health" -ForegroundColor White
        Write-Host ""
        Write-Host "📊 Service Status:" -ForegroundColor Cyan
        docker-compose ps
    } else {
        Write-Error "❌ Health check failed with status code: $($response.StatusCode)"
        Write-Error "Please check the logs:"
        docker-compose logs
        exit 1
    }
} catch {
    Write-Error "❌ Health check failed. Please check the logs:"
    docker-compose logs
    exit 1
}

Write-Status "🎉 Deployment completed successfully!" 