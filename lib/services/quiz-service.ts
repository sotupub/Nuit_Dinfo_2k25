import apiClient from '../api-client';

export interface QuizQuestion {
  questionText: string;
  options: string[];
  correctAnswer: string;
}

export interface Quiz {
  _id: string;
  title: string;
  questions: QuizQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface QuizSubmission {
  quizId: string;
  answers: { [key: string]: string };
}

export const quizService = {
  async getQuizzes() {
    const response = await apiClient.get('/quizzes');
    return response.data;
  },

  async getQuizById(id: string) {
    const response = await apiClient.get(`/quizzes/${id}`);
    return response.data;
  },

  async createQuiz(quizData: Partial<Quiz>) {
    const response = await apiClient.post('/quizzes', quizData);
    return response.data;
  },

  async updateQuiz(id: string, quizData: Partial<Quiz>) {
    const response = await apiClient.put(`/quizzes/${id}`, quizData);
    return response.data;
  },

  async deleteQuiz(id: string) {
    const response = await apiClient.delete(`/quizzes/${id}`);
    return response.data;
  },

  async submitQuiz(submission: QuizSubmission) {
    const response = await apiClient.post(`/quizzes/${submission.quizId}/submit`, submission);
    return response.data;
  },

  async getQuizResults(id: string) {
    const response = await apiClient.get(`/quizzes/${id}/results`);
    return response.data;
  },

  async getUserQuizHistory() {
    const response = await apiClient.get('/quizzes/history');
    return response.data;
  }
};
