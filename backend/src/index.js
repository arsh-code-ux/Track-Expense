require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Enhanced logging system
const log = {
  info: (msg) => console.log(`[INFO] ${new Date().toISOString()} - ${msg}`),
  error: (msg) => console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`),
  warn: (msg) => console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`),
  success: (msg) => console.log(`[SUCCESS] ${new Date().toISOString()} - ${msg}`)
};

// Environment validation
function validateEnvironment() {
  const required = ['MONGODB_URI', 'JWT_SECRET', 'PORT'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    log.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
  
  log.success('Environment validation passed');
}

// Database connection with retry logic
async function connectDatabase() {
  const maxRetries = parseInt(process.env.DB_RETRY_ATTEMPTS) || 5;
  const timeout = parseInt(process.env.DB_TIMEOUT) || 30000;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      log.info(`Database connection attempt ${attempt}/${maxRetries}...`);
      
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: timeout,
        maxPoolSize: 10,
        retryWrites: true,
        w: 'majority'
      });
      
      log.success('✅ Connected to MongoDB successfully');
      return;
      
    } catch (error) {
      log.error(`Database connection attempt ${attempt} failed: ${error.message}`);
      
      if (attempt === maxRetries) {
        log.error('❌ All database connection attempts failed');
        process.exit(1);
      }
      
      // Wait before retry (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
      log.info(`Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Application startup
async function startServer() {
  try {
    log.info('🚀 Starting ExpenseTracker Backend Server...');
    log.info('='.repeat(50));
    
    // Validate environment
    validateEnvironment();
    
    // Debug environment
    log.info('🔧 Environment Configuration:');
    log.info(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
    log.info(`   PORT: ${process.env.PORT || 3005}`);
    log.info(`   MONGODB_URI: ${process.env.MONGODB_URI ? 'SET' : 'MISSING'}`);
    log.info(`   JWT_SECRET: ${process.env.JWT_SECRET ? 'SET' : 'MISSING'}`);
    log.info(`   APP_NAME: ${process.env.APP_NAME || 'ExpenseTracker'}`);
    log.info(`   APP_VERSION: ${process.env.APP_VERSION || '1.0.0'}`);
    
    // Connect to database
    await connectDatabase();
    
    // Import routes
    const authRoutes = require('./routes/auth');
    const transactionRoutes = require('./routes/transactions');
    const budgetRoutes = require('./routes/budgets');
    const savingsGoalRoutes = require('./routes/savingsGoals');
    const alertRoutes = require('./routes/alerts');
    const chatRoutes = require('./routes/chat');
    const preferencesRoutes = require('./routes/preferences');
    
    // Create Express app
    const app = express();
    
    // Enhanced CORS configuration
    const corsOptions = {
      origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:3003',
        process.env.FRONTEND_URL,
        /\.netlify\.app$/,  // Allow all netlify domains
        /\.vercel\.app$/,   // Allow all vercel domains
        'https://netlify.app'
      ].filter(Boolean),
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    };
    
    app.use(cors(corsOptions));
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    
    // Request logging middleware
    app.use((req, res, next) => {
      log.info(`${req.method} ${req.path} - ${req.ip}`);
      next();
    });
    
    // Enhanced health check endpoint
    app.get('/health', (req, res) => {
      const healthData = {
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
        version: process.env.APP_VERSION || '1.0.0',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        memory: process.memoryUsage(),
        pid: process.pid
      };
      
      res.json(healthData);
    });
    
    // API routes
    app.use('/api/auth', authRoutes);
    app.use('/api/transactions', transactionRoutes);
    app.use('/api/budgets', budgetRoutes);
    app.use('/api/savings-goals', savingsGoalRoutes);
    app.use('/api/alerts', alertRoutes);
    app.use('/api/chat', chatRoutes);
    app.use('/api/preferences', preferencesRoutes);
    
    // Global error handling middleware
    app.use((err, req, res, next) => {
      log.error(`Global error handler: ${err.message}`);
      log.error(`Stack trace: ${err.stack}`);
      
      // Don't expose stack trace in production
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      res.status(err.status || 500).json({
        error: 'Internal server error',
        message: isDevelopment ? err.message : 'Something went wrong',
        ...(isDevelopment && { stack: err.stack })
      });
    });
    
    // 404 handler
    app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.originalUrl} not found`
      });
    });
    
    const PORT = process.env.PORT || 3005;
    
    // Start server with error handling
    const server = app.listen(PORT, () => {
      log.success('🎉 Server started successfully!');
      log.success(`🌐 Server running on http://localhost:${PORT}`);
      log.success('📡 API endpoints available:');
      log.info(`   - Health: http://localhost:${PORT}/health`);
      log.info(`   - Auth: http://localhost:${PORT}/api/auth`);
      log.info(`   - Transactions: http://localhost:${PORT}/api/transactions`);
      log.info(`   - Budgets: http://localhost:${PORT}/api/budgets`);
      log.info(`   - Alerts: http://localhost:${PORT}/api/alerts`);
      log.info(`   - Chat: http://localhost:${PORT}/api/chat`);
      log.info('='.repeat(50));
    });
    
    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        log.error(`❌ Port ${PORT} is already in use`);
        log.error('Please check if another instance is running or use a different port');
      } else {
        log.error(`❌ Server error: ${error.message}`);
      }
      process.exit(1);
    });
    
    // Graceful shutdown
    const gracefulShutdown = (signal) => {
      log.info(`Received ${signal}. Starting graceful shutdown...`);
      
      server.close((err) => {
        if (err) {
          log.error(`Error during server shutdown: ${err.message}`);
          process.exit(1);
        }
        
        mongoose.connection.close((err) => {
          if (err) {
            log.error(`Error closing database connection: ${err.message}`);
            process.exit(1);
          }
          
          log.success('✅ Graceful shutdown completed');
          process.exit(0);
        });
      });
    };
    
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      log.error(`Uncaught Exception: ${error.message}`);
      log.error(`Stack: ${error.stack}`);
      process.exit(1);
    });
    
    process.on('unhandledRejection', (reason, promise) => {
      log.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
      process.exit(1);
    });
    
  } catch (error) {
    log.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
}

// Start the server
startServer();
