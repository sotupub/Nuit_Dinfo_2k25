const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const userStatsController = require('../controllers/userStatsController');

// Protected routes
router.get('/stats', authMiddleware, userStatsController.getUserStats);
router.put('/stats', authMiddleware, userStatsController.updateUserStats);

// Public route
router.get('/leaderboard', userStatsController.getLeaderboard);

module.exports = router;
