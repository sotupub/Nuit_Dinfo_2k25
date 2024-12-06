import mongoose, { Model } from 'mongoose';

export interface IChoice {
  text: string;
  isCorrect: boolean;
  feedback: string;
}

export interface IStep {
  order: number;
  content: string;
  choices: IChoice[];
}

export interface IScenario {
  _id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  steps: IStep[];
  points: number;
  createdBy: mongoose.Types.ObjectId;
  completionTime: number;
  createdAt: Date;
  updatedAt: Date;
}

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
    type: Number,
    default: 30
  }
}, {
  timestamps: true
});

// Try to prevent "OverwriteModelError" when model is hot reloaded in development
const Scenario = (mongoose.models.Scenario || mongoose.model('Scenario', scenarioSchema)) as Model<IScenario>;

export default Scenario;
