# Deployment Guide

## Production Deployment Checklist

### 1. Environment Configuration
- [ ] Update `backend/.env` with production MongoDB URI
- [ ] Set strong JWT_SECRET for production
- [ ] Configure production API URLs in frontend

### 2. Build Commands
```bash
# Build frontend for production
cd frontend && npm run build

# The dist/ folder contains the production build
```

### 3. Server Deployment
```bash
# Install production dependencies only
cd backend && npm ci --only=production

# Start the server
npm start
```

### 4. Environment Variables
```env
NODE_ENV=production
PORT=3005
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_strong_jwt_secret
```

### 5. Security Considerations
- Use HTTPS in production
- Set proper CORS origins
- Use environment variables for sensitive data
- Implement rate limiting if needed

### 6. Monitoring
- Set up logging for production
- Monitor MongoDB connections
- Track API response times

## Quick Deploy Commands

```bash
# One-time setup
npm run install:all

# Development
npm run dev

# Backend only
npm run dev:backend

# Frontend only  
npm run dev:frontend
```

Your application is now ready for deployment! 🚀