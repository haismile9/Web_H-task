# Test Backend APIs for Flutter Integration
# Run this from PowerShell after starting Laravel server

# Base URL
$baseUrl = "http://127.0.0.1:8000/api"

# Test credentials
$loginData = @{
    email = "test@example.com"
    password = "password"
} | ConvertTo-Json

# Login and get token
Write-Host "🔐 Testing Login..." -ForegroundColor Cyan
try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/login" -Method POST -Body $loginData -ContentType "application/json"
    $token = $loginResponse.access_token
    Write-Host "✅ Login successful! Token: $($token.Substring(0,50))..." -ForegroundColor Green
    
    # Headers with auth token
    $headers = @{
        "Authorization" = "Bearer $token"
        "Accept" = "application/json"
    }
    
    # Test Today Tasks
    Write-Host "`n📋 Testing Today Tasks..." -ForegroundColor Cyan
    try {
        $tasksResponse = Invoke-RestMethod -Uri "$baseUrl/mobile/today-tasks" -Method GET -Headers $headers
        Write-Host "✅ Today Tasks API working! Found $($tasksResponse.data.Count) tasks" -ForegroundColor Green
        Write-Host "Response: $($tasksResponse | ConvertTo-Json -Depth 2)" -ForegroundColor Yellow
    } catch {
        Write-Host "❌ Today Tasks API failed: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    # Test Today Meetings
    Write-Host "`n📅 Testing Today Meetings..." -ForegroundColor Cyan
    try {
        $meetingsResponse = Invoke-RestMethod -Uri "$baseUrl/mobile/today-meetings" -Method GET -Headers $headers
        Write-Host "✅ Today Meetings API working! Found $($meetingsResponse.data.Count) meetings" -ForegroundColor Green
        Write-Host "Response: $($meetingsResponse | ConvertTo-Json -Depth 2)" -ForegroundColor Yellow
    } catch {
        Write-Host "❌ Today Meetings API failed: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    # Test Task Statistics
    Write-Host "`n📊 Testing Task Statistics..." -ForegroundColor Cyan
    try {
        $taskStatsResponse = Invoke-RestMethod -Uri "$baseUrl/mobile/task-statistics" -Method GET -Headers $headers
        Write-Host "✅ Task Statistics API working!" -ForegroundColor Green
        Write-Host "Response: $($taskStatsResponse | ConvertTo-Json -Depth 2)" -ForegroundColor Yellow
    } catch {
        Write-Host "❌ Task Statistics API failed: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    # Test Meeting Statistics
    Write-Host "`n📈 Testing Meeting Statistics..." -ForegroundColor Cyan
    try {
        $meetingStatsResponse = Invoke-RestMethod -Uri "$baseUrl/mobile/meeting-statistics" -Method GET -Headers $headers
        Write-Host "✅ Meeting Statistics API working!" -ForegroundColor Green
        Write-Host "Response: $($meetingStatsResponse | ConvertTo-Json -Depth 2)" -ForegroundColor Yellow
    } catch {
        Write-Host "❌ Meeting Statistics API failed: $($_.Exception.Message)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Make sure backend is running and test user exists" -ForegroundColor Yellow
}

Write-Host "`n🎯 API Testing Complete!" -ForegroundColor Magenta
