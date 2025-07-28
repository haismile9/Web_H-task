# Quick Vercel Deploy Script for Windows
Write-Host "🚀 H-Task Quick Deploy to Vercel" -ForegroundColor Green

# Check Vercel CLI
try {
    $null = Get-Command vercel -ErrorAction Stop
    Write-Host "✅ Vercel CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
}

# Deploy Frontend
Write-Host "`n📦 Deploying Frontend..." -ForegroundColor Blue
Set-Location frontend

Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

# Check if terser is installed
$hasTerms = npm list terser 2>$null
if (-not $hasTerms) {
    Write-Host "Installing terser (required for build)..." -ForegroundColor Yellow
    npm install terser --save-dev
}

Write-Host "Building project..." -ForegroundColor Yellow
npm run build

Write-Host "Deploying to Vercel..." -ForegroundColor Yellow
vercel --prod

Set-Location ..
Write-Host "`n✅ Frontend deployed successfully!" -ForegroundColor Green

Write-Host "`n📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. Set VITE_API_URL in Vercel dashboard" -ForegroundColor White
Write-Host "2. Deploy backend to Render using render.yaml" -ForegroundColor White
Write-Host "3. Update API URL in Vercel environment variables" -ForegroundColor White
