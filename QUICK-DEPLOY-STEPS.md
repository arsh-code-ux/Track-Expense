# Free Deployment Instructions

## Frontend Deployment (Netlify - FREE)

### Method 1: GitHub Integration (Recommended)
1. Go to https://github.com and create new repository named "track-expense-app"
2. Push your code to GitHub:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/track-expense-app.git
   git branch -M main
   git push -u origin main
   ```
3. Go to https://netlify.com and sign up/login
4. Click "New site from Git"
5. Choose GitHub and select your repository
6. Build settings:
   - Build command: `cd frontend && npm install && npm run build`
   - Publish directory: `frontend/dist`
   - Click "Deploy site"

### Method 2: Drag & Drop (Quickest)
1. Build your frontend:
   ```bash
   cd frontend
   npm run build
   ```
2. Go to https://netlify.com
3. Drag and drop the `frontend/dist` folder to Netlify
4. Get your live URL instantly!

## Backend Deployment (Railway - FREE)

### Method 1: GitHub Integration
1. Go to https://railway.app and sign up with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Set environment variables:
   - MONGODB_URI: your MongoDB Atlas connection string
   - JWT_SECRET: your secret key
   - PORT: 3005
5. Click "Deploy"

### Method 2: Railway CLI
```bash
npm install -g @railway/cli
railway login
railway init
railway add
railway deploy
```

## Database (Already Set Up)
- MongoDB Atlas (FREE tier) - Already configured
- Connection string already in your .env files

## Get Your Live Links
After deployment:
- Frontend: https://your-app-name.netlify.app
- Backend: https://your-backend.up.railway.app
- Full App: Ready to use!

## Quick Deploy Commands
```bash
# Frontend
cd frontend
npm run build
# Upload dist folder to Netlify

# Backend
# Push to GitHub and connect to Railway
```