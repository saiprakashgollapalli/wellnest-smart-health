import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTarget, FiTrendingUp, FiHeart } from 'react-icons/fi';
import { profileService } from '../services/api';
import toast from 'react-hot-toast';

const GOALS = [
  { value: 'WEIGHT_LOSS', icon: <FiTrendingUp />, label: 'Weight Loss', desc: 'Burn fat, get leaner' },
  { value: 'MUSCLE_GAIN', icon: <FiTarget />, label: 'Muscle Gain', desc: 'Build strength & size' },
  { value: 'GENERAL_HEALTH', icon: <FiHeart />, label: 'General Health', desc: 'Stay active & healthy' },
];

export default function ProfileSetup() {

  const [form, setForm] = useState({
    age: '',
    height: '',
    weight: '',
    fitnessGoal: 'GENERAL_HEALTH'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    profileService.getMe()
      .then(res => {
        if (res.data) {
          setForm({
            age: res.data.age || '',
            height: res.data.height || '',
            weight: res.data.weight || '',
            fitnessGoal: res.data.fitnessGoal || 'GENERAL_HEALTH'
          });
          setIsEdit(true);
        }
      })
      .catch(() => {});
  }, []);

  const validate = () => {

    const errs = {};

    if (!form.age || form.age < 1 || form.age > 120)
      errs.age = 'Enter a valid age (1–120)';

    if (!form.height || form.height < 50 || form.height > 300)
      errs.height = 'Enter height in cm (50–300)';

    if (!form.weight || form.weight < 20 || form.weight > 500)
      errs.weight = 'Enter weight in kg (20–500)';

    return errs;
  };

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: '' }));
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

  const bmiPreview = form.height && form.weight
    ? (parseFloat(form.weight) / ((parseFloat(form.height) / 100) ** 2)).toFixed(1)
    : null;

  const bmiCategory = bmiPreview
    ? bmiPreview < 18.5 ? 'Underweight'
      : bmiPreview < 25 ? 'Normal'
      : bmiPreview < 30 ? 'Overweight'
      : 'Obese'
    : null;

  return (

    <div className="min-h-[calc(100vh-64px)] px-[24px] py-[48px] page-enter">

      <div className="max-w-[640px] mx-auto">

        {/* HEADER */}

        <div className="mb-[40px]">

          <span className="text-[0.78rem] font-semibold text-[var(--emerald)] uppercase tracking-[0.1em]">
            Step 1 of 1
          </span>

          <h1 className="font-display text-[2rem] font-bold mt-[8px] mb-[8px]">
            Set Up Your Fitness Profile
          </h1>

          <p className="text-[var(--text-secondary)]">
            Help us personalize your experience with some basic information
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-[32px]"
          noValidate
        >

          {/* MEASUREMENTS */}

          <div className="p-[24px] bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-md)]">

            <h3 className="font-display text-[0.85rem] font-semibold text-[var(--text-secondary)] uppercase tracking-[0.05em] mb-[20px]">
              Your Measurements
            </h3>

            <div className="grid grid-cols-3 gap-[16px]">

              <div className="form-group">

                <label>Age (years)</label>

                <input
                  type="number"
                  name="age"
                  placeholder="25"
                  value={form.age}
                  onChange={handleChange}
                />

                {errors.age && (
                  <span className="form-error">{errors.age}</span>
                )}

              </div>

              <div className="form-group">

                <label>Height (cm)</label>

                <input
                  type="number"
                  name="height"
                  placeholder="170"
                  value={form.height}
                  onChange={handleChange}
                  step="0.1"
                />

                {errors.height && (
                  <span className="form-error">{errors.height}</span>
                )}

              </div>

              <div className="form-group">

                <label>Weight (kg)</label>

                <input
                  type="number"
                  name="weight"
                  placeholder="70"
                  value={form.weight}
                  onChange={handleChange}
                  step="0.1"
                />

                {errors.weight && (
                  <span className="form-error">{errors.weight}</span>
                )}

              </div>

            </div>

            {/* BMI PREVIEW */}

            {bmiPreview && (

              <div className="mt-[20px] p-[16px] bg-[var(--bg-elevated)] rounded-[var(--radius-sm)] flex items-center justify-between">

                <div>

                  <span className="block text-[0.75rem] text-[var(--text-muted)] mb-[4px]">
                    Your BMI
                  </span>

                  <span className="font-display text-[1.6rem] font-bold text-[var(--emerald)]">
                    {bmiPreview}
                  </span>

                </div>

                <span className="badge badge-emerald">
                  {bmiCategory}
                </span>

              </div>

            )}

          </div>

          {/* FITNESS GOAL */}

          <div className="p-[24px] bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-md)]">

            <h3 className="font-display text-[0.85rem] font-semibold text-[var(--text-secondary)] uppercase tracking-[0.05em] mb-[20px]">
              Your Fitness Goal
            </h3>

            <div className="grid grid-cols-3 gap-[12px]">

              {GOALS.map(g => (

                <button
                  key={g.value}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, fitnessGoal: g.value }))}
                  className={`flex flex-col items-center gap-[8px] py-[20px] px-[12px] border-2 rounded-[var(--radius-md)] transition
                    ${form.fitnessGoal === g.value
                      ? 'border-[var(--emerald)] bg-[var(--emerald-glow)]'
                      : 'border-[var(--border)] bg-[var(--bg-elevated)]'}
                  `}
                >

                  <span className="text-[1.5rem] text-[var(--emerald)]">
                    {g.icon}
                  </span>

                  <span className="font-display font-semibold text-[0.9rem] text-[var(--text-primary)]">
                    {g.label}
                  </span>

                  <span className="text-[0.75rem] text-[var(--text-muted)] text-center">
                    {g.desc}
                  </span>

                </button>

              ))}

            </div>

          </div>

          <button
            type="submit"
            className="btn-primary self-end"
            disabled={loading}
          >
            {loading ? "Saving…" : "Save Profile"}
          </button>

        </form>

      </div>

    </div>

  );
}