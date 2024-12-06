const express = require('express');
const { protect, restrictTo } = require('../middleware/auth');
const {
  getScenarios,
  getScenario,
  submitAnswer,
  createScenario,
  updateScenario,
  deleteScenario,
  updateScenarioProgress
} = require('../controllers/scenarioController');

const router = express.Router();

// Public routes
router.get('/', getScenarios);
router.get('/:id', getScenario);

// Protected routes
router.post('/:id/submit', protect, submitAnswer);
router.post('/:id/complete', protect, updateScenarioProgress);

// Admin only routes
router.post('/', protect, restrictTo('admin'), createScenario);
router.put('/:id', protect, restrictTo('admin'), updateScenario);
router.delete('/:id', protect, restrictTo('admin'), deleteScenario);

module.exports = router;
