const mongoose = require('mongoose');
const logger = require('../config/logger');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a quiz title'],
    trim: true,
    maxLength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a quiz description']
  },
  questions: [{
    questionText: {
      type: String,
      required: [true, 'Please provide the question text']
    },
    options: [{
      type: String,
      required: [true, 'Please provide options for the question']
    }],
    correctAnswer: {
      type: String,
      required: [true, 'Please provide the correct answer']
    }
  }],
  category: {
    type: String,
    required: [true, 'Please provide a quiz category']
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  passingScore: {
    type: Number,
    default: 70
  },
  timeLimit: {
    type: Number,
    default: 30
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Simple score calculation method
quizSchema.methods.calculateScore = function(answers) {
  try {
    if (!answers || typeof answers !== 'object') {
      logger.error('Invalid answers format');
      return { score: 0, passed: false };
    }

    let correctCount = 0;
    const totalQuestions = this.questions.length;

    this.questions.forEach((question, index) => {
      const userAnswer = answers[index] || answers[question._id.toString()] || '';
      if (userAnswer === question.correctAnswer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / totalQuestions) * 100);
    
    return {
      score,
      correctAnswers: correctCount,
      totalQuestions,
      passed: score >= this.passingScore
    };
  } catch (error) {
    logger.error('Error calculating quiz score:', error);
    return {
      score: 0,
      correctAnswers: 0,
      totalQuestions: this.questions.length,
      passed: false
    };
  }
};

// Virtual for number of questions
quizSchema.virtual('questionCount').get(function() {
  return this.questions.length;
});

// Indexes for better performance
quizSchema.index({ category: 1, difficulty: 1 });
quizSchema.index({ createdBy: 1, createdAt: -1 });

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
