const User = require('../models/User');
const QuizAttempt = require('../models/QuizAttempt');
const logger = require('../config/logger');

// Get user's progress data
exports.getUserProgress = async (req, res) => {
  try {
    // Get user's quiz attempts
    const quizAttempts = await QuizAttempt.find({ user: req.user.id });
    
    // Calculate skill levels based on quiz performance
    const skillLevels = {
      phishing: calculateSkillLevel(quizAttempts, 'phishing'),
      passwords: calculateSkillLevel(quizAttempts, 'passwords'),
      networkSecurity: calculateSkillLevel(quizAttempts, 'network'),
      socialEngineering: calculateSkillLevel(quizAttempts, 'social'),
      dataProtection: calculateSkillLevel(quizAttempts, 'data'),
      incidentResponse: calculateSkillLevel(quizAttempts, 'incident')
    };

    // Calculate overall progress
    const overallProgress = Math.round(
      Object.values(skillLevels).reduce((a, b) => a + b, 0) / Object.keys(skillLevels).length
    );

    // Mock data for now - replace with actual database queries later
    const progressData = {
      overallProgress,
      totalPoints: calculateTotalPoints(quizAttempts),
      hoursSpent: calculateHoursSpent(quizAttempts),
      completedModules: countCompletedModules(quizAttempts),
      skillLevels,
      recentAchievements: [
        {
          id: 1,
          title: "Expert en Phishing",
          description: "Complété tous les scénarios de phishing",
          date: new Date().toISOString(),
          icon: "🎯"
        }
      ],
      weeklyActivity: generateWeeklyActivity(),
      learningPath: [
        {
          module: "Introduction à la Cybersécurité",
          progress: 100,
          status: "completed"
        },
        {
          module: "Sécurité des Emails",
          progress: 85,
          status: "in-progress"
        },
        {
          module: "Protection des Données",
          progress: 60,
          status: "in-progress"
        },
        {
          module: "Sécurité des Réseaux",
          progress: 30,
          status: "in-progress"
        },
        {
          module: "Gestion des Incidents",
          progress: 0,
          status: "locked"
        }
      ]
    };

    res.json(progressData);
  } catch (error) {
    logger.error('Error getting user progress:', error);
    res.status(500).json({ message: 'Error retrieving progress data' });
  }
};

// Helper functions
function calculateSkillLevel(attempts, category) {
  const categoryAttempts = attempts.filter(a => a.quiz.category === category);
  if (categoryAttempts.length === 0) return 0;
  
  const averageScore = categoryAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / categoryAttempts.length;
  return Math.round(averageScore);
}

function calculateTotalPoints(attempts) {
  return attempts.reduce((sum, attempt) => sum + attempt.score, 0) * 10;
}

function calculateHoursSpent(attempts) {
  const totalMinutes = attempts.reduce((sum, attempt) => sum + attempt.duration, 0);
  return Math.round((totalMinutes / 60) * 10) / 10;
}

function countCompletedModules(attempts) {
  const uniqueModules = new Set(attempts.filter(a => a.score >= 70).map(a => a.quiz.category));
  return uniqueModules.size;
}

function generateWeeklyActivity() {
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  return days.map(day => ({
    day,
    hours: Math.round(Math.random() * 3 * 10) / 10
  }));
}
