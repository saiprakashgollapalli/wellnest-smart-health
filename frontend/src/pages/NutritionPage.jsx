import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiCoffee } from 'react-icons/fi';
import { nutritionService } from '../services/api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Pre-Workout', 'Post-Workout'];
const EMPTY = { mealType: 'Breakfast', foodItems: '', caloriesConsumed: '', proteinGrams: '', carbsGrams: '', fatGrams: '', date: new Date().toISOString().split('T')[0] };

export default function NutritionPage() {
  const [logs,     setLogs]    = useState([]);
  const [loading,  setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]    = useState(EMPTY);
  const [errors,   setErrors]  = useState({});
  const [editId,   setEditId]  = useState(null);
  const [saving,   setSaving]  = useState(false);

  useEffect(() => { fetch(); }, []);

  const fetch = () =>
    nutritionService.getAll()
      .then(r => setLogs(r.data))
      .catch(() => toast.error('Failed to load nutrition logs'))
      .finally(() => setLoading(false));

  const validate = () => {
    const e = {};
    if (!form.foodItems.trim()) e.foodItems = 'Food items are required';
    if (!form.date) e.date = 'Date is required';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        caloriesConsumed: parseInt(form.caloriesConsumed) || 0,
        proteinGrams: parseFloat(form.proteinGrams) || 0,
        carbsGrams: parseFloat(form.carbsGrams) || 0,
        fatGrams: parseFloat(form.fatGrams) || 0,
      };
      if (editId) {
        await nutritionService.update(editId, payload);
        toast.success('Updated!');
      } else {
        await nutritionService.create(payload);
        toast.success('Meal logged! 🥗');
      }
      setShowForm(false); setForm(EMPTY); setEditId(null); setErrors({}); fetch();
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const handleEdit = (l) => {
    setForm({ mealType: l.mealType, foodItems: l.foodItems, caloriesConsumed: l.caloriesConsumed || '', proteinGrams: l.proteinGrams || '', carbsGrams: l.carbsGrams || '', fatGrams: l.fatGrams || '', date: l.date });
    setEditId(l.id); setShowForm(true); setErrors({});
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this entry?')) return;
    try { await nutritionService.delete(id); toast.success('Deleted'); fetch(); }
    catch { toast.error('Failed to delete'); }
  };

  const MACRO_COLORS = { protein: '#38bdf8', carbs: '#fb923c', fat: '#f472b6' };

  return (
    <>
      <Navbar />
      <div style={styles.page} className="page-enter">
        <div style={styles.container}>
          <div style={styles.header}>
            <div>
              <h1 style={styles.title}><FiCoffee style={{ color: 'var(--emerald)' }} /> Nutrition Log</h1>
              <p style={styles.sub}>Track your daily meals and macros</p>
            </div>
            <button className="btn-primary" onClick={() => { setShowForm(true); setForm(EMPTY); setEditId(null); }}>
              <FiPlus /> Log Meal
            </button>
          </div>

          {showForm && (
            <div style={styles.formCard}>
              <h3 style={styles.formTitle}>{editId ? 'Edit Meal' : 'Log Meal'}</h3>
              <form onSubmit={handleSubmit} style={styles.form} noValidate>
                <div style={styles.grid2}>
                  <div className="form-group">
                    <label>Meal Type</label>
                    <select value={form.mealType} onChange={e => setForm(f => ({ ...f, mealType: e.target.value }))}>
                      {MEAL_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Date</label>
                    <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                    {errors.date && <span className="form-error">{errors.date}</span>}
                  </div>
                </div>
                <div className="form-group">
                  <label>Food Items</label>
                  <textarea rows="2" placeholder="e.g., Oatmeal with banana, 2 eggs, orange juice" value={form.foodItems} onChange={e => setForm(f => ({ ...f, foodItems: e.target.value }))} style={{ resize: 'vertical' }} />
                  {errors.foodItems && <span className="form-error">{errors.foodItems}</span>}
                </div>
                <div style={styles.grid4}>
                  <div className="form-group">
                    <label>Calories (kcal)</label>
                    <input type="number" placeholder="450" value={form.caloriesConsumed} onChange={e => setForm(f => ({ ...f, caloriesConsumed: e.target.value }))} min="0" />
                  </div>
                  <div className="form-group">
                    <label>Protein (g)</label>
                    <input type="number" placeholder="25" value={form.proteinGrams} onChange={e => setForm(f => ({ ...f, proteinGrams: e.target.value }))} step="0.1" min="0" />
                  </div>
                  <div className="form-group">
                    <label>Carbs (g)</label>
                    <input type="number" placeholder="60" value={form.carbsGrams} onChange={e => setForm(f => ({ ...f, carbsGrams: e.target.value }))} step="0.1" min="0" />
                  </div>
                  <div className="form-group">
                    <label>Fat (g)</label>
                    <input type="number" placeholder="15" value={form.fatGrams} onChange={e => setForm(f => ({ ...f, fatGrams: e.target.value }))} step="0.1" min="0" />
                  </div>
                </div>
                <div style={styles.formActions}>
                  <button type="button" className="btn-ghost" onClick={() => { setShowForm(false); setErrors({}); }}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : editId ? 'Update' : 'Log Meal'}</button>
                </div>
              </form>
            </div>
          )}

          {loading ? <div style={{ textAlign: 'center', padding: '60px 0' }}><div className="spinner" /></div>
          : logs.length === 0 ? (
            <div className="empty-state"><FiCoffee size={48} /><h3>No meals logged</h3><p>Start tracking your nutrition today!</p></div>
          ) : (
            <div style={styles.list}>
              {logs.map(l => (
                <div key={l.id} style={styles.logCard}>
                  <div style={styles.logHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="badge badge-blue">{l.mealType}</span>
                      <span style={styles.date}>{l.date}</span>
                    </div>
                    <span style={styles.calories}>{l.caloriesConsumed || 0} kcal</span>
                  </div>
                  <p style={styles.foodItems}>{l.foodItems}</p>
                  {(l.proteinGrams || l.carbsGrams || l.fatGrams) && (
                    <div style={styles.macros}>
                      {[['Protein', l.proteinGrams, MACRO_COLORS.protein], ['Carbs', l.carbsGrams, MACRO_COLORS.carbs], ['Fat', l.fatGrams, MACRO_COLORS.fat]].map(([name, val, color]) => (
                        <span key={name} style={{ ...styles.macro, color, background: color + '18' }}>
                          {name}: {val || 0}g
                        </span>
                      ))}
                    </div>
                  )}
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
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  grid4: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' },
  formActions: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '4px' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  logCard: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' },
  logHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  date: { color: 'var(--text-muted)', fontSize: '0.82rem' },
  calories: { fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--emerald)' },
  foodItems: { color: 'var(--text-secondary)', fontSize: '0.9rem' },
  macros: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  macro: { padding: '3px 10px', borderRadius: '99px', fontSize: '0.78rem', fontWeight: 600 },
  actions: { display: 'flex', gap: '8px', justifyContent: 'flex-end' },
};