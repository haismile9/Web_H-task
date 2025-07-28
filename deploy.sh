#!/bin/bash

# HTask Deployment Script
# This script deploys the entire application (Frontend + Backend + Database)

set -e

echo "🚀 Starting HTask deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_section() {
    echo -e "${BLUE}[SECTION]${NC} $1"
}

# Check if Vercel CLI is installed
check_vercel_cli() {
    if ! command -v vercel &> /dev/null; then
        print_error "Vercel CLI is not installed. Please install it first:"
        echo "npm install -g vercel"
        exit 1
    fi
    print_status "Vercel CLI is installed"
}

# Deploy Frontend to Vercel
deploy_frontend() {
    print_section "Deploying Frontend to Vercel..."
    
    cd frontend
    
    # Install dependencies
    print_status "Installing frontend dependencies..."
    npm install
    
    # Install terser if not present (required for Vite v3+)
    if ! npm list terser &> /dev/null; then
        print_status "Installing terser (required for production build)..."
        npm install terser --save-dev
    fi
    
    # Build the project
    print_status "Building frontend..."
    npm run build
    
    # Deploy to Vercel
    print_status "Deploying to Vercel..."
    vercel --prod
    
    cd ..
    print_status "Frontend deployment completed!"
}

# Deploy Backend to Vercel (alternative to Render)
deploy_backend_vercel() {
    print_section "Deploying Backend to Vercel..."
    print_warning "Note: Vercel has limited PHP support. Render is recommended for Laravel."
    
    cd backend
    
    # Install composer dependencies
    print_status "Installing backend dependencies..."
    composer install --no-dev --optimize-autoloader
    
    # Deploy to Vercel
    print_status "Deploying to Vercel..."
    vercel --prod
    
    cd ..
    print_status "Backend deployment to Vercel completed!"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose down --remove-orphans

# Build and start services
print_status "Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 30

# Check if services are running
print_status "Checking service status..."
docker-compose ps

# Run database migrations
print_status "Running database migrations..."
docker-compose exec backend php artisan migrate --force

# Clear and cache Laravel config
print_status "Optimizing Laravel application..."
docker-compose exec backend php artisan config:cache
docker-compose exec backend php artisan route:cache
docker-compose exec backend php artisan view:cache

# Set proper permissions
print_status "Setting file permissions..."
docker-compose exec backend chown -R www-data:www-data /var/www/storage
docker-compose exec backend chown -R www-data:www-data /var/www/bootstrap/cache
docker-compose exec backend chmod -R 775 /var/www/storage
docker-compose exec backend chmod -R 775 /var/www/bootstrap/cache

# Health check
print_status "Performing health checks..."
if curl -f http://localhost/health > /dev/null 2>&1; then
    print_status "✅ Application is running successfully!"
    echo ""
    echo "🌐 Application URLs:"
    echo "   Frontend: http://localhost"
    echo "   Backend API: http://localhost/api"
    echo "   Health Check: http://localhost/health"
    echo ""
    echo "📊 Service Status:"
    docker-compose ps
else
    print_error "❌ Health check failed. Please check the logs:"
    docker-compose logs
    exit 1
fi

print_status "🎉 Deployment completed successfully!"

# Main execution
main() {
    echo ""
    print_section "H-Task Vercel Deployment Options"
    echo "1. Deploy Frontend only"
    echo "2. Deploy Backend only (Vercel - Limited PHP support)"
    echo "3. Deploy Both (Frontend + Backend)"
    echo "4. Show deployment status"
    echo ""
    
    read -p "Choose an option (1-4): " choice
    
    case $choice in
        1)
            check_vercel_cli
            deploy_frontend
            ;;
        2)
            check_vercel_cli
            deploy_backend_vercel
            ;;
        3)
            check_vercel_cli
            deploy_frontend
            deploy_backend_vercel
            ;;
        4)
            print_status "Checking deployment status..."
            if command -v vercel &> /dev/null; then
                vercel ls
            else
                print_error "Vercel CLI not installed"
            fi
            ;;
        *)
            print_error "Invalid option. Exiting..."
            exit 1
            ;;
    esac
    
    echo ""
    print_status "🎉 All selected deployments completed!"
    print_warning "Don't forget to:"
    echo "  1. Set environment variables in Vercel dashboard"
    echo "  2. Update VITE_API_URL to point to your backend"
    echo "  3. Configure database connection"
}

# Run main function if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi 