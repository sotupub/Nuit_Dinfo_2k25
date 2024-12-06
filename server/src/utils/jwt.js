const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const logger = require('../config/logger');

// Generate access token
const generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRATION }
  );
};

// Generate refresh token
const generateRefreshToken = (userId) => {
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRATION }
  );

  // Hash the refresh token before storing in database
  const hash = crypto
    .createHash('sha256')
    .update(refreshToken)
    .digest('hex');

  return { refreshToken, hash };
};

// Verify access token
const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    return { valid: true, expired: false, decoded };
  } catch (error) {
    return {
      valid: false,
      expired: error.name === 'TokenExpiredError',
      decoded: null
    };
  }
};

// Verify refresh token
const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    return { valid: true, expired: false, decoded };
  } catch (error) {
    return {
      valid: false,
      expired: error.name === 'TokenExpiredError',
      decoded: null
    };
  }
};

// Set secure cookie with refresh token
const setRefreshTokenCookie = (res, token) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/api/auth/refresh'
  };

  res.cookie('refreshToken', token, cookieOptions);
};

// Clear refresh token cookie
const clearRefreshTokenCookie = (res) => {
  res.cookie('refreshToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0),
    path: '/api/auth/refresh'
  });
};

// Generate session ID
const generateSessionId = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Token rotation - invalidate after use
const rotateToken = async (userId, oldTokenHash, RefreshToken) => {
  try {
    // Find and invalidate old refresh token
    await RefreshToken.findOneAndDelete({ 
      user: userId,
      tokenHash: oldTokenHash 
    });

    // Generate new tokens
    const accessToken = generateAccessToken(userId);
    const { refreshToken, hash: newTokenHash } = generateRefreshToken(userId);

    // Save new refresh token
    await RefreshToken.create({
      user: userId,
      tokenHash: newTokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    return { accessToken, refreshToken };
  } catch (error) {
    logger.error('Token rotation failed:', error);
    throw new Error('Token rotation failed');
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
  generateSessionId,
  rotateToken
};
