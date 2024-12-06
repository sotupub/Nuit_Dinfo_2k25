const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const auth = require('../middleware/auth');

// Get user's progress data
router.get('/', auth.protect, progressController.getUserProgress);

module.exports = router;
