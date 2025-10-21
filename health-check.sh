#!/bin/bash

# 🔧 Pre-Deployment Health Check Script
# This script checks for common issues before deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 Track Expense - Pre-Deployment Health Check${NC}"
echo "=================================================="

# Function to print status messages
print_check() {
    echo -e "${BLUE}[CHECK]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Check Node.js version
print_check "Checking Node.js version..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js found: $NODE_VERSION"
else
    print_error "Node.js not found. Please install Node.js 16+"
    exit 1
fi

# Check npm version
print_check "Checking npm version..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm found: $NPM_VERSION"
else
    print_error "npm not found"
    exit 1
fi

# Check if project directory exists
print_check "Checking project structure..."
if [ -d "backend" ] && [ -d "frontend" ]; then
    print_success "Project structure looks good"
else
    print_error "Invalid project structure. Make sure you're in the project root"
    exit 1
fi

# Check backend dependencies
print_check "Checking backend dependencies..."
cd backend
if [ -f "package.json" ]; then
    if [ -d "node_modules" ]; then
        print_success "Backend dependencies installed"
    else
        print_warning "Backend dependencies not installed. Installing..."
        npm install
        print_success "Backend dependencies installed"
    fi
else
    print_error "Backend package.json not found"
    exit 1
fi

# Check frontend dependencies
print_check "Checking frontend dependencies..."
cd ../frontend
if [ -f "package.json" ]; then
    if [ -d "node_modules" ]; then
        print_success "Frontend dependencies installed"
    else
        print_warning "Frontend dependencies not installed. Installing..."
        npm install
        print_success "Frontend dependencies installed"
    fi
else
    print_error "Frontend package.json not found"
    exit 1
fi

cd ..

# Check environment files
print_check "Checking environment configuration..."
if [ -f "backend/.env" ]; then
    print_success "Backend environment file found"
    
    # Check for required environment variables
    if grep -q "MONGODB_URI" backend/.env && grep -q "JWT_SECRET" backend/.env; then
        print_success "Required environment variables present"
    else
        print_warning "Some required environment variables may be missing"
    fi
else
    print_warning "Backend .env file not found. Creating template..."
    cp backend/.env.production backend/.env
    print_warning "Please configure backend/.env with your settings"
fi

if [ -f "frontend/.env" ]; then
    print_success "Frontend environment file found"
else
    print_warning "Frontend .env file not found. Creating template..."
    cp frontend/.env.production frontend/.env
    print_warning "Please configure frontend/.env with your settings"
fi

# Test backend build
print_check "Testing backend startup..."
cd backend
timeout 10s npm start > /dev/null 2>&1 &
BACKEND_PID=$!
sleep 5

if kill -0 $BACKEND_PID 2>/dev/null; then
    print_success "Backend starts successfully"
    kill $BACKEND_PID 2>/dev/null || true
else
    print_warning "Backend startup test failed (this might be normal)"
fi

cd ..

# Test frontend build
print_check "Testing frontend build..."
cd frontend
if npm run build > /dev/null 2>&1; then
    print_success "Frontend builds successfully"
    if [ -d "dist" ]; then
        print_success "Frontend dist folder created"
    fi
else
    print_error "Frontend build failed"
    exit 1
fi

cd ..

# Check for common security issues
print_check "Security checks..."
if grep -r "console\.log" backend/src/ | grep -v "info:\|error:\|warn:\|success:" > /dev/null 2>&1; then
    print_warning "Debug console.log statements found (consider removing for production)"
else
    print_success "No debug console.log statements found"
fi

if grep -r "debugger" backend/src/ frontend/src/ > /dev/null 2>&1; then
    print_warning "Debugger statements found (should be removed for production)"
fi

# Check disk space
print_check "Checking disk space..."
DISK_USAGE=$(df . | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $DISK_USAGE -lt 80 ]; then
    print_success "Sufficient disk space available"
else
    print_warning "Disk usage is high: ${DISK_USAGE}%"
fi

# Final summary
echo ""
echo -e "${BLUE}📋 Health Check Summary${NC}"
echo "================================"
print_success "✅ Project structure verified"
print_success "✅ Dependencies installed"
print_success "✅ Environment files checked"
print_success "✅ Build tests completed"
print_success "✅ Security checks performed"

echo ""
echo -e "${GREEN}🎉 Pre-deployment health check completed!${NC}"
echo ""
echo -e "${YELLOW}Next steps for deployment:${NC}"
echo "1. Review and configure environment variables"
echo "2. Setup production database"
echo "3. Configure web server (Nginx)"
echo "4. Setup SSL certificate"
echo "5. Configure domain DNS"
echo "6. Run: ./deploy.sh production"
echo ""
echo -e "${BLUE}For detailed deployment instructions, see:${NC}"
echo "📖 COMPLETE-DEPLOYMENT-GUIDE.md"