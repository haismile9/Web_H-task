# H-Task Frontend

## Vercel Deployment from GitHub

### Auto-Deploy Setup

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository `haismile9/Web_H-task`
4. Select the `frontend` folder as the root directory
5. Vercel will auto-detect it as a Vite project

### Manual Configuration (if needed)

**Build Settings:**
- Framework Preset: `Vite`
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Environment Variables

Set these in Vercel Dashboard > Project Settings > Environment Variables:

```
VITE_API_URL=https://your-backend-url.render.com/api
```

### Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Preview build
npm run preview
```

### Project Structure

```
frontend/
├── src/
├── public/
├── dist/          # Build output
├── vercel.json    # Vercel config
├── vite.config.ts # Vite config
└── package.json
```

### Troubleshooting

1. **404 errors**: The `vercel.json` file handles SPA routing
2. **Build errors**: Make sure `terser` is installed as dev dependency
3. **API errors**: Check VITE_API_URL environment variable
