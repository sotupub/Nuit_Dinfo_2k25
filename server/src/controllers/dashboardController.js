const getUserDashboardStats = async (req, res) => {
  try {
    // Mock data for now - replace with actual database queries
    const userStats = {
      currentLevel: 3,
      totalPoints: 1250,
      learningStreak: 5,
      moduleProgress: {
        completed: 7,
        inProgress: 2,
        total: 12
      },
      quizPerformance: {
        averageScore: 85,
        totalQuizzes: 15,
        passedQuizzes: 13
      },
      badges: [
        { id: 1, name: "Quick Learner", description: "Completed 5 modules in a week" },
        { id: 2, name: "Quiz Master", description: "Scored 100% in 3 quizzes" }
      ],
      weakAreas: [
        "Password Security",
        "Social Engineering"
      ]
    };

    res.json(userStats);
  } catch (error) {
    console.error('Error fetching user dashboard stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAdminDashboardStats = async (req, res) => {
  try {
    // Mock data for now - replace with actual database queries
    const adminStats = {
      totalUsers: 1250,
      activeUsers: 890,
      completionRates: 75,
      themePerformance: [
        { theme: "Password Security", avgScore: 85 },
        { theme: "Social Engineering", avgScore: 72 },
        { theme: "Network Security", avgScore: 88 }
      ],
      achievementDistribution: [
        { achievement: "Quick Learner", count: 450 },
        { achievement: "Quiz Master", count: 320 },
        { achievement: "Security Expert", count: 150 }
      ],
      recentActivity: [
        { user: "John Doe", action: "Completed Module: Network Security", timestamp: new Date().toISOString() },
        { user: "Jane Smith", action: "Earned Badge: Quick Learner", timestamp: new Date(Date.now() - 3600000).toISOString() },
        { user: "Mike Johnson", action: "Started Quiz: Password Security", timestamp: new Date(Date.now() - 7200000).toISOString() }
      ],
      systemAlerts: [
        { message: "High traffic detected in Network Security module", severity: "medium" },
        { message: "Quiz completion rate below threshold", severity: "low" },
        { message: "New security vulnerability reported", severity: "high" }
      ]
    };

    res.json(adminStats);
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getUserDashboardStats,
  getAdminDashboardStats
};
