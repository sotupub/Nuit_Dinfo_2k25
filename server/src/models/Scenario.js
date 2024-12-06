const mongoose = require('mongoose');

const scenarioSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a scenario title'],
    trim: true,
    maxLength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a scenario description']
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  category: {
    type: String,
    required: [true, 'Please provide a scenario category']
  },
  steps: [{
    order: {
      type: Number,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    choices: [{
      text: String,
      isCorrect: Boolean,
      feedback: String
    }]
  }],
  points: {
    type: Number,
    default: 10
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  completionTime: {
    type: Number, // in minutes
    default: 30
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
scenarioSchema.index({ category: 1, difficulty: 1 });
scenarioSchema.index({ createdBy: 1, createdAt: -1 });

const Scenario = mongoose.model('Scenario', scenarioSchema);

module.exports = Scenario;
