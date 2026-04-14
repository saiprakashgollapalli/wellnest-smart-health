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
  
  // Moderation endpoints - no /api prefix because baseURL already has it
  approveBlog: (id) => API.put(`/trainer/blogs/${id}/approve`),
  rejectBlog: (id) => API.put(`/trainer/blogs/${id}/reject`),
};

// ─── Trainers ──────────────────────────────────────────────────
// ONLY ONE DECLARATION - Includes all trainer methods
export const trainerService = {
  getAll: () => API.get('/trainers'),
  getById: (id) => API.get(`/trainers/${id}`),
  getBySpecialization: (spec) => API.get(`/trainers/specialization/${spec}`),
  getPendingBlogs: () => API.get('/trainer/blogs/pending'),
  approveBlog: (id) => API.put(`/trainer/blogs/${id}/approve`),
  rejectBlog: (id) => API.put(`/trainer/blogs/${id}/reject`),
  
  // Trainer Profile endpoints
  getAllProfiles: () => API.get('/trainers/profiles'),
  getMyProfile: () => API.get('/trainers/profile/me'),
  saveMyProfile: (data) => API.post('/trainers/profile', data),
};

// ─── Admin Services ─────────────────────────────────────────────
export const adminService = {
  // Blog moderation - no /api prefix
  getPendingBlogs: () => API.get('/admin/blogs/pending'),
  approveBlog: (id) => API.put(`/admin/blogs/${id}/approve`),
  rejectBlog: (id) => API.put(`/admin/blogs/${id}/reject`),
  deleteBlog: (id) => API.delete(`/admin/blogs/${id}`),
  
  // User management - no /api prefix
  getUsers: () => API.get('/admin/users'),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
};

// ─── Water Intake ─────────────────────────────────────────────
export const waterService = {
  create: (data) => API.post('/water', data),
  getAll: () => API.get('/water'),
  getTodayTotal: () => API.get('/water/today'),
  update: (id, data) => API.put(`/water/${id}`, data),
  delete: (id) => API.delete(`/water/${id}`),
};

// ─── Reviews ──────────────────────────────────────────────────
export const reviewService = {
  getByTrainer: (trainerId) =>
    API.get(`/trainer-reviews/${trainerId}`),
  create: (trainerId, userId, data) =>
    API.post(`/trainer-reviews?trainerId=${trainerId}&userId=${userId}`, data)
};

// ─── Sessions ──────────────────────────────────────────────────
export const sessionService = {
  book: (data) => API.post("/trainer-sessions", data),
  getTrainerSessions: (trainerId) => API.get(`/trainer-sessions/trainer/${trainerId}`),
  getUserSessions: (userId) => API.get(`/trainer-sessions/user/${userId}`),
  cancelSession: (sessionId) => API.put(`/trainer-sessions/${sessionId}/cancel`),
  completeSession: (sessionId) => API.put(`/trainer-sessions/${sessionId}/complete`),
  getClientList: (trainerId) => API.get(`/trainer-sessions/trainer/${trainerId}/clients`)
};

// ─── Recommendations ───────────────────────────────────────────
export const recommendationService = {
  getTrainerRecommendations: (userId) =>
    API.get(`/recommendations/trainers/${userId}`)
};

// ─── AI Coach ─────────────────────────────────────────────────
export const aiCoachService = {
  ask: (question) =>
    API.post("/ai-coach/ask", { question })
};




export default API;