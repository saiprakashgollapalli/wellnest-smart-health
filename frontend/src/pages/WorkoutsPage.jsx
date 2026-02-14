import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiActivity } from 'react-icons/fi';
import { workoutService } from '../services/api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const WORKOUT_TYPES = ['Running', 'Cycling', 'Swimming', 'Yoga', 'Strength Training', 'HIIT', 'Pilates', 'Walking', 'Other'];
const EMPTY = { workoutType: 'Running', date: new Date().toISOString().split('T')[0], duration: '', caloriesBurned: '', notes: '' };

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState(EMPTY);
  const [errors,   setErrors]   = useState({});
  const [editId,   setEditId]   = useState(null);
  const [saving,   setSaving]   = useState(false);

  useEffect(() => { fetchWorkouts(); }, []);

  const fetchWorkouts = () =>
    workoutService.getAll()
      .then(r => setWorkouts(r.data))
      .catch(() => toast.error('Failed to load workouts'))
      .finally(() => setLoading(false));

  const validate = () => {
    const e = {};
    if (!form.workoutType) e.workoutType = 'Required';
    if (!form.date)        e.date = 'Required';
    if (!form.duration || form.duration < 1) e.duration = 'Must be ≥ 1 min';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      const payload = { ...form, duration: parseInt(form.duration), caloriesBurned: parseInt(form.caloriesBurned) || 0 };
      if (editId) {
        await workoutService.update(editId, payload);
        toast.success('Workout updated!');
      } else {
        await workoutService.create(payload);
        toast.success('Workout logged! 💪');
      }
      setShowForm(false); setForm(EMPTY); setEditId(null); setErrors({});
      fetchWorkouts();
    } catch { toast.error('Failed to save workout'); }
    finally { setSaving(false); }
  };

  const handleEdit = (w) => {
    setForm({ workoutType: w.workoutType, date: w.date, duration: w.duration, caloriesBurned: w.caloriesBurned || '', notes: w.notes || '' });
    setEditId(w.id); setShowForm(true); setErrors({});
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this workout?')) return;
    try { await workoutService.delete(id); toast.success('Deleted'); fetchWorkouts(); }
    catch { toast.error('Failed to delete'); }
  };

  return (
    <>
      <Navbar />
      <div style={styles.page} className="page-enter">
        <div style={styles.container}>
          <div style={styles.header}>
            <div>
              <h1 style={styles.title}><FiActivity style={{ color: 'var(--emerald)' }} /> Workout Log</h1>
              <p style={styles.sub}>Track your exercise sessions</p>
            </div>
            <button className="btn-primary" onClick={() => { setShowForm(true); setForm(EMPTY); setEditId(null); }}>
              <FiPlus /> Log Workout
            </button>
          </div>

          {/* Form */}
          {showForm && (
            <div style={styles.formCard}>
              <h3 style={styles.formTitle}>{editId ? 'Edit Workout' : 'New Workout'}</h3>
              <form onSubmit={handleSubmit} style={styles.form} noValidate>
                <div style={styles.grid2}>
                  <div className="form-group">
                    <label>Workout Type</label>
                    <select value={form.workoutType} onChange={e => setForm(f => ({ ...f, workoutType: e.target.value }))}>
                      {WORKOUT_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                    {errors.workoutType && <span className="form-error">{errors.workoutType}</span>}
                  </div>
                  <div className="form-group">
                    <label>Date</label>
                    <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                    {errors.date && <span className="form-error">{errors.date}</span>}
                  </div>
                  <div className="form-group">
                    <label>Duration (minutes)</label>
                    <input type="number" placeholder="30" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} min="1" />
                    {errors.duration && <span className="form-error">{errors.duration}</span>}
                  </div>
                  <div className="form-group">
                    <label>Calories Burned</label>
                    <input type="number" placeholder="250" value={form.caloriesBurned} onChange={e => setForm(f => ({ ...f, caloriesBurned: e.target.value }))} min="0" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Notes (optional)</label>
                  <textarea rows="2" placeholder="Any notes about this session…" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} style={{ resize: 'vertical' }} />
                </div>
                <div style={styles.formActions}>
                  <button type="button" className="btn-ghost" onClick={() => { setShowForm(false); setErrors({}); }}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : editId ? 'Update' : 'Log Workout'}</button>
                </div>
              </form>
            </div>
          )}

          {/* List */}
          {loading ? <div style={{ textAlign: 'center', padding: '60px 0' }}><div className="spinner" /></div>
          : workouts.length === 0 ? (
            <div className="empty-state">
              <FiActivity size={48} />
              <h3>No workouts logged yet</h3>
              <p>Start tracking your fitness journey!</p>
            </div>
          ) : (
            <div style={styles.list}>
              {workouts.map(w => (
                <div key={w.id} style={styles.workoutCard}>
                  <div style={styles.workoutType}>
                    <span className="badge badge-emerald">{w.workoutType}</span>
                    <span style={styles.workoutDate}>{w.date}</span>
                  </div>
                  <div style={styles.workoutStats}>
                    <div style={styles.stat}><span style={styles.statVal}>{w.duration}</span><span style={styles.statLbl}>min</span></div>
                    <div style={styles.divider} />
                    <div style={styles.stat}><span style={styles.statVal}>{w.caloriesBurned || 0}</span><span style={styles.statLbl}>kcal</span></div>
                  </div>
                  {w.notes && <p style={styles.notes}>{w.notes}</p>}
                  <div style={styles.actions}>
                    <button className="btn-ghost" style={{ padding: '6px 12px', fontSize: '0.82rem' }} onClick={() => handleEdit(w)}><FiEdit2 /> Edit</button>
                    <button className="btn-danger" onClick={() => handleDelete(w.id)}><FiTrash2 /> Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const styles = {
  page: { minHeight: 'calc(100vh - 64px)', padding: '32px 24px' },
  container: { maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' },
  title: { fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' },
  sub: { color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' },
  formCard: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '24px' },
  formTitle: { fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: '20px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  formActions: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '4px' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  workoutCard: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' },
  workoutType: { display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'space-between' },
  workoutDate: { color: 'var(--text-muted)', fontSize: '0.85rem' },
  workoutStats: { display: 'flex', alignItems: 'center', gap: '20px' },
  stat: { display: 'flex', alignItems: 'baseline', gap: '4px' },
  statVal: { fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--emerald)' },
  statLbl: { fontSize: '0.78rem', color: 'var(--text-muted)' },
  divider: { width: '1px', height: '28px', background: 'var(--border)' },
  notes: { color: 'var(--text-secondary)', fontSize: '0.88rem', fontStyle: 'italic' },
  actions: { display: 'flex', gap: '8px', justifyContent: 'flex-end' },
};