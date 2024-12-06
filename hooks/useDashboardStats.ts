import { useState, useEffect } from 'react';
import { AdminStats, UserProgress } from '@/lib/types';
import { useAuth } from './useAuth';

interface UseDashboardStatsReturn {
  userStats: UserProgress | null;
  adminStats: AdminStats | null;
  loading: boolean;
  error: string | null;
}

export function useDashboardStats(): UseDashboardStatsReturn {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<UserProgress | null>(null);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const endpoint = user.role === 'admin' ? '/api/dashboard/admin-stats' : '/api/dashboard/user-stats';
        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard statistics');
        }

        const data = await response.json();

        if (user.role === 'admin') {
          setAdminStats(data);
        } else {
          setUserStats(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [user]);

  return { userStats, adminStats, loading, error };
}
