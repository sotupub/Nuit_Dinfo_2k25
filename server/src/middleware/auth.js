const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../config/logger');

// Protect routes - Authentication check
const protect = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      logger.warn('No token found in request cookies');
      return res.status(401).json({ message: 'Authentication required' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      
      if (!decoded || !decoded.id) {
        logger.warn('Invalid token structure');
        return res.status(401).json({ message: 'Invalid token structure' });
      }

      // Check if user still exists
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        logger.warn(`User not found for token ID: ${decoded.id}`);
        return res.status(401).json({ message: 'User not found' });
      }

      // Check if user changed password after token was issued
      if (user.passwordChangedAt && decoded.iat < user.passwordChangedAt.getTime() / 1000) {
        logger.warn(`Password changed after token issued for user: ${decoded.id}`);
        return res.status(401).json({ message: 'Please log in again' });
      }
      
      // Attach user info to request
      req.user = user;
      next();
    } catch (err) {
      logger.error('Token verification error:', { error: err.message, name: err.name });
      
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Session expired' });
      }
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      }
      return res.status(401).json({ message: 'Authentication failed' });
    }
  } catch (error) {
    logger.error('Auth middleware error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Restrict to specific roles
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};

module.exports = {
  protect,
  restrictTo
};
