#!/bin/bash

# Track Expense Deployment Script
# Usage: ./deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
PROJECT_DIR=$(pwd)

echo "🚀 Starting deployment for Track Expense..."
echo "Environment: $ENVIRONMENT"
echo "Project Directory: $PROJECT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "Node.js version: $(node --version)"
print_status "npm version: $(npm --version)"

# Install dependencies
print_status "Installing dependencies..."
npm run install:all

# Create logs directory
mkdir -p logs

# Build frontend for production
print_status "Building frontend for production..."
cd frontend
npm run build
cd ..

if [ "$ENVIRONMENT" = "production" ]; then
    print_status "Production deployment mode"
    
    # Check if PM2 is installed
    if ! command -v pm2 &> /dev/null; then
        print_warning "PM2 is not installed. Installing PM2..."
        sudo npm install -g pm2
    fi
    
    # Stop existing processes
    print_status "Stopping existing processes..."
    pm2 stop track-expense-backend 2>/dev/null || true
    
    # Start backend with PM2
    print_status "Starting backend with PM2..."
    pm2 start ecosystem.config.js
    
    # Save PM2 configuration
    pm2 save
    
    # Setup PM2 startup script
    print_status "Setting up PM2 startup script..."
    pm2 startup
    
else
    print_status "Development deployment mode"
    
    # Start development servers
    print_status "Starting development servers..."
    npm run dev
fi

print_status "Deployment completed successfully! 🎉"

if [ "$ENVIRONMENT" = "production" ]; then
    print_status "Backend is running on port 3005"
    print_status "Frontend build is ready in frontend/dist"
    print_status "Configure your web server to serve the frontend and proxy API requests"
else
    print_status "Frontend: http://localhost:3001"
    print_status "Backend: http://localhost:3005"
fi

print_warning "Don't forget to:"
echo "  1. Configure environment variables in backend/.env"
echo "  2. Setup MongoDB connection"
echo "  3. Configure web server (Nginx) for production"
echo "  4. Setup SSL certificate"
echo "  5. Configure domain DNS"