const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A video must have a title'],
    trim: true,
    maxlength: [100, 'A video title must have less than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'A video must have a description'],
    trim: true
  },
  thumbnail: {
    type: String,
    required: [true, 'A video must have a thumbnail']
  },
  duration: {
    type: String,
    required: [true, 'A video must have a duration']
  },
  category: {
    type: String,
    required: [true, 'A video must have a category'],
    enum: {
      values: ['Environment', 'Wildlife', 'Conservation', 'Education'],
      message: 'Category must be either: Environment, Wildlife, Conservation, or Education'
    }
  },
  url: {
    type: String,
    required: [true, 'A video must have a URL']
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A video must belong to a user']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
videoSchema.index({ category: 1 });
videoSchema.index({ createdAt: -1 });
videoSchema.index({ views: -1 });
videoSchema.index({ likes: -1 });

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
