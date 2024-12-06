const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    select: false // Don't include password by default in queries
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  verified: {
    type: Boolean,
    default: false
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  securityQuestions: [{
    question: String,
    answer: String
  }],
  devices: [{
    deviceId: String,
    lastLogin: Date
  }],
  progress: {
    completedLessons: [String],
    badges: [String],
    quizScores: [{
      quizId: String,
      score: Number,
      date: Date
    }]
  },
  progressStatus: {
    lessonsCompleted: {
      type: Number,
      default: 0
    },
    quizzesTaken: {
      type: Number,
      default: 0
    },
    badgesEarned: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    // Generate salt
    const salt = await bcrypt.genSalt(12);
    // Hash the password
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  // Ensure candidatePassword is a string
  if (typeof candidatePassword !== 'string') {
    throw new Error('Password must be a string');
  }

  // If no stored password, return false
  if (!this.password) {
    return false;
  }

  try {
    // Use bcrypt to compare the candidate password with the stored hashed password
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error('Password comparison error:', error);
    throw error;
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
