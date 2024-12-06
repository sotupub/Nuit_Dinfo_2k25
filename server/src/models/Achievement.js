const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  achievementId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['learning', 'quiz', 'challenge', 'social', 'special'],
    required: true
  },
  criteria: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  icon: {
    type: String
  },
  points: {
    type: Number,
    default: 0
  },
  unlockedAt: {
    type: Date,
    default: null
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  }
}, {
  timestamps: true
});

// Index for faster queries
achievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });

// Method to check if achievement is unlocked
achievementSchema.methods.isUnlocked = function() {
  return this.unlockedAt !== null;
};

// Method to unlock achievement
achievementSchema.methods.unlock = function() {
  if (!this.isUnlocked()) {
    this.unlockedAt = new Date();
    this.progress = 100;
    return true;
  }
  return false;
};

// Method to update progress
achievementSchema.methods.updateProgress = function(newProgress) {
  this.progress = Math.min(Math.max(newProgress, 0), 100);
  if (this.progress === 100) {
    this.unlock();
  }
};

// Static method to get user's achievement summary
achievementSchema.statics.getUserAchievementSummary = async function(userId) {
  const achievements = await this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalAchievements: { $sum: 1 },
        unlockedAchievements: {
          $sum: {
            $cond: [{ $ne: ['$unlockedAt', null] }, 1, 0]
          }
        },
        totalPoints: {
          $sum: {
            $cond: [{ $ne: ['$unlockedAt', null] }, '$points', 0]
          }
        }
      }
    }
  ]);
  
  return achievements[0] || { totalAchievements: 0, unlockedAchievements: 0, totalPoints: 0 };
};

const Achievement = mongoose.model('Achievement', achievementSchema);

module.exports = Achievement;
