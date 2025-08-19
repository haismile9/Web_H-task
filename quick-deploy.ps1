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
$hasTermer = npm list terser 2>$null
if (-not $hasTermer) {
    Write-Host "Installing terser for build..." -ForegroundColor Yellow
    npm install terser --save-dev
}

Write-Host "Building project..." -ForegroundColor Yellow
# Clear previous build
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
}
$env:NODE_ENV = "production"
npm run build

# Verify build output
if (-not (Test-Path "dist/index.html")) {
    Write-Host "❌ Build failed - index.html not found" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build successful - dist folder ready" -ForegroundColor Green

Write-Host "Deploying to Vercel..." -ForegroundColor Yellow
vercel --prod

Set-Location ..
Write-Host "`n✅ Frontend deployed successfully!" -ForegroundColor Green

Write-Host "`n📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. Set VITE_API_URL in Vercel dashboard" -ForegroundColor White
Write-Host "2. Deploy backend to Render using render.yaml" -ForegroundColor White
Write-Host "3. Update API URL in Vercel environment variables" -ForegroundColor White
