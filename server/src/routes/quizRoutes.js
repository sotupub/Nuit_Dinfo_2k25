const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const auth = require('../middleware/auth');

// Protected quiz routes
router.get('/', auth.protect, quizController.getAllQuizzes);
router.get('/:id', auth.protect, quizController.getQuizById);
router.post('/:id/submit', auth.protect, quizController.submitQuizAttempt);
router.get('/user/history', auth.protect, quizController.getUserQuizHistory);

// Admin only routes
router.post('/', auth.protect, auth.restrictTo('admin'), quizController.createQuiz);
router.put('/:id', auth.protect, auth.restrictTo('admin'), quizController.updateQuiz);
router.delete('/:id', auth.protect, auth.restrictTo('admin'), quizController.deleteQuiz);
router.get('/:id/stats', auth.protect, auth.restrictTo('admin'), quizController.getQuizStats);

module.exports = router;
