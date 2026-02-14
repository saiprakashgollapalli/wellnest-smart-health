import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTarget, FiTrendingUp, FiHeart, FiArrowRight } from 'react-icons/fi';
import { profileService } from '../services/api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const GOALS = [
  { value: 'WEIGHT_LOSS',    icon: <FiTrendingUp />, label: 'Weight Loss',     desc: 'Burn fat, get leaner' },
  { value: 'MUSCLE_GAIN',    icon: <FiTarget />,     label: 'Muscle Gain',     desc: 'Build strength & size' },
  { value: 'GENERAL_HEALTH', icon: <FiHeart />,      label: 'General Health',  desc: 'Stay active & healthy' },
];

export default function ProfileSetup() {
  const [form, setForm]     = useState({ age: '', height: '', weight: '', fitnessGoal: 'GENERAL_HEALTH' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.age || form.age < 1 || form.age > 120) errs.age = 'Enter a valid age (1–120)';
    if (!form.height || form.height < 50 || form.height > 300) errs.height = 'Enter height in cm (50–300)';
    if (!form.weight || form.weight < 20 || form.weight > 500) errs.weight = 'Enter weight in kg (20–500)';
    return errs;
  };

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await profileService.save({
        age: parseInt(form.age),
        height: parseFloat(form.height),
        weight: parseFloat(form.weight),
        fitnessGoal: form.fitnessGoal,
      });
      toast.success('Profile saved! Let\'s get started 🚀');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  // Compute BMI preview
  const bmiPreview = form.height && form.weight
    ? (parseFloat(form.weight) / ((parseFloat(form.height) / 100) ** 2)).toFixed(1)
    : null;
  const bmiCategory = bmiPreview
    ? bmiPreview < 18.5 ? 'Underweight' : bmiPreview < 25 ? 'Normal' : bmiPreview < 30 ? 'Overweight' : 'Obese'
    : null;

  return (
    <>
      <Navbar />
      <div style={styles.page} className="page-enter">
        <div style={styles.container}>
          <div style={styles.header}>
            <span style={styles.step}>Step 1 of 1</span>
            <h1 style={styles.title}>Set Up Your Fitness Profile</h1>
            <p style={styles.subtitle}>Help us personalize your experience with some basic information</p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form} noValidate>
            {/* Measurements */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Your Measurements</h3>
              <div style={styles.grid3}>
                <div className="form-group">
                  <label>Age (years)</label>
                  <input type="number" name="age" placeholder="25" value={form.age} onChange={handleChange} min="1" max="120" />
                  {errors.age && <span className="form-error">{errors.age}</span>}
                </div>
                <div className="form-group">
                  <label>Height (cm)</label>
                  <input type="number" name="height" placeholder="170" value={form.height} onChange={handleChange} step="0.1" />
                  {errors.height && <span className="form-error">{errors.height}</span>}
                </div>
                <div className="form-group">
                  <label>Weight (kg)</label>
                  <input type="number" name="weight" placeholder="70" value={form.weight} onChange={handleChange} step="0.1" />
                  {errors.weight && <span className="form-error">{errors.weight}</span>}
                </div>
              </div>

              {/* BMI Preview */}
              {bmiPreview && (
                <div style={styles.bmiCard}>
                  <div>
                    <span style={styles.bmiLabel}>Your BMI</span>
                    <span style={styles.bmiValue}>{bmiPreview}</span>
                  </div>
                  <span className="badge badge-emerald">{bmiCategory}</span>
                </div>
              )}
            </div>

            {/* Fitness Goal */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Your Fitness Goal</h3>
              <div style={styles.goalGrid}>
                {GOALS.map(g => (
                  <button
                    key={g.value}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, fitnessGoal: g.value }))}
                    style={{
                      ...styles.goalCard,
                      ...(form.fitnessGoal === g.value ? styles.goalCardActive : {}),
                    }}
                  >
                    <span style={styles.goalIcon}>{g.icon}</span>
                    <span style={styles.goalLabel}>{g.label}</span>
                    <span style={styles.goalDesc}>{g.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ alignSelf: 'flex-end', gap: '10px' }}>
              {loading ? 'Saving…' : <><span>Go to Dashboard</span><FiArrowRight /></>}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

const styles = {
  page: { minHeight: 'calc(100vh - 64px)', padding: '48px 24px' },
  container: { maxWidth: '640px', margin: '0 auto' },
  header: { marginBottom: '40px' },
  step: { fontSize: '0.78rem', fontWeight: 600, color: 'var(--emerald)', textTransform: 'uppercase', letterSpacing: '0.1em' },
  title: { fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, margin: '8px 0' },
  subtitle: { color: 'var(--text-secondary)' },
  form: { display: 'flex', flexDirection: 'column', gap: '32px' },
  section: { padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' },
  sectionTitle: { fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, marginBottom: '20px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.85rem' },
  grid3: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  bmiCard: { marginTop: '20px', padding: '16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  bmiLabel: { display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' },
  bmiValue: { fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--emerald)' },
  goalGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' },
  goalCard: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '20px 12px', background: 'var(--bg-elevated)', border: '2px solid var(--border)', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'border-color 0.2s, background 0.2s' },
  goalCardActive: { borderColor: 'var(--emerald)', background: 'var(--emerald-glow)' },
  goalIcon: { fontSize: '1.5rem', color: 'var(--emerald)' },
  goalLabel: { fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' },
  goalDesc: { fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' },
};