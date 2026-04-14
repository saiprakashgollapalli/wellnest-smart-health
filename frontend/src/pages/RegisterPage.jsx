import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiActivity, FiEye, FiEyeOff, FiCheck, FiX } from 'react-icons/fi';
import { authService } from '../services/api';
import toast from 'react-hot-toast';

const pwdChecks = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'Uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'Lowercase letter', test: (p) => /[a-z]/.test(p) },
  { label: 'Number', test: (p) => /\d/.test(p) },
  { label: 'Special character (@$!%*?&)', test: (p) => /[@$!%*?&]/.test(p) },
];

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPwd: '',
    role: 'USER',
    gender: 'MALE'
  });

  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const pwdStrength = pwdChecks.filter(c => c.test(form.password)).length;

  const validate = () => {
    const errs = {};
    if (!form.name || form.name.trim().length < 2)
      errs.name = 'Name must be at least 2 characters';
    if (!form.email)
      errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Invalid email address';
    if (pwdStrength < 5)
      errs.password = 'Password must meet all requirements';
    if (form.password !== form.confirmPwd)
      errs.confirmPwd = 'Passwords do not match';
    return errs;
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      await authService.register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        gender: form.gender
      });
      toast.success("OTP sent to your email 📩");
      navigate("/verify-otp", { state: { email: form.email, mode: "register" } });
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const strengthColors = ['var(--red)', 'var(--red)', 'var(--yellow)', 'var(--yellow)', 'var(--emerald)'];
  const strengthLabels = ['', 'Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColor = pwdStrength === 0 ? 'var(--text-muted)' : strengthColors[pwdStrength - 1];

  return (
    <div className="min-h-screen flex items-center justify-center px-[24px] py-[40px]">
      <div className="w-full max-w-[520px]">
        <div className="mb-[32px]">
          <Link to="/" className="inline-flex items-center gap-[8px] font-bold mb-[24px]">
            <FiActivity className="text-[var(--emerald)]" />
            WellNest
          </Link>
          <h2 className="text-[1.8rem] font-bold mb-[6px]">Create your account</h2>
          <p className="text-[0.9rem] text-[var(--text-secondary)]">
            Join thousands improving their health every day
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-[18px] p-[28px] bg-[var(--bg-card)] border border-[var(--border)] rounded-[12px]" noValidate>
          <div className="grid grid-cols-2 gap-[16px]">
            <div>
              <label>Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-[14px] top-[50%] -translate-y-1/2 text-[var(--text-muted)]" />
                <input type="text" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} className="pl-[44px]" />
              </div>
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>
            <div>
              <label>Account Type</label>
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="USER">Regular User</option>
                <option value="TRAINER">Fitness Trainer</option>
              </select>
            </div>
          </div>

          <div>
            <label>Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-[14px] top-[50%] -translate-y-1/2 text-[var(--text-muted)]" />
              <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} className="pl-[44px]" />
            </div>
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div>
            <label>Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange}>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label>Password</label>
            <div className="relative">
              <FiLock className="absolute left-[14px] top-[50%] -translate-y-1/2 text-[var(--text-muted)]" />
              <input type={showPwd ? 'text' : 'password'} name="password" placeholder="Create a strong password" value={form.password} onChange={handleChange} className="pl-[44px] pr-[44px]" />
              <button type="button" onClick={() => setShowPwd(prev => !prev)} className="absolute right-[12px] top-[50%] -translate-y-1/2 text-white">
                {showPwd ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {form.password && (
              <div className="mt-[10px]">
                <div className="flex gap-[4px] mb-[6px]">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="flex-1 h-[4px] rounded-[2px]" style={{ background: i <= pwdStrength ? strengthColor : 'var(--border)' }} />
                  ))}
                </div>
                <span className="text-[0.78rem]" style={{ color: strengthColor }}>{strengthLabels[pwdStrength]}</span>
                <ul className="grid grid-cols-2 gap-x-[16px] gap-y-[4px] mt-[8px]">
                  {pwdChecks.map(c => (
                    <li key={c.label} className="flex items-center gap-[6px] text-[0.78rem]" style={{ color: c.test(form.password) ? 'var(--emerald)' : 'var(--text-muted)' }}>
                      {c.test(form.password) ? <FiCheck /> : <FiX />}
                      {c.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <div>
            <label>Confirm Password</label>
            <div className="relative">
              <FiLock className="absolute left-[14px] top-[50%] -translate-y-1/2 text-[var(--text-muted)]" />
              <input type={showConfirmPwd ? 'text' : 'password'} name="confirmPwd" placeholder="Repeat your password" value={form.confirmPwd} onChange={handleChange} className="pl-[44px] pr-[44px]" />
              <button type="button" onClick={() => setShowConfirmPwd(prev => !prev)} className="absolute right-[12px] top-[50%] -translate-y-1/2 text-white">
                {showConfirmPwd ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.confirmPwd && <span className="form-error">{errors.confirmPwd}</span>}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full mt-[12px]" style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-[20px] text-[0.9rem]">
          Already have an account?{' '}
          <Link to="/login" className="text-[var(--emerald)]">Sign in</Link>
        </p>
      </div>
    </div>
  );
}