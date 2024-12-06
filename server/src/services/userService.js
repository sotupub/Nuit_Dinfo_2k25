const User = require('../models/User');
const Progress = require('../models/Progress');
const Achievement = require('../models/Achievement');
const logger = require('../config/logger');

// Get user profile
exports.getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

// Update user profile
exports.updateUserProfile = async (userId, updateData) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    throw new Error('User not found');
  }

  logger.info('User profile updated:', userId);
  return user;
};

// Get user progress
exports.getUserProgress = async (userId) => {
  const progress = await Progress.find({ userId });
  return progress;
};

// Update user progress
exports.updateUserProgress = async (userId, lessonId, progressData) => {
  const progress = await Progress.findOneAndUpdate(
    { userId, lessonId },
    { $set: progressData },
    { new: true, upsert: true }
  );

  logger.info('User progress updated:', { userId, lessonId });
  return progress;
};

// Get user achievements
exports.getUserAchievements = async (userId) => {
  const achievements = await Achievement.find({ userId });
  return achievements;
};

// Update user achievements
exports.updateUserAchievements = async (userId, achievementId) => {
  const achievement = await Achievement.findOneAndUpdate(
    { userId, achievementId },
    { $set: { unlockedAt: new Date() } },
    { new: true, upsert: true }
  );

  logger.info('User achievement updated:', { userId, achievementId });
  return achievement;
};
