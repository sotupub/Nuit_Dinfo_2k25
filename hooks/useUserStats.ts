import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface CompletedScenario {
  scenarioId: string;
  completedAt: Date;
  score: number;
}

interface Achievement {
  name: string;
  description: string;
  unlockedAt: Date;
}

interface WeeklyProgress {
  week: Date;
  pointsEarned: number;
  scenariosCompleted: number;
}

interface UserStats {
  totalPoints: number;
  level: 'beginner' | 'explorer' | 'expert';
  completedScenarios: CompletedScenario[];
  achievements: Achievement[];
  weeklyProgress: WeeklyProgress[];
}

interface LeaderboardEntry {
  userId: {
    username: string;
  };
  totalPoints: number;
  level: string;
}

export const useUserStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stats`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user stats');
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/leaderboard`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }

      const data = await response.json();
      setLeaderboard(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const updateStats = async (update: Partial<UserStats>) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stats`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(update),
      });

      if (!response.ok) {
        throw new Error('Failed to update user stats');
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  useEffect(() => {
    if (user) {
      fetchStats();
      fetchLeaderboard();
    }
  }, [user]);

  return {
    stats,
    leaderboard,
    loading,
    error,
    fetchStats,
    fetchLeaderboard,
    updateStats,
  };
};
