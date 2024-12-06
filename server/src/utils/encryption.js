const crypto = require('crypto');
const logger = require('../logger');

// Configuration for encryption
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32);
const IV_LENGTH = 16; // For AES, this is always 16 bytes

/**
 * Encrypt data using AES-256-CBC
 * @param {string} text - Text to encrypt
 * @returns {string} Encrypted text
 */
function encrypt(text) {
  try {
    // Create a random initialization vector
    const iv = crypto.randomBytes(IV_LENGTH);
    
    // Create a cipher using the key and IV
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    
    // Encrypt the text
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Combine IV and encrypted text
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    logger.error('Encryption error:', error);
    throw new Error('Encryption failed');
  }
}

/**
 * Decrypt data using AES-256-CBC
 * @param {string} encryptedText - Text to decrypt
 * @returns {string} Decrypted text
 */
function decrypt(encryptedText) {
  try {
    // Split the IV and encrypted text
    const textParts = encryptedText.split(':');
    const iv = Buffer.from(textParts[0], 'hex');
    const encryptedData = textParts[1];
    
    // Create a decipher using the key and IV
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    
    // Decrypt the text
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    logger.error('Decryption error:', error);
    throw new Error('Decryption failed');
  }
}

/**
 * Generate a secure random token
 * @param {number} length - Length of the token
 * @returns {string} Random token
 */
function generateToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Hash a password using SHA-256
 * @param {string} password - Password to hash
 * @returns {string} Hashed password
 */
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * Compare a password with a hashed password
 * @param {string} inputPassword - Password to check
 * @param {string} storedHash - Stored hashed password
 * @returns {boolean} Whether passwords match
 */
function comparePassword(inputPassword, storedHash) {
  const hashedInput = hashPassword(inputPassword);
  return hashedInput === storedHash;
}

module.exports = {
  encrypt,
  decrypt,
  generateToken,
  hashPassword,
  comparePassword
};
