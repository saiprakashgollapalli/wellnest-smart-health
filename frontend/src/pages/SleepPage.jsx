import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiMoon } from 'react-icons/fi';
import { sleepService } from '../services/api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const QUALITY_OPTIONS = ['POOR', 'FAIR', 'GOOD', 'EXCELLENT'];
const QUALITY_COLORS = { POOR: '#f87171', FAIR: '#fbbf24', GOOD: '#34d399', EXCELLENT: '#10b981' };
const EMPTY = { date: new Date().toISOString().split('T')[0], bedTime: '22:00', wakeTime: '06:00', sleepHours: '', sleepQuality: 'GOOD', notes: '' };

export default function SleepPage() {
  const [logs,     setLogs]    = useState([]);
  const [loading,  setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]    = useState(EMPTY);
  const [errors,   setErrors]  = useState({});
  const [editId,   setEditId]  = useState(null);
  const [saving,   setSaving]  = useState(false);

  useEffect(() => { fetch(); }, []);

  const fetch = () =>
    sleepService.getAll()
      .then(r => setLogs(r.data))
      .catch(() => toast.error('Failed to load sleep logs'))
      .finally(() => setLoading(false));

  // Auto-calculate sleep hours from bed/wake times
  const calcHours = (bed, wake) => {
    if (!bed || !wake) return '';
    const [bh, bm] = bed.split(':').map(Number);
    const [wh, wm] = wake.split(':').map(Number);
    let mins = (wh * 60 + wm) - (bh * 60 + bm);
    if (mins < 0) mins += 24 * 60;
    return (mins / 60).toFixed(1);
  };

  const handleTimeChange = (field, val) => {
    const updated = { ...form, [field]: val };
    const hrs = calcHours(
      field === 'bedTime' ? val : form.bedTime,
      field === 'wakeTime' ? val : form.wakeTime
    );
    setForm({ ...updated, sleepHours: hrs });
    setErrors(e => ({ ...e, sleepHours: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.date) e.date = 'Date is required';
    if (!form.sleepHours || form.sleepHours <= 0 || form.sleepHours > 24) e.sleepHours = 'Enter valid sleep hours (0–24)';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      const payload = { ...form, sleepHours: parseFloat(form.sleepHours) };
      if (editId) {
        await sleepService.update(editId, payload);
        toast.success('Updated!');
      } else {
        await sleepService.create(payload);
        toast.success('Sleep logged! 😴');
      }
      setShowForm(false); setForm(EMPTY); setEditId(null); setErrors({}); fetch();
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const handleEdit = (l) => {
    setForm({ date: l.date, bedTime: l.bedTime || '22:00', wakeTime: l.wakeTime || '06:00', sleepHours: l.sleepHours, sleepQuality: l.sleepQuality || 'GOOD', notes: l.notes || '' });
    setEditId(l.id); setShowForm(true); setErrors({});
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this entry?')) return;
    try { await sleepService.delete(id); toast.success('Deleted'); fetch(); }
    catch { toast.error('Failed to delete'); }
  };

  return (
    <>
      <Navbar />
      <div style={styles.page} className="page-enter">
        <div style={styles.container}>
          <div style={styles.header}>
            <div>
              <h1 style={styles.title}><FiMoon style={{ color: '#a78bfa' }} /> Sleep Tracker</h1>
              <p style={styles.sub}>Monitor your sleep patterns and quality</p>
            </div>
            <button className="btn-primary" onClick={() => { setShowForm(true); setForm(EMPTY); setEditId(null); }}>
              <FiPlus /> Log Sleep
            </button>
          </div>

          {showForm && (
            <div style={styles.formCard}>
              <h3 style={styles.formTitle}>{editId ? 'Edit Sleep Entry' : 'Log Sleep'}</h3>
              <form onSubmit={handleSubmit} style={styles.form} noValidate>
                <div style={styles.grid4}>
                  <div className="form-group">
                    <label>Date</label>
                    <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                    {errors.date && <span className="form-error">{errors.date}</span>}
                  </div>
                  <div className="form-group">
                    <label>Bed Time</label>
                    <input type="time" value={form.bedTime} onChange={e => handleTimeChange('bedTime', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Wake Time</label>
                    <input type="time" value={form.wakeTime} onChange={e => handleTimeChange('wakeTime', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Sleep Hours</label>
                    <input type="number" step="0.1" min="0" max="24" placeholder="7.5" value={form.sleepHours} onChange={e => setForm(f => ({ ...f, sleepHours: e.target.value }))} />
                    {errors.sleepHours && <span className="form-error">{errors.sleepHours}</span>}
                  </div>
                </div>
                <div className="form-group">
                  <label>Sleep Quality</label>
                  <div style={styles.qualityGrid}>
                    {QUALITY_OPTIONS.map(q => (
                      <button key={q} type="button"
                        onClick={() => setForm(f => ({ ...f, sleepQuality: q }))}
                        style={{
                          ...styles.qualityBtn,
                          borderColor: form.sleepQuality === q ? QUALITY_COLORS[q] : 'var(--border)',
                          color: form.sleepQuality === q ? QUALITY_COLORS[q] : 'var(--text-muted)',
                          background: form.sleepQuality === q ? QUALITY_COLORS[q] + '18' : 'transparent',
                        }}>
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <textarea rows="2" placeholder="How did you sleep?" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} style={{ resize: 'vertical' }} />
                </div>
                <div style={styles.formActions}>
                  <button type="button" className="btn-ghost" onClick={() => { setShowForm(false); setErrors({}); }}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : editId ? 'Update' : 'Log Sleep'}</button>
                </div>
              </form>
            </div>
          )}

          {loading ? <div style={{ textAlign: 'center', padding: '60px 0' }}><div className="spinner" /></div>
          : logs.length === 0 ? (
            <div className="empty-state"><FiMoon size={48} /><h3>No sleep logs yet</h3><p>Start tracking your sleep tonight!</p></div>
          ) : (
            <div style={styles.list}>
              {logs.map(l => (
                <div key={l.id} style={styles.logCard}>
                  <div style={styles.logHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, color: '#a78bfa' }}>{l.sleepHours}h</span>
                      <span style={styles.date}>{l.date}</span>
                    </div>
                    {l.sleepQuality && (
                      <span style={{ padding: '3px 12px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600, background: QUALITY_COLORS[l.sleepQuality] + '20', color: QUALITY_COLORS[l.sleepQuality] }}>
                        {l.sleepQuality}
                      </span>
                    )}
                  </div>
                  {(l.bedTime || l.wakeTime) && (
                    <p style={styles.times}>🛏 {l.bedTime || '–'} → ☀️ {l.wakeTime || '–'}</p>
                  )}
                  {l.notes && <p style={styles.notes}>{l.notes}</p>}
                  <div style={styles.actions}>
                    <button className="btn-ghost" style={{ padding: '6px 12px', fontSize: '0.82rem' }} onClick={() => handleEdit(l)}><FiEdit2 /> Edit</button>
                    <button className="btn-danger" onClick={() => handleDelete(l.id)}><FiTrash2 /> Delete</button>
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
  grid4: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' },
  qualityGrid: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  qualityBtn: { padding: '8px 18px', borderRadius: '99px', border: '1.5px solid', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'var(--font-display)' },
  formActions: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '4px' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  logCard: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' },
  logHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  date: { color: 'var(--text-muted)', fontSize: '0.82rem' },
  times: { color: 'var(--text-secondary)', fontSize: '0.88rem' },
  notes: { color: 'var(--text-secondary)', fontSize: '0.88rem', fontStyle: 'italic' },
  actions: { display: 'flex', gap: '8px', justifyContent: 'flex-end' },
};
