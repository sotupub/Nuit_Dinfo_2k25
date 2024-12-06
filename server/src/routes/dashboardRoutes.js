const express = require('express');
const router = express.Router();
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');
const dashboardController = require('../controllers/dashboardController');

// User dashboard stats - requires authentication
router.get('/user-stats', authMiddleware, dashboardController.getUserDashboardStats);

// Admin dashboard stats - requires authentication and admin role
router.get('/admin-stats', [authMiddleware, isAdmin], dashboardController.getAdminDashboardStats);

// Helper functions
async function calculateLearningStreak(userId) {
  // Implement streak calculation logic
  return 7; // Placeholder
}

async function calculateQuizProgress(userId) {
  const quizAttempts = await Quiz.find({ userId })
    .populate('theme')
    .sort({ createdAt: -1 });

  const themeScores = {};
  const weakAreas = new Set();

  quizAttempts.forEach(attempt => {
    const themeName = attempt.theme.name;
    if (!themeScores[themeName]) {
      themeScores[themeName] = [];
    }
    themeScores[themeName].push(attempt.score);

    if (attempt.score < 70) {
      weakAreas.add(themeName);
    }
  });

  // Calculate average scores for each theme
  Object.keys(themeScores).forEach(theme => {
    const scores = themeScores[theme];
    themeScores[theme] = Math.round(
      scores.reduce((a, b) => a + b, 0) / scores.length
    );
  });

  return {
    themeScores,
    weakAreas: Array.from(weakAreas)
  };
}

async function calculateCompletionRate() {
  const totalAttempts = await Scenario.countDocuments();
  const completedAttempts = await Scenario.countDocuments({ completed: true });
  const averageRate = (completedAttempts / totalAttempts) * 100 || 0;
  return { averageRate: Math.round(averageRate) };
}

async function calculateActivityTrends() {
  const now = new Date();
  const dayAgo = new Date(now - 24 * 60 * 60 * 1000);
  const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

  const [dayUsers, weekUsers, monthUsers] = await Promise.all([
    User.countDocuments({ lastActive: { $gte: dayAgo } }),
    User.countDocuments({ lastActive: { $gte: weekAgo } }),
    User.countDocuments({ lastActive: { $gte: monthAgo } })
  ]);

  return [
    { period: 'Last 24h', activeUsers: dayUsers, change: calculateChange(dayUsers) },
    { period: 'Last Week', activeUsers: weekUsers, change: calculateChange(weekUsers) },
    { period: 'Last Month', activeUsers: monthUsers, change: calculateChange(monthUsers) }
  ];
}

async function calculateThemePerformance() {
  const quizzes = await Quiz.find().populate('theme');
  const themeStats = {};

  quizzes.forEach(quiz => {
    const themeName = quiz.theme.name;
    if (!themeStats[themeName]) {
      themeStats[themeName] = { scores: [], attempts: 0 };
    }
    themeStats[themeName].scores.push(quiz.score);
    themeStats[themeName].attempts++;
  });

  return Object.entries(themeStats).map(([name, stats]) => ({
    name,
    averageScore: Math.round(
      stats.scores.reduce((a, b) => a + b, 0) / stats.scores.length
    ),
    totalAttempts: stats.attempts
  }));
}

async function calculateAchievementDistribution() {
  const users = await User.find().populate('achievements');
  const distribution = {};

  users.forEach(user => {
    user.achievements.forEach(achievement => {
      if (!distribution[achievement.name]) {
        distribution[achievement.name] = {
          name: achievement.name,
          icon: achievement.icon,
          earnedCount: 0
        };
      }
      distribution[achievement.name].earnedCount++;
    });
  });

  return Object.values(distribution);
}

async function getRecentActivity() {
  const recentQuizzes = await Quiz.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('userId');

  return recentQuizzes.map(quiz => ({
    description: `${quiz.userId.username} completed ${quiz.theme.name} quiz`,
    timestamp: quiz.createdAt,
    type: 'quiz'
  }));
}

async function getSystemAlerts() {
  // Implement system alerts logic
  return [
    {
      message: 'System performing normally',
      severity: 'low',
      timestamp: new Date()
    }
  ];
}

function calculateChange(current) {
  // Implement change calculation logic
  return Math.round((Math.random() * 20) - 10); // Placeholder
}

module.exports = router;
