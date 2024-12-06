const Lesson = require('../models/Lesson');
const Progress = require('../models/Progress');
const Comment = require('../models/Comment');
const logger = require('../config/logger');

// Get all lessons
exports.getAllLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find().sort({ order: 1 });
    res.json(lessons);
  } catch (error) {
    logger.error('Error getting lessons:', error);
    res.status(500).json({ message: 'Error retrieving lessons' });
  }
};

// Get lesson by ID
exports.getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    res.json(lesson);
  } catch (error) {
    logger.error('Error getting lesson:', error);
    res.status(500).json({ message: 'Error retrieving lesson' });
  }
};

// Create new lesson
exports.createLesson = async (req, res) => {
  try {
    const lesson = new Lesson(req.body);
    await lesson.save();
    logger.info('New lesson created:', lesson._id);
    res.status(201).json(lesson);
  } catch (error) {
    logger.error('Error creating lesson:', error);
    res.status(400).json({ message: 'Error creating lesson' });
  }
};

// Update lesson
exports.updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    logger.info('Lesson updated:', lesson._id);
    res.json(lesson);
  } catch (error) {
    logger.error('Error updating lesson:', error);
    res.status(400).json({ message: 'Error updating lesson' });
  }
};

// Delete lesson
exports.deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    logger.info('Lesson deleted:', req.params.id);
    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    logger.error('Error deleting lesson:', error);
    res.status(500).json({ message: 'Error deleting lesson' });
  }
};

// Get lesson progress
exports.getLessonProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({
      userId: req.user._id,
      lessonId: req.params.id
    });
    res.json(progress || { status: 'not_started', score: 0 });
  } catch (error) {
    logger.error('Error getting lesson progress:', error);
    res.status(500).json({ message: 'Error retrieving progress' });
  }
};

// Update lesson progress
exports.updateLessonProgress = async (req, res) => {
  try {
    const progress = await Progress.findOneAndUpdate(
      { userId: req.user._id, lessonId: req.params.id },
      req.body,
      { new: true, upsert: true }
    );
    logger.info('Progress updated for lesson:', req.params.id);
    res.json(progress);
  } catch (error) {
    logger.error('Error updating lesson progress:', error);
    res.status(500).json({ message: 'Error updating progress' });
  }
};

// Get lesson quiz
exports.getLessonQuiz = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).select('quiz');
    if (!lesson || !lesson.quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json(lesson.quiz);
  } catch (error) {
    logger.error('Error getting lesson quiz:', error);
    res.status(500).json({ message: 'Error retrieving quiz' });
  }
};

// Submit quiz answers
exports.submitQuizAnswers = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson || !lesson.quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const score = lesson.calculateQuizScore(req.body.answers);
    
    await Progress.findOneAndUpdate(
      { userId: req.user._id, lessonId: req.params.id },
      { 
        $set: { score },
        $inc: { 'quizResults.$.attempts': 1 }
      },
      { new: true, upsert: true }
    );

    logger.info('Quiz submitted for lesson:', req.params.id);
    res.json({ score });
  } catch (error) {
    logger.error('Error submitting quiz:', error);
    res.status(500).json({ message: 'Error submitting quiz' });
  }
};

// Get lesson comments
exports.getLessonComments = async (req, res) => {
  try {
    const comments = await Comment.find({ lessonId: req.params.id })
      .populate('userId', 'username')
      .sort('-createdAt');
    res.json(comments);
  } catch (error) {
    logger.error('Error getting lesson comments:', error);
    res.status(500).json({ message: 'Error retrieving comments' });
  }
};

// Add comment to lesson
exports.addLessonComment = async (req, res) => {
  try {
    const comment = new Comment({
      lessonId: req.params.id,
      userId: req.user._id,
      content: req.body.content
    });
    await comment.save();
    
    const populatedComment = await Comment.findById(comment._id)
      .populate('userId', 'username');
    
    logger.info('New comment added to lesson:', req.params.id);
    res.status(201).json(populatedComment);
  } catch (error) {
    logger.error('Error adding comment:', error);
    res.status(400).json({ message: 'Error adding comment' });
  }
};
