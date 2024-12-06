const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const { decrypt } = require('../utils/encryption');
const logger = require('../logger');

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW * 60 * 1000, // 15 minutes by default
  max: process.env.RATE_LIMIT_MAX, // Limit each IP requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      status: 'error',
      message: 'Too many requests from this IP, please try again later'
    });
  }
});

// Specific routes rate limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

// Security middleware configuration
const securityMiddleware = (app) => {
  // Enable CORS with custom configuration
  app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['set-cookie', 'Authorization'],
    preflightContinue: true,
    maxAge: 86400 // 24 hours
  }));

  // Set security HTTP headers
  app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP temporarily for development
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false
  }));

  // Data sanitization against NoSQL query injection
  app.use(mongoSanitize());

  // Data sanitization against XSS
  app.use(xss());

  // Prevent parameter pollution
  app.use(hpp({
    whitelist: [] // Add parameters that can be duplicated in query string
  }));

  // Apply rate limiting to all requests
  app.use(limiter);

  // Apply stricter rate limiting to authentication routes
  app.use('/api/auth', authLimiter);

  // Custom middleware to decrypt encrypted request bodies
  app.use((req, res, next) => {
    if (req.body && req.body.encryptedData) {
      try {
        const decryptedData = decrypt(req.body.encryptedData);
        req.body = JSON.parse(decryptedData);
      } catch (error) {
        logger.error('Decryption error:', error);
        return res.status(400).json({
          status: 'error',
          message: 'Invalid encrypted data'
        });
      }
    }
    next();
  });

  // Request logging middleware
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl} - IP: ${req.ip}`);
    next();
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    logger.error('Error:', err);
    res.status(err.status || 500).json({
      status: 'error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  });
};

module.exports = {
  securityMiddleware,
  limiter,
  authLimiter
};
