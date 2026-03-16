import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiDroplet } from 'react-icons/fi';
import { waterService } from '../services/api';
import toast from 'react-hot-toast';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar
} from "recharts";

const DAILY_GOAL = 2.5;

const EMPTY = {
  date: new Date().toISOString().split('T')[0],
  liters: ''
};

export default function WaterIntakePage() {

  const [entries, setEntries] = useState([]);
  const [todayTotal, setTodayTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);

  const [showAnalytics,setShowAnalytics] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {

    Promise.all([
      waterService.getAll(),
      waterService.getTodayTotal()
    ])
      .then(([allRes, todayRes]) => {

        setEntries(allRes.data);
        setTodayTotal(todayRes.data);

      })
      .catch(() => toast.error('Failed to load water data'))
      .finally(() => setLoading(false));

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!form.liters || form.liters <= 0) {
      toast.error('Enter valid amount');
      return;
    }

    try {

      if (editId) {

        await waterService.update(editId, form);
        toast.success('Updated');

      } else {

        await waterService.create(form);
        toast.success('Water logged 💧');

      }

      setShowForm(false);
      setForm(EMPTY);
      setEditId(null);

      fetchData();

    } catch {

      toast.error('Failed to save');

    }

  };

  const handleEdit = (entry) => {

    setForm({
      date: entry.date,
      liters: entry.liters
    });

    setEditId(entry.id);
    setShowForm(true);

  };

  const handleDelete = async (id) => {

    if (!confirm('Delete this entry?')) return;

    try {

      await waterService.delete(id);

      toast.success('Deleted');

      fetchData();

    } catch {

      toast.error('Failed to delete');

    }

  };

  const progress = Math.min((todayTotal / DAILY_GOAL) * 100, 100);

  /* ---------- ANALYTICS DATA ---------- */

  const hydrationTrend = entries.map(e => ({
    date: e.date,
    liters: e.liters
  }));

  const goalData = [
    {
      name: "Hydration",
      value: todayTotal,
      fill: "#34d399"
    }
  ];

  return (

    <div className="px-[24px] py-[32px]">

      <div className="max-w-[900px] mx-auto flex flex-col gap-[24px]">

        {/* HEADER */}

        <div className="flex justify-between items-center">

          <div>

            <h1 className="text-[1.8rem] flex items-center gap-[10px]">

              <FiDroplet className="text-[#34d399]" />

              Water Intake

            </h1>

            <p className="text-[var(--text-secondary)]">
              Stay hydrated and track your daily water intake
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
              <FiPlus /> Add Water
            </button>

          </div>

        </div>

        {/* SUMMARY */}

        <div className="bg-[var(--bg-card)] p-[20px] rounded-[12px] border border-[var(--border)]">

          <h4>Today</h4>

          <p className="text-[1.6rem] font-bold text-[#34d399]">

            {todayTotal.toFixed(1)} L

          </p>

          <div className="h-[8px] bg-[var(--border)] rounded-[6px] mt-[10px] overflow-hidden">

            <div
              className="h-full bg-[#34d399]"
              style={{ width: `${progress}%` }}
            />

          </div>

          <p className="text-[0.85rem] text-[var(--text-muted)]">

            Goal: {DAILY_GOAL}L

          </p>

        </div>

        {/* ANALYTICS */}

        {showAnalytics && (

          <div className="bg-[var(--bg-card)] p-[24px] rounded-[12px] border border-[var(--border)] flex flex-col gap-[24px]">

            <h3 className="font-semibold text-[1.2rem]">
              Hydration Analytics
            </h3>

            <div className="grid md:grid-cols-2 gap-[24px]">

              {/* HYDRATION TREND */}

              <div className="h-[250px]">

                <p className="text-[var(--text-muted)] mb-[6px]">
                  Daily Hydration Trend
                </p>

                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hydrationTrend}>
                    <XAxis dataKey="date"/>
                    <YAxis/>
                    <Tooltip/>
                    <Bar dataKey="liters" fill="#34d399"/>
                  </BarChart>
                </ResponsiveContainer>

              </div>

              {/* GOAL PROGRESS */}

              <div className="h-[250px]">

                <p className="text-[var(--text-muted)] mb-[6px]">
                  Goal Progress
                </p>

                <ResponsiveContainer width="100%" height="100%">

                  <RadialBarChart
                    innerRadius="30%"
                    outerRadius="100%"
                    data={goalData}
                    startAngle={90}
                    endAngle={-270}
                  >

                    <RadialBar dataKey="value" />

                    <Tooltip/>

                  </RadialBarChart>

                </ResponsiveContainer>

              </div>

            </div>

            {/* HYDRATION PATTERN */}

            <div className="h-[250px]">

              <p className="text-[var(--text-muted)] mb-[6px]">
                Hydration Pattern
              </p>

              <ResponsiveContainer width="100%" height="100%">

                <AreaChart data={hydrationTrend}>

                  <XAxis dataKey="date"/>

                  <YAxis/>

                  <Tooltip/>

                  <Area
                    type="monotone"
                    dataKey="liters"
                    stroke="#06b6d4"
                    fill="#06b6d433"
                  />

                </AreaChart>

              </ResponsiveContainer>

            </div>

          </div>

        )}

        {/* FORM */}

        {showForm && (

          <div className="bg-[var(--bg-card)] p-[24px] rounded-[12px] border border-[var(--border)]">

            <h3 className="mb-[10px]">

              {editId ? 'Edit Entry' : 'Add Water Entry'}

            </h3>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-[16px]"
            >

              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm(f => ({ ...f, date: e.target.value }))
                }
              />

              <input
                type="number"
                step="0.1"
                placeholder="Liters"
                value={form.liters}
                onChange={(e) =>
                  setForm(f => ({ ...f, liters: e.target.value }))
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
                  {editId ? 'Update' : 'Save'}
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

        ) : (

          <div className="flex flex-col gap-[12px]">

            {entries.map(e => (

              <div
                key={e.id}
                className="bg-[var(--bg-card)] p-[18px] rounded-[12px] border border-[var(--border)] flex justify-between items-center"
              >

                <div>

                  <strong>{e.liters} L</strong>

                  <span className="ml-[10px] text-[var(--text-muted)]">
                    {e.date}
                  </span>

                </div>

                <div className="flex gap-[10px]">

                  <button
                    className="btn-ghost"
                    onClick={() => handleEdit(e)}
                  >
                    <FiEdit2 /> Edit
                  </button>

                  <button
                    className="btn-danger"
                    onClick={() => handleDelete(e.id)}
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