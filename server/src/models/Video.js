const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A video must have a title'],
    trim: true
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
  url: {
    type: String,
    required: [true, 'A video must have a URL']
  },
  category: {
    type: String,
    required: [true, 'A video must have a category'],
    enum: ['Environment', 'Wildlife', 'Conservation', 'Education']
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Video', videoSchema);
