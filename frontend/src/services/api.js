import axios from 'axios';

// Base API instance
const API = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request interceptor – attach JWT ─────────────────────────
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('wellnest_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor – handle 401 ─────────────────────────
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('wellnest_token');
      localStorage.removeItem('wellnest_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ──────────────────────────────────────────────────────
export const authService = {

  register: (data) => API.post('/auth/register', data),

  login: (data) => API.post('/auth/login', data),

  verifyOtp: (email, otp) =>
    API.post('/auth/verify-otp', null, {
      params: { email, otp }
    }),

  // ✅ FIXED (API not api)
  resendOtp: (email) =>
    API.post('/auth/resend-otp', null, {
      params: { email }
    }),

  forgotPassword: (email) =>
    API.post('/auth/forgot-password', null, {
      params: { email }
    }),

  resetPassword: (email, otp, newPassword) =>
    API.post('/auth/reset-password', null, {
      params: { email, otp, newPassword }
    }),
};

// ─── Profile ───────────────────────────────────────────────────
export const profileService = {
  save: (data) => API.post('/profile', data),
  get: () => API.get('/profile'),
};

// ─── Workouts ──────────────────────────────────────────────────
export const workoutService = {
  create: (data) => API.post('/workouts', data),
  getAll: () => API.get('/workouts'),
  update: (id, data) => API.put(`/workouts/${id}`, data),
  delete: (id) => API.delete(`/workouts/${id}`),
};

// ─── Nutrition ─────────────────────────────────────────────────
export const nutritionService = {
  create: (data) => API.post('/nutrition', data),
  getAll: () => API.get('/nutrition'),
  update: (id, data) => API.put(`/nutrition/${id}`, data),
  delete: (id) => API.delete(`/nutrition/${id}`),
};

// ─── Sleep ─────────────────────────────────────────────────────
export const sleepService = {
  create: (data) => API.post('/sleep', data),
  getAll: () => API.get('/sleep'),
  update: (id, data) => API.put(`/sleep/${id}`, data),
  delete: (id) => API.delete(`/sleep/${id}`),
};

// ─── Analytics ─────────────────────────────────────────────────
export const analyticsService = {
  getDashboard: () => API.get('/analytics/dashboard'),
};

// ─── Blogs ─────────────────────────────────────────────────────
export const blogService = {
  getAll: () => API.get('/blogs'),
  getById: (id) => API.get(`/blogs/${id}`),
  getByCategory: (category) => API.get(`/blogs/category/${category}`),
  create: (data) => API.post('/blogs', data),
  delete: (id) => API.delete(`/blogs/${id}`),
};

// ─── Trainers ──────────────────────────────────────────────────
export const trainerService = {
  getAll: () => API.get('/trainers'),
  getById: (id) => API.get(`/trainers/${id}`),
  getBySpecialization: (spec) =>
    API.get(`/trainers/specialization/${spec}`),
};

export default API;
