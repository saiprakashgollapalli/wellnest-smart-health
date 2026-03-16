import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiActivity } from 'react-icons/fi';
import { workoutService } from '../services/api';
import toast from 'react-hot-toast';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";

const EMPTY = {
  workoutType: 'Running',
  date: new Date().toISOString().split('T')[0],
  duration: '',
  caloriesBurned: '',
  notes: ''
};

export default function WorkoutsPage() {

  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [showAnalytics,setShowAnalytics] = useState(false);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = () =>
    workoutService.getAll()
      .then(r => setWorkouts(r.data))
      .catch(() => toast.error('Failed to load workouts'))
      .finally(() => setLoading(false));

  const validate = () => {
    const e = {};

    if (!form.workoutType) e.workoutType = 'Required';
    if (!form.date) e.date = 'Required';
    if (!form.duration || form.duration < 1)
      e.duration = 'Must be ≥ 1 min';

    return e;
  };

  const handleSubmit = async (ev) => {

    ev.preventDefault();

    const e = validate();

    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    setSaving(true);

    try {

      const payload = {
        ...form,
        duration: parseInt(form.duration),
        caloriesBurned: parseInt(form.caloriesBurned) || 0
      };

      if (editId) {

        await workoutService.update(editId, payload);
        toast.success('Workout updated!');

      } else {

        await workoutService.create(payload);
        toast.success('Workout logged! 💪');

      }

      setShowForm(false);
      setForm(EMPTY);
      setEditId(null);
      setErrors({});

      fetchWorkouts();

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        'Failed to save workout'
      );

    } finally {

      setSaving(false);

    }

  };

  const handleEdit = (w) => {

    setForm({
      workoutType: w.workoutType,
      date: w.date,
      duration: w.duration,
      caloriesBurned: w.caloriesBurned || '',
      notes: w.notes || ''
    });

    setEditId(w.id);
    setShowForm(true);

  };

  const handleDelete = async (id) => {

    if (!confirm('Delete this workout?')) return;

    try {

      await workoutService.delete(id);
      toast.success('Deleted');

      fetchWorkouts();

    } catch {

      toast.error('Failed to delete');

    }

  };

  // ---------- TODAY SUMMARY ----------

  const today = new Date().toISOString().split('T')[0];

  const todayWorkouts = workouts.filter(
    w => w.date === today
  );

  const todayMinutes = todayWorkouts.reduce(
    (sum, w) => sum + w.duration,
    0
  );

  const todayCalories = todayWorkouts.reduce(
    (sum, w) => sum + (w.caloriesBurned || 0),
    0
  );

  // ---------- WEEKLY SUMMARY ----------

  const now = new Date();

  const weekAgo = new Date();
  weekAgo.setDate(now.getDate() - 7);

  const weeklyWorkouts = workouts.filter(w => {

    const d = new Date(w.date);

    return d >= weekAgo && d <= now;

  });

  const weeklyMinutes = weeklyWorkouts.reduce(
    (sum, w) => sum + w.duration,
    0
  );

  const weeklyCalories = weeklyWorkouts.reduce(
    (sum, w) => sum + (w.caloriesBurned || 0),
    0
  );

  /* ---------- ANALYTICS DATA ---------- */

  const weeklyTrend = weeklyWorkouts.map(w => ({
    date: w.date,
    duration: w.duration
  }));

  const calorieTrend = workouts.map(w => ({
    date: w.date,
    calories: w.caloriesBurned || 0
  }));

  const typeCount = {};

  workouts.forEach(w => {
    typeCount[w.workoutType] =
      (typeCount[w.workoutType] || 0) + 1;
  });

  const typeData = Object.keys(typeCount).map(k => ({
    name: k,
    value: typeCount[k]
  }));

  const COLORS = [
    "#10b981",
    "#6366f1",
    "#f59e0b",
    "#06b6d4",
    "#ef4444"
  ];

  return (

    <div className="px-[24px] py-[32px]">

      <div className="max-w-[900px] mx-auto flex flex-col gap-[24px]">

        {/* HEADER */}

        <div className="flex justify-between items-center">

          <div>

            <h1 className="text-[1.8rem] flex items-center gap-[10px]">

              <FiActivity className="text-[var(--emerald)]" />

              Workout Log

            </h1>

            <p className="text-[var(--text-secondary)]">

              Track your training sessions & progress

            </p>

          </div>

          <div className="flex gap-[10px]">

            <button
              className="btn-ghost"
              onClick={()=>setShowAnalytics(prev=>!prev)}
            >
              📊 View Analytics
            </button>

            <button
              className="btn-primary"
              onClick={() => {

                setShowForm(true);
                setForm(EMPTY);
                setEditId(null);

              }}
            >
              <FiPlus /> Log Workout
            </button>

          </div>

        </div>

        {/* SUMMARY */}

        <div className="grid grid-cols-2 gap-[16px]">

          <div className="bg-[var(--bg-card)] p-[20px] rounded-[12px] border border-[var(--border)]">

            <h4>Today’s Activity</h4>

            <p className="text-[1.6rem] font-bold text-[var(--emerald)]">

              {todayMinutes} min

            </p>

            <p className="text-[0.85rem] text-[var(--text-muted)]">

              {todayCalories} kcal burned

            </p>

          </div>

          <div className="bg-[var(--bg-card)] p-[20px] rounded-[12px] border border-[var(--border)]">

            <h4>Last 7 Days</h4>

            <p className="text-[1.6rem] font-bold text-[var(--emerald)]">

              {weeklyMinutes} min

            </p>

            <p className="text-[0.85rem] text-[var(--text-muted)]">

              {weeklyCalories} kcal burned

            </p>

          </div>

        </div>

        {/* ANALYTICS */}

        {showAnalytics && (

          <div className="bg-[var(--bg-card)] p-[24px] rounded-[12px] border border-[var(--border)] flex flex-col gap-[24px]">

            <h3 className="font-semibold text-[1.2rem]">
              Workout Analytics
            </h3>

            <div className="grid md:grid-cols-2 gap-[24px]">

              {/* WEEKLY ACTIVITY */}

              <div className="h-[250px]">

                <p className="text-[var(--text-muted)] mb-[6px]">
                  Weekly Workout Duration
                </p>

                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyTrend}>
                    <XAxis dataKey="date"/>
                    <YAxis/>
                    <Tooltip/>
                    <Bar dataKey="duration" fill="#10b981"/>
                  </BarChart>
                </ResponsiveContainer>

              </div>

              {/* WORKOUT TYPE */}

              <div className="h-[250px]">

                <p className="text-[var(--text-muted)] mb-[6px]">
                  Workout Type Distribution
                </p>

                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={80}
                      label
                    >
                      {typeData.map((entry,index)=>(
                        <Cell key={index} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip/>
                  </PieChart>
                </ResponsiveContainer>

              </div>

            </div>

            {/* CALORIE TREND */}

            <div className="h-[250px]">

              <p className="text-[var(--text-muted)] mb-[6px]">
                Calories Burn Trend
              </p>

              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={calorieTrend}>
                  <XAxis dataKey="date"/>
                  <YAxis/>
                  <Tooltip/>
                  <Line
                    type="monotone"
                    dataKey="calories"
                    stroke="#6366f1"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>

            </div>

          </div>

        )}

        {/* FORM */}

        {showForm && (

          <div className="bg-[var(--bg-card)] p-[24px] rounded-[12px] border border-[var(--border)]">

            <h3 className="mb-[10px]">

              {editId ? 'Edit Workout' : 'New Workout'}

            </h3>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-[16px]"
            >

              <div className="grid grid-cols-2 gap-[16px]">

                <select
                  value={form.workoutType}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      workoutType: e.target.value
                    })
                  }
                >

                  <option value="">Select Workout Type</option>
                  <option value="RUNNING">Running</option>
                  <option value="CYCLING">Cycling</option>
                  <option value="GYM">Gym</option>
                  <option value="YOGA">Yoga</option>
                  <option value="SWIMMING">Swimming</option>

                </select>

                <input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm(f => ({
                      ...f,
                      date: e.target.value
                    }))
                  }
                />

              </div>

              <div className="grid grid-cols-2 gap-[16px]">

                <input
                  type="number"
                  placeholder="Duration (min)"
                  value={form.duration}
                  onChange={(e) =>
                    setForm(f => ({
                      ...f,
                      duration: e.target.value
                    }))
                  }
                />

                <input
                  type="number"
                  placeholder="Calories"
                  value={form.caloriesBurned}
                  onChange={(e) =>
                    setForm(f => ({
                      ...f,
                      caloriesBurned: e.target.value
                    }))
                  }
                />

              </div>

              <textarea
                placeholder="Notes"
                value={form.notes}
                onChange={(e) =>
                  setForm(f => ({
                    ...f,
                    notes: e.target.value
                  }))
                }
              />

              <div className="flex justify-end gap-[12px]">

                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-primary"
                >
                  {editId ? 'Update' : 'Log'}
                </button>

              </div>

            </form>

          </div>

        )}

        {/* LIST */}

        {loading ? (

          <div className="text-center py-[60px]">
            <div className="spinner" />
          </div>

        ) : workouts.length === 0 ? (

          <div className="text-center py-[60px] text-[var(--text-muted)]">

            <FiActivity size={48} />

            <h3>No workouts logged yet</h3>

            <p>Start building your fitness streak 💪</p>

          </div>

        ) : (

          <div className="flex flex-col gap-[12px]">

            {workouts.map(w => (

              <div
                key={w.id}
                className="bg-[var(--bg-card)] p-[18px] rounded-[12px] border border-[var(--border)] flex flex-col gap-[10px]"
              >

                <div>

                  <span className="badge badge-emerald">
                    {w.workoutType}
                  </span>

                  <span className="ml-[10px] text-[var(--text-muted)]">
                    {w.date}
                  </span>

                </div>

                <div>

                  <strong>{w.duration} min</strong> ·{' '}
                  {w.caloriesBurned || 0} kcal

                </div>

                {w.notes && (
                  <p className="text-[var(--text-secondary)]">
                    {w.notes}
                  </p>
                )}

                <div className="flex gap-[10px] justify-end">

                  <button
                    className="btn-ghost"
                    onClick={() => handleEdit(w)}
                  >
                    <FiEdit2 /> Edit
                  </button>

                  <button
                    className="btn-danger"
                    onClick={() => handleDelete(w.id)}
                  >
                    <FiTrash2 /> Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  );

}