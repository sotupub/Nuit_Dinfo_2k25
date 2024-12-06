export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface VideoType {
  id: number;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  completed: boolean;
  decisionPoint: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  quiz: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  theme: QuizTheme;
  difficulty: DifficultyLevel;
}

export type QuizTheme = 'phishing' | 'passwords' | 'wifi' | 'general';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface UserQuizProgress {
  userId: string;
  themeScores: Record<QuizTheme, number>;
  completedQuestions: string[];
  currentLevel: DifficultyLevel;
}

export type BadgeType = {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: {
    type: 'score' | 'completion' | 'streak';
    value: number;
    theme?: QuizTheme;
  };
};

export type UserLevel = {
  level: number;
  title: string;
  pointsRequired: number;
  badge: BadgeType;
};

export type ModuleProgress = {
  moduleId: string;
  moduleName: string;
  completed: boolean;
  score: number;
  lastAttempt: string;
  timeSpent: number;
};

export type UserProgress = {
  userId: string;
  username: string;
  totalPoints: number;
  currentLevel: number;
  badges: BadgeType[];
  quizProgress: {
    themeScores: Record<QuizTheme, number>;
    completedQuestions: string[];
    currentLevel: DifficultyLevel;
    weakAreas: QuizTheme[];
  };
  moduleProgress: ModuleProgress[];
  learningStreak: number;
  lastActive: string;
};

export interface UserProgressAdmin {
  userId: string;
  username: string;
  currentLevel: string;
  totalPoints: number;
  learningStreak: number;
  lastActive: string;
  badges: Badge[];
  moduleProgress: ModuleProgressAdmin[];
  quizProgress: QuizProgress;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface ModuleProgressAdmin {
  moduleId: string;
  moduleName: string;
  completed: boolean;
  score: number;
  lastAttempt: string;
}

export interface QuizProgress {
  themeScores: Record<string, number>;
  weakAreas: string[];
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalScenarios: number;
  averageCompletionRate: number;
  activityTrends: ActivityTrend[];
  themePerformance: ThemePerformance[];
  achievementDistribution: AchievementStat[];
  recentActivity: ActivityLog[];
  systemAlerts: SystemAlert[];
}

export interface ActivityTrend {
  period: string;
  activeUsers: number;
  change: number;
}

export interface ThemePerformance {
  name: string;
  averageScore: number;
  totalAttempts: number;
}

export interface AchievementStat {
  name: string;
  icon: string;
  earnedCount: number;
}

export interface ActivityLog {
  description: string;
  timestamp: string;
  type: string;
}

export interface SystemAlert {
  message: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
}

export type AdminStatsOriginal = {
  totalUsers: number;
  activeUsers: number;
  averageScore: number;
  moduleCompletionRates: Record<string, number>;
  commonWeaknesses: Array<{
    theme: QuizTheme;
    failureRate: number;
    affectedUsers: number;
  }>;
  userProgress: UserProgress[];
};