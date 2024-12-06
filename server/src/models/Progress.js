const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started'
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  completedAt: {
    type: Date
  },
  quizResults: [{
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz'
    },
    score: {
      type: Number,
      min: 0,
      max: 100
    },
    attempts: {
      type: Number,
      default: 0
    },
    lastAttemptAt: {
      type: Date
    }
  }],
  timeSpent: {
    type: Number, // Time spent in seconds
    default: 0
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
progressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

// Update lastAccessedAt before saving
progressSchema.pre('save', function(next) {
  this.lastAccessedAt = new Date();
  next();
});

// Method to update progress status based on score
progressSchema.methods.updateStatus = function() {
  if (this.score >= 80) {
    this.status = 'completed';
    this.completedAt = new Date();
  } else if (this.score > 0) {
    this.status = 'in_progress';
  }
};

// Method to add quiz result
progressSchema.methods.addQuizResult = function(quizId, score) {
  const existingQuiz = this.quizResults.find(q => q.quizId.equals(quizId));
  
  if (existingQuiz) {
    existingQuiz.score = score;
    existingQuiz.attempts += 1;
    existingQuiz.lastAttemptAt = new Date();
  } else {
    this.quizResults.push({
      quizId,
      score,
      attempts: 1,
      lastAttemptAt: new Date()
    });
  }
  
  // Update overall progress score (average of all quiz scores)
  const totalScore = this.quizResults.reduce((sum, quiz) => sum + quiz.score, 0);
  this.score = totalScore / this.quizResults.length;
  
  this.updateStatus();
};

// Static method to get user's overall progress
progressSchema.statics.getUserProgress = async function(userId) {
  const progress = await this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalLessons: { $sum: 1 },
        completedLessons: {
          $sum: {
            $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
          }
        },
        averageScore: { $avg: '$score' }
      }
    }
  ]);
  
  return progress[0] || { totalLessons: 0, completedLessons: 0, averageScore: 0 };
};

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;
