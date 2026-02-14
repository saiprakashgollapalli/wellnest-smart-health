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

  // ───────────────── VALIDATION ─────────────────
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

  // ───────────────── HANDLE CHANGE ─────────────────
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  // ───────────────── SUBMIT LOGIN ─────────────────
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

  // ───────────────── UI ─────────────────
  return (
    <div style={styles.page}>

      {/* LEFT PANEL */}
      <div style={styles.left}>
        <div style={styles.heroContent}>
          <FiActivity style={{ color: 'var(--emerald)', fontSize: '2.5rem' }} />

          <h1 style={styles.heroTitle}>
            Track. <span style={{ color: 'var(--emerald)' }}>Improve.</span> Thrive.
          </h1>

          <p style={styles.heroSub}>
            Your complete health companion. Track workouts, nutrition, sleep
            and watch your progress grow.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={styles.right}>
        <div style={styles.formCard} className="page-enter">

          <div style={styles.formHeader}>
            <Link to="/" style={styles.logo}>
              <FiActivity style={{ color: 'var(--emerald)' }} />
              WellNest
            </Link>

            <h2 style={styles.title}>Welcome back</h2>
            <p style={styles.subtitle}>Sign in to your dashboard</p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} style={styles.form} noValidate>

            {/* EMAIL */}
            <div className="form-group">
              <label>Email Address</label>

              <div style={styles.inputWrap}>
                <FiMail style={styles.icon} />
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  style={{ paddingLeft: '44px' }}
                />
              </div>

              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            {/* PASSWORD */}
            <div className="form-group">
              <label>Password</label>

              <div style={styles.inputWrap}>
                <FiLock style={styles.icon} />

                <input
                  type={showPwd ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  style={{ paddingLeft: '44px', paddingRight: '44px' }}
                />

                <button
                  type="button"
                  style={styles.eyeBtn}
                  onClick={() => setShowPwd(prev => !prev)}
                >
                  {showPwd ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            {/* FORGOT PASSWORD */}
            <div style={{ textAlign: "right", marginTop: "-10px" }}>
              <Link
                to="/forgot-password"
                style={{
                  fontSize: "0.85rem",
                  color: "var(--emerald)",
                  fontWeight: 500
                }}
              >
                Forgot password?
              </Link>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>

          </form>

          {/* FOOTER */}
          <p style={styles.footer}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: 'var(--emerald)', fontWeight: 600 }}>
              Create one
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', minHeight: '100vh' },

  left: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px',
    background: 'linear-gradient(135deg, #0d1117 0%, #0a1628 50%, #0d2116 100%)'
  },

  heroContent: { maxWidth: '460px' },

  heroTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '3rem',
    fontWeight: 700,
    marginTop: '20px'
  },

  heroSub: {
    color: 'var(--text-secondary)',
    marginTop: '20px'
  },

  right: {
    width: '440px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 24px',
    background: 'var(--bg-card)',
    borderLeft: '1px solid var(--border)'
  },

  formCard: { width: '100%', maxWidth: '380px' },

  formHeader: { marginBottom: '32px' },

  logo: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: 700,
    marginBottom: '24px'
  },

  title: { fontSize: '1.8rem', fontWeight: 700 },

  subtitle: { color: 'var(--text-secondary)', fontSize: '0.9rem' },

  form: { display: 'flex', flexDirection: 'column', gap: '18px' },

  inputWrap: { position: 'relative' },

  icon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)'
  },

  eyeBtn: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'transparent',
    cursor: 'pointer',
    color:"white"
  },

  footer: {
    marginTop: '24px',
    textAlign: 'center',
    fontSize: '0.9rem'
  }
};
