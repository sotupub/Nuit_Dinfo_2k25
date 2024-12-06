import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Choice {
  text: string;
  isCorrect: boolean;
  feedback: string;
}

export interface Step {
  order: number;
  content: string;
  choices: Choice[];
}

export interface Scenario {
  _id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  points: number;
  completionTime: number;
  steps?: Step[];
}

interface SubmitAnswerResponse {
  isCorrect: boolean;
  feedback: string;
  points: number;
}

interface UserStats {
  totalPoints: number;
  level: string;
  completedScenarios: number;
}

export function useScenarios() {
  const { isAuthenticated } = useAuth();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);

  const fetchScenarios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = Cookies.get('accessToken');
      const response = await fetch(`${API_URL}/scenarios`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch scenarios');
      }

      const data = await response.json();
      setScenarios(data);
    } catch (error) {
      console.error('Error fetching scenarios:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch scenarios');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProgress = useCallback(async (scenarioId: string, score: number, timeSpent: number) => {
    try {
      const token = Cookies.get('accessToken');
      const headers = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/scenarios/${scenarioId}/complete`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ score, timeSpent })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update progress');
      }

      const data = await response.json();
      setUserStats(data.userStats);
      return data.userStats;
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  }, []);

  const submitAnswer = useCallback(async (scenarioId: string, stepIndex: number, choiceIndex: number) => {
    try {
      const token = Cookies.get('accessToken');
      const headers = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/scenarios/${scenarioId}/submit`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ stepIndex, choiceIndex })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit answer');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error submitting answer:', error);
      throw error;
    }
  }, []);

  const fetchScenario = useCallback(async (scenarioId: string): Promise<Scenario | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const token = Cookies.get('accessToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_URL}/scenarios/${scenarioId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch scenario details');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching scenario:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch scenario details');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchScenarios();
  }, [fetchScenarios]);

  return {
    scenarios,
    loading,
    error,
    userStats,
    fetchScenarios,
    fetchScenario,
    submitAnswer,
    updateProgress
  };
}
