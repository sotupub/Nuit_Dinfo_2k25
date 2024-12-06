const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    selectedAnswer: {
      type: String,
      required: true,
      default: 'no_answer'
    },
    isCorrect: {
      type: Boolean,
      required: true,
      default: false
    }
  }],
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  timeSpent: {
    type: Number,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for faster queries
quizAttemptSchema.index({ userId: 1, quizId: 1 });
quizAttemptSchema.index({ quizId: 1, score: -1 });
quizAttemptSchema.index({ userId: 1, createdAt: -1 });

// Virtual for passed status
quizAttemptSchema.virtual('passed').get(function() {
  return this.score >= 70; // Default passing score
});

// Static method to get user's best attempt
quizAttemptSchema.statics.getBestAttempt = async function(userId, quizId) {
  return this.findOne({ userId, quizId })
    .sort('-score')
    .exec();
};

const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);

module.exports = QuizAttempt;
