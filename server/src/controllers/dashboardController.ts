import { Request, Response } from 'express';

export const getUserDashboardStats = async (req: Request, res: Response) => {
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

export const getAdminDashboardStats = async (req: Request, res: Response) => {
  try {
    // Mock data for now - replace with actual database queries
    const adminStats = {
      totalUsers: 1250,
      activeUsers: 890,
      completionRates: {
        modules: 75,
        quizzes: 82
      },
      themePerformance: [
        { theme: "Password Security", averageScore: 85, completionRate: 78 },
        { theme: "Social Engineering", averageScore: 72, completionRate: 65 },
        { theme: "Network Security", averageScore: 88, completionRate: 70 }
      ],
      achievementDistribution: {
        beginners: 450,
        intermediate: 580,
        advanced: 220
      },
      recentActivity: [
        { type: "module_completion", user: "user123", module: "Password Security", timestamp: new Date() },
        { type: "quiz_completion", user: "user456", quiz: "Social Engineering Basics", timestamp: new Date() }
      ],
      systemAlerts: [
        { type: "warning", message: "High traffic detected", timestamp: new Date() },
        { type: "info", message: "New module published", timestamp: new Date() }
      ]
    };

    res.json(adminStats);
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
