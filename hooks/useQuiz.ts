import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Cookies from 'js-cookie';

export interface Question {
  questionText: string;
  options: string[];
  correctAnswer: string;
}

export interface Quiz {
  _id: string;
  title: string;
  questions: Question[];
  timeLimit: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuizResult {
  success: boolean;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  passed: boolean;
  answers: {
    questionId: string;
    isCorrect: boolean;
    selectedAnswer: string;
    correctAnswer: string;
  }[];
  message: string;
}

export function useQuiz() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizResults, setQuizResults] = useState<Record<string, QuizResult>>({});
  const { isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const controller = new AbortController();
      
      const fetchQuizzesData = async () => {
        try {
          setLoading(true);
          const token = Cookies.get('accessToken');
          const response = await fetch('http://localhost:5000/api/quizzes', {
            headers: {
              ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            signal: controller.signal
          });

          if (!response.ok) {
            throw new Error('Failed to fetch quizzes');
          }

          const data = await response.json();
          setQuizzes(data);
          setError(null);
        } catch (error) {
          if (error instanceof Error && error.name !== 'AbortError') {
            setError(error.message);
          }
        } finally {
          setLoading(false);
        }
      };

      fetchQuizzesData();

      return () => {
        controller.abort();
      };
    }
  }, [isAuthenticated, authLoading]);

  const submitQuizAnswer = async (quizId: string, answers: Array<{ questionId: string; selectedAnswer: string }>) => {
    if (!isAuthenticated) {
      throw new Error('You must be logged in to submit answers');
    }

    try {
      const token = Cookies.get('accessToken');
      const response = await fetch(`http://localhost:5000/api/quizzes/${quizId}/submit`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ answers }),
      });

      if (response.status === 401) {
        // Try to refresh the token
        const refreshResponse = await fetch('http://localhost:5000/api/auth/refresh', {
          method: 'POST',
          credentials: 'include',
        });

        if (refreshResponse.ok) {
          // Token refreshed, retry the submission
          const newToken = Cookies.get('accessToken');
          const retryResponse = await fetch(`http://localhost:5000/api/quizzes/${quizId}/submit`, {
            method: 'POST',
            headers: {
              ...(newToken ? { 'Authorization': `Bearer ${newToken}` } : {}),
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ answers }),
          });

          if (!retryResponse.ok) {
            const errorData = await retryResponse.json();
            throw new Error(errorData.message || 'Failed to submit quiz answers');
          }

          const result = await retryResponse.json();
          return result;
        } else {
          throw new Error('Session expired. Please log in again.');
        }
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit quiz answers');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error submitting quiz answers:', error);
      throw error;
    }
  };

  return {
    quizzes,
    loading: loading || authLoading, // Consider auth loading state
    error,
    quizResults,
    submitQuizAnswer,
    isAuthenticated // Expose auth state to consumers
  };
}
