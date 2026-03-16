import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiActivity, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import toast from 'react-hot-toast';

export default function LoginPage() {

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // ───────── VALIDATION ─────────
  const validate = () => {
    const errs = {};

    if (!form.email)
      errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Invalid email address';

    if (!form.password)
      errs.password = 'Password is required';

    return errs;
  };

  // ───────── HANDLE CHANGE ─────────
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  // ───────── SUBMIT LOGIN ─────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);

    try {
      const res = await authService.login(form);
      const data = res.data;

      login(
        { name: data.name, email: data.email, role: data.role, userId: data.userId },
        data.token
      );

      toast.success(`Welcome back, ${data.name}! 👋`);

      navigate(data.hasProfile ? '/dashboard' : '/profile-setup');

    } catch (err) {

      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        "Login failed";

      toast.error(msg);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">

      {/* LEFT PANEL */}
      <div className="flex-1 flex items-center justify-center p-[48px] bg-[linear-gradient(135deg,#0d1117_0%,#0a1628_50%,#0d2116_100%)]">

        <div className="max-w-[460px]">

          <FiActivity className="text-[2.5rem] text-[var(--emerald)]" />

         <h1 className="text-[3rem] font-bold leading-[1.2]">
  <span className="text-white">Track.</span>{" "}
  <span className="text-[var(--emerald)]">Improve.</span>{" "}
  <span className="text-white">Thrive.</span>
</h1>
          <p className="text-[var(--text-secondary)] mt-[20px]">
            Your complete health companion. Track workouts, nutrition, sleep
            and watch your progress grow.
          </p>

        </div>

      </div>

      {/* RIGHT PANEL */}
      <div className="w-[440px] flex items-center justify-center px-[24px] py-[32px] bg-[var(--bg-card)] border-l border-[var(--border)]">

        <div className="w-full max-w-[380px] page-enter">

          {/* HEADER */}
          <div className="mb-[32px]">

            <Link to="/" className="inline-flex items-center gap-[8px] font-bold mb-[24px]">
              <FiActivity className="text-[var(--emerald)]" />
              WellNest
            </Link>

            <h2 className="text-[1.8rem] font-bold">
              Welcome back
            </h2>

            <p className="text-[var(--text-secondary)] text-[0.9rem]">
              Sign in to your dashboard
            </p>

          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-[18px]"
            noValidate
          >

            {/* EMAIL */}
            <div className="form-group">

              <label>Email Address</label>

              <div className="relative">

                <FiMail className="absolute left-[14px] top-[50%] -translate-y-1/2" />

                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="pl-[44px]"
                />

              </div>

              {errors.email && (
                <span className="form-error">
                  {errors.email}
                </span>
              )}

            </div>

            {/* PASSWORD */}
            <div className="form-group">

              <label>Password</label>

              <div className="relative">

                <FiLock className="absolute left-[14px] top-[50%] -translate-y-1/2" />

                <input
                  type={showPwd ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="pl-[44px] pr-[44px]"
                />

                <button
  type="button"
  onClick={() => setShowPwd(prev => !prev)}
  className="absolute right-[12px] top-[50%] -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
>
  {showPwd ? <FiEyeOff /> : <FiEye />}
</button>

              </div>

              {errors.password && (
                <span className="form-error">
                  {errors.password}
                </span>
              )}

            </div>

            {/* FORGOT PASSWORD */}
            <div className="text-right -mt-[10px]">

              <Link
                to="/forgot-password"
                className="text-[0.85rem] text-[var(--emerald)] font-medium"
              >
                Forgot password?
              </Link>

            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="btn-primary w-full justify-center mt-[8px]"
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>

          </form>

          {/* FOOTER */}
          <p className="mt-[24px] text-center text-[0.9rem]">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="text-[var(--emerald)] font-semibold"
            >
              Create one
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}