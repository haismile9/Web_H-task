# H-Task Deployment Guide

## Deploy to Vercel

### Prerequisites
1. Install Vercel CLI: `npm install -g vercel`
2. Create Vercel account at https://vercel.com
3. Login to Vercel CLI: `vercel login`

### Frontend Deployment

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies and build:
```bash
npm install
npm run build
```

3. Deploy to Vercel:
```bash
vercel --prod
```

4. Set environment variables in Vercel dashboard:
   - `VITE_API_URL`: Your backend API URL

### Backend Deployment Options

#### Option 1: Vercel (Limited PHP support)
```bash
cd backend
composer install --no-dev --optimize-autoloader
vercel --prod
```

#### Option 2: Render (Recommended for Laravel)
1. Push code to GitHub
2. Connect GitHub repo to Render
3. Use the existing `render.yaml` configuration
4. Set environment variables in Render dashboard

### Environment Variables

#### Frontend (.env)
```
VITE_API_URL=https://your-backend-url.vercel.app/api
```

#### Backend (.env)
```
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-app.vercel.app
DB_CONNECTION=mysql
DB_HOST=your-db-host
DB_PORT=3306
DB_DATABASE=htask_db
DB_USERNAME=your-db-user
DB_PASSWORD=your-db-password
```

### Post-Deployment Steps

1. Update CORS settings in Laravel backend
2. Configure database connection
3. Run migrations if needed
4. Test all API endpoints
5. Update frontend API URL to point to deployed backend

### Database Options

1. **PlanetScale** (MySQL compatible)
2. **Supabase** (PostgreSQL)
3. **Railway** (MySQL/PostgreSQL)
4. **Render** (PostgreSQL)

### Troubleshooting

1. **Build failures**: Check Node.js/PHP versions
2. **API connection issues**: Verify CORS and environment variables
3. **Database connection**: Check database credentials and whitelist IPs
