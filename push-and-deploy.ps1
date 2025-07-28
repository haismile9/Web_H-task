# GitHub Push and Vercel Deploy Script
Write-Host "🚀 H-Task GitHub Push & Vercel Deploy" -ForegroundColor Green

# Check git status
Write-Host "`n📋 Checking git status..." -ForegroundColor Blue
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "📝 Found changes to commit:" -ForegroundColor Yellow
    git status --short
    
    # Add all changes
    Write-Host "`n➕ Adding all changes..." -ForegroundColor Yellow
    git add .
    
    # Commit with message
    $commitMessage = Read-Host "Enter commit message (or press Enter for default)"
    if (-not $commitMessage) {
        $commitMessage = "Update project files for Vercel deployment"
    }
    
    git commit -m $commitMessage
    Write-Host "✅ Changes committed" -ForegroundColor Green
} else {
    Write-Host "✅ No changes to commit" -ForegroundColor Green
}

# Push to GitHub
Write-Host "`n🔄 Pushing to GitHub..." -ForegroundColor Blue
try {
    git push origin main
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to push to GitHub" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

# Instructions for Vercel
Write-Host "`n🌐 Vercel Deployment Instructions:" -ForegroundColor Cyan
Write-Host "1. Go to https://vercel.com/dashboard" -ForegroundColor White
Write-Host "2. Click 'New Project'" -ForegroundColor White
Write-Host "3. Import 'haismile9/Web_H-task' repository" -ForegroundColor White
Write-Host "4. Set Root Directory to: frontend" -ForegroundColor White
Write-Host "5. Add Environment Variable: VITE_API_URL" -ForegroundColor White
Write-Host "6. Deploy!" -ForegroundColor White

Write-Host "`n📊 Repository Info:" -ForegroundColor Blue
Write-Host "Repository: haismile9/Web_H-task" -ForegroundColor White
Write-Host "Branch: main" -ForegroundColor White
Write-Host "Frontend Path: /frontend" -ForegroundColor White

Write-Host "`n🎉 Code is ready for Vercel deployment!" -ForegroundColor Green
