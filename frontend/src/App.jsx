import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";

/* ---------------- PAGES ---------------- */

import WellNestLanding from "./pages/LandingPage";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import Dashboard from "./pages/Dashboard";
import ProfileSetup from "./pages/ProfileSetup";
import WorkoutsPage from "./pages/WorkoutsPage";
import NutritionPage from "./pages/NutritionPage";
import SleepPage from "./pages/SleepPage";
import WaterIntakePage from "./pages/WaterIntakePage";

import BlogPage from "./pages/BlogPage";
import BlogDetail from "./pages/BlogDetail";

import TrainersPage from "./pages/TrainersPage";
import TrainerProfilePage from "./pages/TrainerProfilePage";

import SessionsPage from "./pages/SessionsPage";
import AICoachPage from "./pages/AICoachPage";

import Layout from "./pages/Layout";

/* ---------------- PROTECTED ROUTE ---------------- */

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

/* ---------------- PUBLIC ROUTE ---------------- */

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

/* ---------------- ROUTES ---------------- */

function AppRoutes() {
  return (
    <Routes>

      {/* Landing Page */}
      <Route path="/" element={<WellNestLanding />} />

      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      <Route path="/verify-otp" element={<VerifyOtpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Protected Routes WITH Layout */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />

        <Route path="/workouts" element={<WorkoutsPage />} />
        <Route path="/nutrition" element={<NutritionPage />} />
        <Route path="/sleep" element={<SleepPage />} />
        <Route path="/water" element={<WaterIntakePage />} />

        <Route path="/blogs" element={<BlogPage />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />

        <Route path="/trainers" element={<TrainersPage />} />
        <Route path="/trainers/:id" element={<TrainerProfilePage />} />

        <Route path="/sessions" element={<SessionsPage />} />

        <Route path="/ai-coach" element={<AICoachPage />} />

      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

/* ---------------- MAIN APP ---------------- */

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>

        <AppRoutes />

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1a1f2e",
              color: "#e2e8f0",
              border: "1px solid #2d3748",
              borderRadius: "12px",
              fontFamily: "Sora, sans-serif",
            },
            success: {
              iconTheme: { primary: "#4ade80", secondary: "#1a1f2e" },
            },
            error: {
              iconTheme: { primary: "#f87171", secondary: "#1a1f2e" },
            },
          }}
        />

      </BrowserRouter>
    </AuthProvider>
  );
}