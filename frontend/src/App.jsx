import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LoginPage      from './pages/LoginPage';
import RegisterPage   from './pages/RegisterPage';
import ProfileSetup   from './pages/ProfileSetup';
import Dashboard      from './pages/Dashboard';
import WorkoutsPage   from './pages/WorkoutsPage';
import NutritionPage  from './pages/NutritionPage';
import SleepPage      from './pages/SleepPage';
import BlogPage       from './pages/BlogPage';
import BlogDetail     from './pages/BlogDetail';
import TrainersPage   from './pages/TrainersPage';
import VerifyOtpPage from "./pages/VerifyOtpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";


// ─── Protected Route guard ────────────────────────────────────────────────────
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// ─── Public Route guard (redirect if already logged in) ──────────────────────
function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

// ─── App Router ───────────────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/blogs"    element={<BlogPage />} />
      <Route path="/blogs/:id" element={<BlogDetail />} />
      <Route path="/trainers" element={<TrainersPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />


      {/* Protected */}
      <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
      <Route path="/dashboard"     element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/workouts"      element={<ProtectedRoute><WorkoutsPage /></ProtectedRoute>} />
      <Route path="/nutrition"     element={<ProtectedRoute><NutritionPage /></ProtectedRoute>} />
      <Route path="/sleep"         element={<ProtectedRoute><SleepPage /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1f2e',
              color: '#e2e8f0',
              border: '1px solid #2d3748',
              borderRadius: '12px',
              fontFamily: 'Sora, sans-serif',
            },
            success: { iconTheme: { primary: '#4ade80', secondary: '#1a1f2e' } },
            error:   { iconTheme: { primary: '#f87171', secondary: '#1a1f2e' } },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}