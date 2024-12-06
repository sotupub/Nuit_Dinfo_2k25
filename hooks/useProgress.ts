import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export interface ProgressData {
  overallProgress: number;
  totalPoints: number;
  hoursSpent: number;
  completedModules: number;
  skillLevels: {
    [key: string]: number;
  };
  recentAchievements: Array<{
    id: number;
    title: string;
    description: string;
    date: string;
    icon: string;
  }>;
  weeklyActivity: Array<{
    day: string;
    hours: number;
  }>;
  learningPath: Array<{
    module: string;
    progress: number;
    status: 'completed' | 'in-progress' | 'locked';
  }>;
}

export function useProgress() {
  const { user } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setError(null);
        const response = await fetch('http://localhost:5000/api/progress', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error('Failed to fetch progress data');
        }

        const progressData = await response.json();
        setData(progressData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user, router]);

  return { data, loading, error };
}
