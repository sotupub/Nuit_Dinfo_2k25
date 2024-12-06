const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');
const auth = require('../middleware/auth');

// Get all lessons
router.get('/', lessonController.getAllLessons);

// Get lesson by ID
router.get('/:id', lessonController.getLessonById);

// Create new lesson (admin only)
router.post('/', auth.protect, auth.restrictTo('admin'), lessonController.createLesson);

// Update lesson (admin only)
router.put('/:id', auth.protect, auth.restrictTo('admin'), lessonController.updateLesson);

// Delete lesson (admin only)
router.delete('/:id', auth.protect, auth.restrictTo('admin'), lessonController.deleteLesson);

// Get lesson progress for current user
router.get('/:id/progress', auth.protect, lessonController.getLessonProgress);

// Update lesson progress for current user
router.post('/:id/progress', auth.protect, lessonController.updateLessonProgress);

// Get quiz for lesson
router.get('/:id/quiz', auth.protect, lessonController.getLessonQuiz);

// Submit quiz answers
router.post('/:id/quiz/submit', auth.protect, lessonController.submitQuizAnswers);

// Get lesson comments
router.get('/:id/comments', lessonController.getLessonComments);

// Add comment to lesson
router.post('/:id/comments', auth.protect, lessonController.addLessonComment);

module.exports = router;
