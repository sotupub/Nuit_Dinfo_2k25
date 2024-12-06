const userService = require('../services/userService');
const logger = require('../config/logger');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is set by auth middleware
    const user = await userService.getUserProfile(userId);
    res.status(200).json({ user });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is set by auth middleware
    const updatedUser = await userService.updateUserProfile(userId, req.body);
    res.status(200).json({ user: updatedUser });
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Get user progress
exports.getProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const progress = await userService.getUserProgress(userId);
    res.status(200).json({ progress });
  } catch (error) {
    logger.error('Get progress error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Update user progress
exports.updateProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { lessonId, progress } = req.body;
    const updatedProgress = await userService.updateUserProgress(userId, lessonId, progress);
    res.status(200).json({ progress: updatedProgress });
  } catch (error) {
    logger.error('Update progress error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Get user achievements
exports.getAchievements = async (req, res) => {
  try {
    const userId = req.user.id;
    const achievements = await userService.getUserAchievements(userId);
    res.status(200).json({ achievements });
  } catch (error) {
    logger.error('Get achievements error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Update user achievements
exports.updateAchievements = async (req, res) => {
  try {
    const userId = req.user.id;
    const { achievementId } = req.body;
    const updatedAchievements = await userService.updateUserAchievements(userId, achievementId);
    res.status(200).json({ achievements: updatedAchievements });
  } catch (error) {
    logger.error('Update achievements error:', error);
    res.status(400).json({ message: error.message });
  }
};
