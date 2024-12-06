const UserStats = require('../models/UserStats');

// Get user stats
const getUserStats = async (req, res) => {
  try {
    const stats = await UserStats.findOne({ userId: req.user._id })
      .populate('completedScenarios.scenarioId');
    
    if (!stats) {
      // Create new stats if none exist
      const newStats = await UserStats.create({
        userId: req.user._id,
        totalPoints: 0,
        level: 'beginner'
      });
      return res.json(newStats);
    }

    res.json(stats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Error fetching user statistics' });
  }
};

// Update user stats
const updateUserStats = async (req, res) => {
  try {
    const { totalPoints, level, completedScenario } = req.body;
    
    let stats = await UserStats.findOne({ userId: req.user._id });
    
    if (!stats) {
      stats = await UserStats.create({
        userId: req.user._id,
        totalPoints: 0,
        level: 'beginner'
      });
    }

    if (totalPoints !== undefined) stats.totalPoints = totalPoints;
    if (level) stats.level = level;
    
    if (completedScenario) {
      stats.completedScenarios.push({
        scenarioId: completedScenario.scenarioId,
        score: completedScenario.score
      });

      // Update weekly progress
      const currentWeek = new Date();
      currentWeek.setHours(0, 0, 0, 0);
      currentWeek.setDate(currentWeek.getDate() - currentWeek.getDay());

      const weeklyProgress = stats.weeklyProgress.find(wp => 
        new Date(wp.week).getTime() === currentWeek.getTime()
      );

      if (weeklyProgress) {
        weeklyProgress.scenariosCompleted += 1;
        weeklyProgress.totalPoints += completedScenario.score;
      } else {
        stats.weeklyProgress.push({
          week: currentWeek,
          scenariosCompleted: 1,
          totalPoints: completedScenario.score
        });
      }
    }

    await stats.save();
    res.json(stats);
  } catch (error) {
    console.error('Error updating user stats:', error);
    res.status(500).json({ message: 'Error updating user statistics' });
  }
};

// Get leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await UserStats.find()
      .sort('-totalPoints')
      .limit(10)
      .populate('userId', 'username');

    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
};

module.exports = {
  getUserStats,
  updateUserStats,
  getLeaderboard
};
