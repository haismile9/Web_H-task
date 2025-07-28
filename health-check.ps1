# Health Check Script for HTask Application (Windows PowerShell)
# This script checks the health of all services

Write-Host "🏥 Starting health checks..." -ForegroundColor Green

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[✓] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[⚠] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[✗] $Message" -ForegroundColor Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "[ℹ] $Message" -ForegroundColor Blue
}

# Function to check if a service is responding
function Test-Service {
    param(
        [string]$ServiceName,
        [string]$Url,
        [int]$ExpectedStatus = 200
    )
    
    Write-Info "Checking $ServiceName..."
    
    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 10
        if ($response.StatusCode -eq $ExpectedStatus) {
            Write-Status "$ServiceName is healthy"
            return $true
        } else {
            Write-Error "$ServiceName returned status code: $($response.StatusCode)"
            return $false
        }
    } catch {
        Write-Error "$ServiceName is not responding"
        return $false
    }
}

# Function to check Docker containers
function Test-Container {
    param([string]$ContainerName)
    
    Write-Info "Checking container: $ContainerName"
    
    try {
        $container = docker ps --format "table {{.Names}}\t{{.Status}}" --filter "name=$ContainerName"
        if ($container -match $ContainerName) {
            Write-Status "$ContainerName is running"
            return $true
        } else {
            Write-Error "$ContainerName is not running"
            return $false
        }
    } catch {
        Write-Error "$ContainerName is not running"
        return $false
    }
}

# Function to check database connection
function Test-Database {
    Write-Info "Checking database connection..."
    
    try {
        $result = docker-compose exec -T mysql mysqladmin ping -h localhost --silent
        if ($LASTEXITCODE -eq 0) {
            Write-Status "Database is healthy"
            return $true
        } else {
            Write-Error "Database is not responding"
            return $false
        }
    } catch {
        Write-Error "Database is not responding"
        return $false
    }
}

# Function to check Redis connection
function Test-Redis {
    Write-Info "Checking Redis connection..."
    
    try {
        $result = docker-compose exec -T redis redis-cli ping
        if ($result -match "PONG") {
            Write-Status "Redis is healthy"
            return $true
        } else {
            Write-Error "Redis is not responding"
            return $false
        }
    } catch {
        Write-Error "Redis is not responding"
        return $false
    }
}

# Main health check
function Main {
    $allHealthy = $true
    
    Write-Host "🔍 Checking Docker containers..." -ForegroundColor Cyan
    
    # Check containers
    if (-not (Test-Container "htask_frontend")) { $allHealthy = $false }
    if (-not (Test-Container "htask_backend")) { $allHealthy = $false }
    if (-not (Test-Container "htask_mysql")) { $allHealthy = $false }
    if (-not (Test-Container "htask_redis")) { $allHealthy = $false }
    if (-not (Test-Container "htask_nginx")) { $allHealthy = $false }
    
    Write-Host ""
    Write-Host "🌐 Checking service endpoints..." -ForegroundColor Cyan
    
    # Check services
    if (-not (Test-Service "Frontend" "http://localhost")) { $allHealthy = $false }
    if (-not (Test-Service "Backend API" "http://localhost/api")) { $allHealthy = $false }
    if (-not (Test-Service "Health Check" "http://localhost/health")) { $allHealthy = $false }
    
    Write-Host ""
    Write-Host "🗄️  Checking database services..." -ForegroundColor Cyan
    
    # Check database services
    if (-not (Test-Database)) { $allHealthy = $false }
    if (-not (Test-Redis)) { $allHealthy = $false }
    
    Write-Host ""
    Write-Host "📊 System Resources:" -ForegroundColor Cyan
    
    # Check system resources
    Write-Info "Memory usage:"
    Get-Counter "\Memory\Available MBytes" | Select-Object -ExpandProperty CounterSamples | Select-Object -ExpandProperty CookedValue | ForEach-Object { Write-Host "   Available: $_ MB" -ForegroundColor White }
    
    Write-Info "Disk usage:"
    Get-WmiObject -Class Win32_LogicalDisk | ForEach-Object {
        $freeSpace = [math]::Round($_.FreeSpace / 1GB, 2)
        $totalSpace = [math]::Round($_.Size / 1GB, 2)
        $usedSpace = $totalSpace - $freeSpace
        $percentUsed = [math]::Round(($usedSpace / $totalSpace) * 100, 2)
        Write-Host "   $($_.DeviceID): $usedSpace GB used of $totalSpace GB ($percentUsed%)" -ForegroundColor White
    }
    
    Write-Info "Docker resource usage:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"
    
    Write-Host ""
    
    if ($allHealthy) {
        Write-Status "🎉 All services are healthy!"
        Write-Host ""
        Write-Host "🌐 Application URLs:" -ForegroundColor Cyan
        Write-Host "   Frontend: http://localhost" -ForegroundColor White
        Write-Host "   Backend API: http://localhost/api" -ForegroundColor White
        Write-Host "   Health Check: http://localhost/health" -ForegroundColor White
        Write-Host ""
        Write-Host "📊 Container Status:" -ForegroundColor Cyan
        docker-compose ps
    } else {
        Write-Error "❌ Some services are unhealthy. Please check the logs:"
        Write-Host ""
        docker-compose logs --tail=50
        exit 1
    }
}

# Run health check
Main 