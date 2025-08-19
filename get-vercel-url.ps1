# Get Latest Vercel Deployment URL
Write-Host "Getting latest Vercel deployment URL..." -ForegroundColor Green

Set-Location frontend

# Get latest deployment URL
$deployments = vercel ls --json | ConvertFrom-Json
if ($deployments -and $deployments.Count -gt 0) {
    $latestDeployment = $deployments[0]
    $url = $latestDeployment.url
    $status = $latestDeployment.state
    
    Write-Host "`nLatest Deployment Info:" -ForegroundColor Cyan
    Write-Host "URL: https://$url" -ForegroundColor Green
    Write-Host "Status: $status" -ForegroundColor Yellow
    Write-Host "Age: $($latestDeployment.age)" -ForegroundColor Blue
    
    # Try to open in browser
    Write-Host "`nOpening in browser..." -ForegroundColor Yellow
    Start-Process "https://$url"
} else {
    Write-Host "No deployments found" -ForegroundColor Red
}

Set-Location ..
