# 🚀 Track Expense - Complete Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ **Environment Setup**
- [ ] MongoDB Atlas account created (or local MongoDB ready)
- [ ] Node.js 16+ installed on production server
- [ ] Domain name configured (optional)
- [ ] SSL certificate ready (for HTTPS)

### ✅ **Code Preparation**
- [ ] All features tested locally
- [ ] Environment variables configured
- [ ] Production build tested
- [ ] Database connection verified

---

## 🛠️ **Deployment Options**

### **Option 1: VPS/Server Deployment (Recommended)**
### **Option 2: Cloud Platform (Heroku, Railway, etc.)**
### **Option 3: Docker Deployment**

---

## 🌐 **Option 1: VPS/Server Deployment**

### **Step 1: Prepare Your Server**

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx for reverse proxy
sudo apt install nginx -y

# Install Git
sudo apt install git -y
```

### **Step 2: Clone and Setup Project**

```bash
# Clone your repository
git clone https://github.com/yourusername/track-expense.git
cd track-expense

# Install dependencies
npm run install:all

# Build frontend for production
cd frontend && npm run build
cd ..
```

### **Step 3: Configure Environment Variables**

```bash
# Create production environment file
nano backend/.env
```

Add these variables:
```env
NODE_ENV=production
PORT=3005
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/trackexpense
JWT_SECRET=your_super_secure_jwt_secret_here
FRONTEND_URL=https://yourdomain.com
```

### **Step 4: Configure PM2**

Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'track-expense-backend',
    script: './backend/src/index.js',
    cwd: '/path/to/your/track-expense',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3005
    }
  }]
};
```

### **Step 5: Configure Nginx**

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/track-expense
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Serve frontend static files
    location / {
        root /path/to/your/track-expense/frontend/dist;
        try_files $uri $uri/ /index.html;
        
        # Security headers
        add_header X-Content-Type-Options nosniff;
        add_header X-Frame-Options DENY;
        add_header X-XSS-Protection "1; mode=block";
    }

    # Proxy API requests to backend
    location /api/ {
        proxy_pass http://localhost:3005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Handle health checks
    location /health {
        proxy_pass http://localhost:3005;
    }
}
```

### **Step 6: Enable and Start Services**

```bash
# Enable Nginx site
sudo ln -s /etc/nginx/sites-available/track-expense /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Start backend with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### **Step 7: Setup SSL with Let's Encrypt**

```bash
# Install Certbot
sudo apt install snapd
sudo snap install --classic certbot

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (already configured by certbot)
sudo certbot renew --dry-run
```

---

## ☁️ **Option 2: Cloud Platform Deployment (Heroku)**

### **Step 1: Prepare for Heroku**

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login
```

### **Step 2: Create Heroku Apps**

```bash
# Create backend app
heroku create track-expense-backend

# Create frontend app (optional - can use Netlify/Vercel instead)
heroku create track-expense-frontend
```

### **Step 3: Configure Backend for Heroku**

Create `backend/Procfile`:
```
web: node src/index.js
```

Update `backend/package.json`:
```json
{
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  },
  "engines": {
    "node": "18.x"
  }
}
```

### **Step 4: Deploy Backend**

```bash
# Add MongoDB Atlas add-on or set environment variables
heroku config:set NODE_ENV=production --app track-expense-backend
heroku config:set MONGODB_URI=your_mongodb_connection_string --app track-expense-backend
heroku config:set JWT_SECRET=your_jwt_secret --app track-expense-backend

# Deploy
git subtree push --prefix backend heroku main
```

### **Step 5: Deploy Frontend (Netlify/Vercel)**

**For Netlify:**
```bash
# Build the frontend
cd frontend && npm run build

# Deploy to Netlify (drag dist folder to netlify.com)
# Or use Netlify CLI
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**For Vercel:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend && vercel --prod
```

---

## 🐳 **Option 3: Docker Deployment**

### **Step 1: Create Dockerfiles**

**Backend Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3005
CMD ["node", "src/index.js"]
```

**Frontend Dockerfile:**
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### **Step 2: Create Docker Compose**

```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "3005:3005"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    restart: unless-stopped

volumes:
  mongodb_data:
```

### **Step 3: Deploy with Docker**

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f
```

---

## 🔧 **Production Optimizations**

### **Backend Optimizations**

1. **Add compression:**
```javascript
const compression = require('compression');
app.use(compression());
```

2. **Add security headers:**
```javascript
const helmet = require('helmet');
app.use(helmet());
```

3. **Add rate limiting:**
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

### **Frontend Optimizations**

1. **Update Vite config for production:**
```javascript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['axios', 'date-fns']
        }
      }
    }
  }
});
```

---

## 🔍 **Monitoring & Maintenance**

### **Health Checks**
```bash
# Check backend health
curl https://yourdomain.com/health

# Check PM2 status
pm2 status

# View logs
pm2 logs track-expense-backend
```

### **Database Backups**
```bash
# MongoDB backup script
mongodump --uri="your_mongodb_uri" --out=/backup/$(date +%Y%m%d)
```

### **SSL Certificate Renewal**
```bash
# Test auto-renewal
sudo certbot renew --dry-run
```

---

## 🎯 **Quick Deploy Checklist**

- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] Frontend built for production
- [ ] Backend running on production port
- [ ] SSL certificate installed
- [ ] Domain pointing to server
- [ ] Health endpoints working
- [ ] Monitoring setup
- [ ] Backup strategy in place

---

## 🆘 **Troubleshooting**

### **Common Issues:**

1. **CORS Errors:**
   - Update backend CORS configuration
   - Add frontend domain to allowed origins

2. **Database Connection Issues:**
   - Verify MongoDB URI
   - Check network connectivity
   - Verify database credentials

3. **Build Errors:**
   - Clear node_modules and reinstall
   - Check for environment-specific code
   - Verify all dependencies are installed

4. **SSL Issues:**
   - Verify domain DNS settings
   - Check Nginx configuration
   - Restart Nginx after SSL setup

---

**Your Track Expense app is now ready for production! 🎉**

Need help with any specific deployment step? Let me know!