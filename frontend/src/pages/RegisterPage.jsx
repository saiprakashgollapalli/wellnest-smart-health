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
  const [showConfirmPwd, setShowConfirmPwd] = useState(false); // ⭐ added
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
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

    setErrors(prev => ({
      ...prev,
      [e.target.name]: ''
    }));
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

      navigate("/verify-otp", {
  state: { email: form.email, mode: "register" }
});


    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const strengthColors = [
    'var(--red)',
    'var(--red)',
    'var(--yellow)',
    'var(--yellow)',
    'var(--emerald)'
  ];

  const strengthLabels = ['', 'Weak', 'Weak', 'Fair', 'Good', 'Strong'];

  const strengthColor =
    pwdStrength === 0
      ? 'var(--text-muted)'
      : strengthColors[pwdStrength - 1];

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <Link to="/" style={styles.logo}>
            <FiActivity style={{ color: 'var(--emerald)' }} />
            WellNest
          </Link>

          <h2 style={styles.title}>Create your account</h2>
          <p style={styles.subtitle}>
            Join thousands improving their health every day
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form} noValidate>

          {/* Name + Role */}
          <div style={styles.grid2}>
            <div>
              <label>Full Name</label>
              <div style={styles.inputWrap}>
                <FiUser style={styles.icon} />
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  style={{ paddingLeft: '44px' }}
                />
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

          {/* Email */}
          <div>
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
          <div>
  <label>Gender</label>
  <select name="gender" value={form.gender} onChange={handleChange}>
    <option value="MALE">Male</option>
    <option value="FEMALE">Female</option>
    <option value="OTHER">Other</option>
  </select>
</div>


          {/* Password */}
          <div>
            <label>Password</label>
            <div style={styles.inputWrap}>
              <FiLock style={styles.icon} />
              <input
                type={showPwd ? 'text' : 'password'}
                name="password"
                placeholder="Create a strong password"
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

            {form.password && (
              <div style={{ marginTop: '10px' }}>
                <div style={styles.strengthBar}>
                  {[1,2,3,4,5].map(i => (
                    <div
                      key={i}
                      style={{
                        ...styles.strengthSegment,
                        background: i <= pwdStrength
                          ? strengthColor
                          : 'var(--border)'
                      }}
                    />
                  ))}
                </div>

                <span style={{ fontSize:'0.78rem', color: strengthColor }}>
                  {strengthLabels[pwdStrength]}
                </span>

                <ul style={styles.checkList}>
                  {pwdChecks.map(c => (
                    <li
                      key={c.label}
                      style={{
                        ...styles.checkItem,
                        color: c.test(form.password)
                          ? 'var(--emerald)'
                          : 'var(--text-muted)'
                      }}
                    >
                      {c.test(form.password) ? <FiCheck /> : <FiX />}
                      {c.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {errors.password &&
              <span className="form-error">{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div>
            <label>Confirm Password</label>
            <div style={styles.inputWrap}>
              <FiLock style={styles.icon} />
              <input
                type={showConfirmPwd ? 'text' : 'password'}
                name="confirmPwd"
                placeholder="Repeat your password"
                value={form.confirmPwd}
                onChange={handleChange}
                style={{ paddingLeft: '44px', paddingRight: '44px' }}
              />
              <button
                type="button"
                style={styles.eyeBtn}
                onClick={() => setShowConfirmPwd(prev => !prev)}
              >
                {showConfirmPwd ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.confirmPwd &&
              <span className="form-error">{errors.confirmPwd}</span>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              width:'100%',
              marginTop:'12px',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--emerald)' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page:{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'40px 24px'},
  container:{width:'100%',maxWidth:'520px'},
  header:{marginBottom:'32px'},
  logo:{display:'inline-flex',alignItems:'center',gap:'8px',fontWeight:700,marginBottom:'24px'},
  title:{fontSize:'1.8rem',fontWeight:700,marginBottom:'6px'},
  subtitle:{color:'var(--text-secondary)',fontSize:'0.9rem'},
  form:{display:'flex',flexDirection:'column',gap:'18px',padding:'28px',background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:'12px'},
  grid2:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'},
  inputWrap:{position:'relative'},
  icon:{position:'absolute',left:'14px',top:'50%',transform:'translateY(-50%)',color:'var(--text-muted)'},
  eyeBtn:{
    position:'absolute',
    right:'12px',
    top:'50%',
    transform:'translateY(-50%)',
    background:'transparent',
    border:'none',
    cursor:'pointer',
    color:'white',
    display:'flex',
    alignItems:'center'
  },
  strengthBar:{display:'flex',gap:'4px',marginBottom:'6px'},
  strengthSegment:{height:'4px',flex:1,borderRadius:'2px'},
  checkList:{listStyle:'none',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4px 16px',marginTop:'8px'},
  checkItem:{display:'flex',alignItems:'center',gap:'6px',fontSize:'0.78rem'},
  footer:{marginTop:'20px',textAlign:'center',fontSize:'0.9rem'}
};
