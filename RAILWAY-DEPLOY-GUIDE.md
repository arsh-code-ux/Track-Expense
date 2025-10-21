# Railway Deployment Instructions

## Quick Railway Deploy (5 Minutes)

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub (free)
3. Verify email

### Step 2: Deploy Backend
1. Click "New Project" 
2. Select "Deploy from GitHub repo"
3. Choose your repository
4. Select root directory: `/` (main folder)

### Step 3: Environment Variables
Add these in Railway dashboard:
```
NODE_ENV=production
PORT=3005
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-jwt-secret-key-123
```

### Step 4: Build Settings
- Build Command: `cd backend && npm install`
- Start Command: `cd backend && npm start`
- Root Directory: `/`

### Step 5: Get Your Live URL
- Railway will give you URL like: `https://your-app.up.railway.app`
- Copy this URL for frontend connection

## Alternative: Manual Upload Method

If GitHub method doesn't work:
1. Create Railway project
2. Upload backend folder directly
3. Set environment variables
4. Deploy

Your backend will be live in 2-3 minutes!