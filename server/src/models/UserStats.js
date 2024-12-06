const mongoose = require('mongoose');

const userStatsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  level: {
    type: String,
    enum: ['beginner', 'explorer', 'expert'],
    default: 'beginner'
  },
  completedScenarios: [{
    scenarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Scenario'
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    score: Number
  }],
  achievements: [{
    name: String,
    description: String,
    unlockedAt: {
      type: Date,
      default: Date.now
    }
  }],
  weeklyProgress: [{
    week: Date,
    pointsEarned: Number,
    scenariosCompleted: Number
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('UserStats', userStatsSchema);
