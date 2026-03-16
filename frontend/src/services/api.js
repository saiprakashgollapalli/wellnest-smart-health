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
export default API;

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
  save: (data) => API.post("/profile", data),
  getMe: () => API.get("/profile"),
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
  getAll: () => API.get('/sleep'),
  create: (data) => API.post('/sleep', data),
  update: (id, data) => API.put(`/sleep/${id}`, data),
  delete: (id) => API.delete(`/sleep/${id}`),
  getStreak: () => API.get('/streak')
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
// ─── Water Intake ─────────────────────────────────────────────
export const waterService = {
  create: (data) => API.post('/water', data),
  getAll: () => API.get('/water'),
  getTodayTotal: () => API.get('/water/today'),
  update: (id, data) => API.put(`/water/${id}`, data),
  delete: (id) => API.delete(`/water/${id}`),
};

export const reviewService = {

  getByTrainer: (trainerId) =>
    API.get(`/trainer-reviews/${trainerId}`),

  create: (trainerId, userId, data) =>
    API.post(`/trainer-reviews?trainerId=${trainerId}&userId=${userId}`, data)

};
export const sessionService = {

  book: (data) =>
    API.post("/trainer-sessions", data),

  getTrainerSessions: (trainerId) =>
    API.get(`/trainer-sessions/trainer/${trainerId}`),

  getUserSessions: (userId) =>
    API.get(`/trainer-sessions/user/${userId}`)

};
export const recommendationService = {

  getTrainerRecommendations: (userId) =>
    API.get(`/recommendations/trainers/${userId}`)

};
export const aiCoachService = {

  ask: (question) =>
    API.post("/ai-coach/ask", { question })

};
