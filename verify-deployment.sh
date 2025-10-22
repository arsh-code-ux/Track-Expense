#!/bin/bash

echo "🚀 TRACK EXPENSE - DEPLOYMENT VERIFICATION SCRIPT"
echo "================================================"
echo ""

# Backend Health Check
echo "📡 Checking Backend Health..."
backend_response=$(curl -s -o /dev/null -w "%{http_code}" https://web-production-296b2.up.railway.app/api/auth/health || echo "000")

if [ "$backend_response" = "200" ]; then
    echo "✅ Backend is running successfully"
else
    echo "❌ Backend health check failed (HTTP: $backend_response)"
fi

# Frontend Health Check
echo ""
echo "🌐 Checking Frontend Deployment..."
frontend_response=$(curl -s -o /dev/null -w "%{http_code}" https://arsh-code-ux-track-expense.netlify.app || echo "000")

if [ "$frontend_response" = "200" ]; then
    echo "✅ Frontend is deployed successfully"
else
    echo "❌ Frontend deployment check failed (HTTP: $frontend_response)"
fi

echo ""
echo "🔗 Deployment URLs:"
echo "Frontend: https://arsh-code-ux-track-expense.netlify.app"
echo "Backend:  https://web-production-296b2.up.railway.app"
echo ""

if [ "$backend_response" = "200" ] && [ "$frontend_response" = "200" ]; then
    echo "🎉 ALL SYSTEMS READY FOR DEPLOYMENT!"
    echo "✅ har erk chij ache se kaam kar rahi hai"
else
    echo "⚠️  Please check the failed services before deployment"
fi