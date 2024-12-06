const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../config/logger');

// Register a new user
exports.register = async ({ name, email, password }) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Create new user with plain password - it will be hashed by the pre-save middleware
    const user = new User({ 
      name, 
      email, 
      password, // Don't hash here, let the pre-save middleware handle it
      role: 'user'
    });

    // Save user - password will be hashed by pre-save middleware
    await user.save();
    
    logger.info('User registered:', user.email);
    const tokens = generateTokens(user);
    
    // Return user data without password
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    
    return { user: userWithoutPassword, tokens };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Login a user
exports.login = async ({ email, password }) => {
  try {
    console.log('Login attempt with email:', email);
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    console.log('Login - Plain text password:', password);
    console.log('Login - Stored hashed password:', user.password);

    // Use the User model's comparePassword method
    const isPasswordValid = await user.comparePassword(password);
    console.log('Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const tokens = generateTokens(user);
    
    // Return user data without password
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    
    logger.info('User logged in:', user.email);
    return { user: userWithoutPassword, tokens };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Logout a user
exports.logout = async (token) => {
  // In a production environment, you might want to blacklist the token
  // or remove it from a token whitelist
  logger.info('User logged out');
};

// Refresh token
exports.refreshToken = async (refreshToken) => {
  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error('User not found');
    }

    // Generate new tokens
    const tokens = generateTokens(user);
    logger.info('Token refreshed for user:', user.email);
    return tokens;
  } catch (error) {
    logger.error('Token refresh failed:', error);
    throw new Error('Invalid refresh token');
  }
};

// Get user from token
exports.getUserFromToken = async (token) => {
  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    logger.error('Get user from token error:', error);
    throw error;
  }
};

// Generate JWT tokens
function generateTokens(user) {
  const accessToken = jwt.sign(
    { 
      id: user._id, 
      email: user.email,
      role: user.role 
    }, 
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRATION }
  );
  
  const refreshToken = jwt.sign(
    { 
      id: user._id,
      version: user.tokenVersion || 0
    }, 
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRATION }
  );

  return { accessToken, refreshToken };
}
