export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  withCredentials: true
};

export const AUTH_CONFIG = {
  tokenKey: 'accessToken',
  refreshTokenKey: 'refreshToken',
  tokenPrefix: 'Bearer'
};

export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  lessons: '/lessons',
  quizzes: '/quizzes',
  profile: '/profile',
  dashboard: '/dashboard'
};

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me'
  },
  lessons: {
    base: '/lessons',
    byId: (id: string) => `/lessons/${id}`,
    progress: '/lessons/progress',
    complete: (id: string) => `/lessons/${id}/complete`
  },
  quizzes: {
    base: '/quizzes',
    byId: (id: string) => `/quizzes/${id}`,
    submit: (id: string) => `/quizzes/${id}/submit`,
    results: (id: string) => `/quizzes/${id}/results`,
    history: '/quizzes/history'
  }
};
