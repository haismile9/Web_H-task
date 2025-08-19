# Test Vercel Deploy
Write-Host "Testing Vercel Deployment..." -ForegroundColor Green

# Go to frontend directory
cd frontend

# Clean and build
Write-Host "Cleaning and building..." -ForegroundColor Yellow
if (Test-Path "dist") { Remove-Item -Recurse -Force "dist" }
npm run build

# Check if build successful
if (Test-Path "dist/index.html") {
    Write-Host "Build successful!" -ForegroundColor Green
    Write-Host "Files in dist:" -ForegroundColor Blue
    Get-ChildItem dist -Recurse | Select-Object Name, Length
} else {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

# Try to deploy
Write-Host "Deploying to Vercel..." -ForegroundColor Yellow
vercel --prod

cd ..
