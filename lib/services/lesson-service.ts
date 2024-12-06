import apiClient from '../api-client';

export interface Lesson {
  _id: string;
  title: string;
  content: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export const lessonService = {
  async getLessons(params?: { difficulty?: string; tags?: string[] }) {
    const response = await apiClient.get('/lessons', { params });
    return response.data;
  },

  async getLessonById(id: string) {
    const response = await apiClient.get(`/lessons/${id}`);
    return response.data;
  },

  async createLesson(lessonData: Partial<Lesson>) {
    const response = await apiClient.post('/lessons', lessonData);
    return response.data;
  },

  async updateLesson(id: string, lessonData: Partial<Lesson>) {
    const response = await apiClient.put(`/lessons/${id}`, lessonData);
    return response.data;
  },

  async deleteLesson(id: string) {
    const response = await apiClient.delete(`/lessons/${id}`);
    return response.data;
  },

  async getUserProgress() {
    const response = await apiClient.get('/lessons/progress');
    return response.data;
  },

  async markLessonComplete(id: string) {
    const response = await apiClient.post(`/lessons/${id}/complete`);
    return response.data;
  }
};
