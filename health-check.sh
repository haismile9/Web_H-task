#!/bin/bash

# Health Check Script for HTask Application
# This script checks the health of all services

set -e

echo "🏥 Starting health checks..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[ℹ]${NC} $1"
}

# Function to check if a service is responding
check_service() {
    local service_name=$1
    local url=$2
    local expected_status=${3:-200}
    
    print_info "Checking $service_name..."
    
    if curl -f -s "$url" > /dev/null 2>&1; then
        print_status "$service_name is healthy"
        return 0
    else
        print_error "$service_name is not responding"
        return 1
    fi
}

# Function to check Docker containers
check_container() {
    local container_name=$1
    
    print_info "Checking container: $container_name"
    
    if docker ps --format "table {{.Names}}" | grep -q "$container_name"; then
        local status=$(docker ps --format "table {{.Status}}" --filter "name=$container_name")
        print_status "$container_name is running: $status"
        return 0
    else
        print_error "$container_name is not running"
        return 1
    fi
}

# Function to check database connection
check_database() {
    print_info "Checking database connection..."
    
    if docker-compose exec -T mysql mysqladmin ping -h localhost --silent; then
        print_status "Database is healthy"
        return 0
    else
        print_error "Database is not responding"
        return 1
    fi
}

# Function to check Redis connection
check_redis() {
    print_info "Checking Redis connection..."
    
    if docker-compose exec -T redis redis-cli ping | grep -q "PONG"; then
        print_status "Redis is healthy"
        return 0
    else
        print_error "Redis is not responding"
        return 1
    fi
}

# Main health check
main() {
    local all_healthy=true
    
    echo "🔍 Checking Docker containers..."
    
    # Check containers
    check_container "htask_frontend" || all_healthy=false
    check_container "htask_backend" || all_healthy=false
    check_container "htask_mysql" || all_healthy=false
    check_container "htask_redis" || all_healthy=false
    check_container "htask_nginx" || all_healthy=false
    
    echo ""
    echo "🌐 Checking service endpoints..."
    
    # Check services
    check_service "Frontend" "http://localhost" || all_healthy=false
    check_service "Backend API" "http://localhost/api" || all_healthy=false
    check_service "Health Check" "http://localhost/health" || all_healthy=false
    
    echo ""
    echo "🗄️  Checking database services..."
    
    # Check database services
    check_database || all_healthy=false
    check_redis || all_healthy=false
    
    echo ""
    echo "📊 System Resources:"
    
    # Check system resources
    print_info "Memory usage:"
    free -h | grep -E "Mem|Swap"
    
    print_info "Disk usage:"
    df -h | grep -E "/dev/|Filesystem"
    
    print_info "Docker resource usage:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"
    
    echo ""
    
    if [ "$all_healthy" = true ]; then
        print_status "🎉 All services are healthy!"
        echo ""
        echo "🌐 Application URLs:"
        echo "   Frontend: http://localhost"
        echo "   Backend API: http://localhost/api"
        echo "   Health Check: http://localhost/health"
        echo ""
        echo "📊 Container Status:"
        docker-compose ps
    else
        print_error "❌ Some services are unhealthy. Please check the logs:"
        echo ""
        docker-compose logs --tail=50
        exit 1
    fi
}

# Run health check
main 