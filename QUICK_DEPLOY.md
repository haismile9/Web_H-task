# Quick Start: Deploy to Vercel

## Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

## Step 2: Login to Vercel
```bash
vercel login
```

## Step 3: Deploy Frontend
```bash
cd frontend
npm install
npm run build
vercel --prod
```

## Step 4: Deploy Backend (Choose one)

### Option A: Vercel (Quick but limited)
```bash
cd backend
composer install --no-dev --optimize-autoloader
vercel --prod
```

### Option B: Render (Recommended)
1. Push code to GitHub
2. Go to https://render.com
3. Connect your GitHub repository
4. Use the existing `render.yaml` configuration

## Step 5: Set Environment Variables

### Frontend (Vercel Dashboard)
- `VITE_API_URL`: https://your-backend-url/api

### Backend (Vercel/Render Dashboard)
- `APP_ENV`: production
- `APP_DEBUG`: false
- `DB_CONNECTION`: mysql
- `DB_HOST`: your-database-host
- `DB_DATABASE`: htask_db
- `DB_USERNAME`: your-db-user
- `DB_PASSWORD`: your-db-password

## Done! 🎉

Your H-Task application should now be live on Vercel!
