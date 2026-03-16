import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiMoon } from 'react-icons/fi';
import { sleepService } from '../services/api';
import toast from 'react-hot-toast';

import {
AreaChart,
Area,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
BarChart,
Bar,
RadialBarChart,
RadialBar
} from "recharts";

const QUALITY_COLORS = {
  POOR: '#f87171',
  FAIR: '#fbbf24',
  GOOD: '#34d399',
  EXCELLENT: '#10b981'
};

const EMPTY = {
  date: new Date().toISOString().split('T')[0],
  bedTime: '22:00',
  wakeTime: '06:00',
  notes: ''
};

export default function SleepPage() {

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [showAnalytics,setShowAnalytics] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = () =>
    sleepService.getAll()
      .then(r => setLogs(r.data))
      .catch(() => toast.error('Failed to load sleep logs'))
      .finally(() => setLoading(false));

  const calculateSleepHours = () => {

    if (!form.bedTime || !form.wakeTime) return 0;

    const [bh, bm] = form.bedTime.split(':').map(Number);
    const [wh, wm] = form.wakeTime.split(':').map(Number);

    let minutes = (wh * 60 + wm) - (bh * 60 + bm);

    if (minutes < 0) minutes += 24 * 60;

    return (minutes / 60).toFixed(1);
  };

  const getQuality = (hours) => {
    const h = parseFloat(hours);

    if (h < 5) return 'POOR';
    if (h < 6.5) return 'FAIR';
    if (h < 8) return 'GOOD';

    return 'EXCELLENT';
  };

  const getScheduleWarning = () => {

    if (!form.bedTime) return null;

    const [bh] = form.bedTime.split(':').map(Number);

    if (bh >= 1 && bh <= 4) {
      return "Late Sleep Cycle ⚠️ Consider sleeping earlier for better recovery.";
    }

    return null;
  };

  const liveHours = calculateSleepHours();
  const liveQuality = getQuality(liveHours);

  const handleSubmit = async (e) => {

    e.preventDefault();
    setSaving(true);

    try {

      if (editId) {
        await sleepService.update(editId, form);
        toast.success('Updated!');
      } else {
        await sleepService.create(form);
        toast.success('Sleep logged 😴');
      }

      setShowForm(false);
      setForm(EMPTY);
      setEditId(null);
      fetchLogs();

    } catch {

      toast.error('Failed to save');

    } finally {

      setSaving(false);

    }

  };

  const handleEdit = (l) => {

    setForm({
      date: l.date,
      bedTime: l.bedTime || '22:00',
      wakeTime: l.wakeTime || '06:00',
      notes: l.notes || ''
    });

    setEditId(l.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {

    if (!confirm('Delete this entry?')) return;

    try {

      await sleepService.delete(id);

      toast.success('Deleted');

      fetchLogs();

    } catch {

      toast.error('Failed to delete');

    }

  };

  /* ---------- ANALYTICS DATA ---------- */

  const sleepTrend = logs.map(l => ({
    date: l.date,
    hours: l.sleepHours
  }));

  const avgSleep =
    logs.reduce((s,l)=>s+(l.sleepHours||0),0) / (logs.length || 1);

  const comparisonData = [
    { name:"Today", hours: logs[0]?.sleepHours || 0 },
    { name:"Average", hours: avgSleep.toFixed(1) }
  ];

  const qualityCount = {
    POOR:0,
    FAIR:0,
    GOOD:0,
    EXCELLENT:0
  };

  logs.forEach(l=>{
    if(qualityCount[l.sleepQuality]!==undefined){
      qualityCount[l.sleepQuality]++;
    }
  });

  const qualityData = Object.entries(qualityCount).map(([q,v])=>({
    name:q,
    value:v,
    fill:QUALITY_COLORS[q]
  }));

  return (

    <div className="px-[24px] py-[32px]">

      <div className="max-w-[900px] mx-auto flex flex-col gap-[24px]">

        {/* HEADER */}

        <div className="flex justify-between items-center">

          <div>

            <h1 className="text-[1.8rem] flex items-center gap-[10px]">

              <FiMoon className="text-[#a78bfa]" />

              Sleep Tracker

            </h1>

            <p className="text-[var(--text-secondary)]">
              Monitor your sleep quality & patterns
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
              <FiPlus /> Log Sleep
            </button>

          </div>

        </div>

        {/* ANALYTICS */}

        {showAnalytics && (

          <div className="bg-[var(--bg-card)] p-[24px] rounded-[12px] border border-[var(--border)] flex flex-col gap-[24px]">

            <h3 className="font-semibold text-[1.2rem]">
              Sleep Analytics
            </h3>

            <div className="grid md:grid-cols-2 gap-[24px]">

              {/* SLEEP TREND */}

              <div className="h-[260px]">

                <p className="text-[var(--text-muted)] mb-[6px]">
                  Sleep Hours Trend
                </p>

                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sleepTrend}>
                    <XAxis dataKey="date"/>
                    <YAxis/>
                    <Tooltip/>
                    <Area
                      type="monotone"
                      dataKey="hours"
                      stroke="#a78bfa"
                      fill="#a78bfa33"
                    />
                  </AreaChart>
                </ResponsiveContainer>

              </div>

              {/* COMPARISON */}

              <div className="h-[260px]">

                <p className="text-[var(--text-muted)] mb-[6px]">
                  Today vs Average
                </p>

                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData}>
                    <XAxis dataKey="name"/>
                    <YAxis/>
                    <Tooltip/>
                    <Bar dataKey="hours" fill="#34d399"/>
                  </BarChart>
                </ResponsiveContainer>

              </div>

            </div>

            {/* QUALITY DISTRIBUTION */}

            <div className="h-[260px]">

              <p className="text-[var(--text-muted)] mb-[6px]">
                Sleep Quality Distribution
              </p>

              <ResponsiveContainer width="100%" height="100%">

                <RadialBarChart
                  innerRadius="30%"
                  outerRadius="100%"
                  data={qualityData}
                >

                  <RadialBar dataKey="value" />

                  <Tooltip/>

                </RadialBarChart>

              </ResponsiveContainer>

            </div>

          </div>

        )}

        {/* FORM */}

        {showForm && (

          <div className="bg-[var(--bg-card)] p-[24px] rounded-[12px] border border-[var(--border)]">

            <h3 className="mb-[10px]">
              {editId ? 'Edit Sleep Entry' : 'Log Sleep'}
            </h3>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-[16px]"
            >

              <div className="grid grid-cols-3 gap-[16px]">

                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                />

                <input
                  type="time"
                  value={form.bedTime}
                  onChange={e => setForm(f => ({ ...f, bedTime: e.target.value }))}
                />

                <input
                  type="time"
                  value={form.wakeTime}
                  onChange={e => setForm(f => ({ ...f, wakeTime: e.target.value }))}
                />

              </div>

              <div className="flex justify-between bg-[var(--bg-elevated)] px-[16px] py-[12px] rounded-[10px]">

                <div>

                  <strong>{liveHours} hrs</strong>

                  <span
                    className="ml-[10px]"
                    style={{ color: QUALITY_COLORS[liveQuality] }}
                  >
                    {liveQuality}
                  </span>

                </div>

                {getScheduleWarning() && (

                  <div className="mt-[8px] bg-[#fbbf2415] border border-[#fbbf24] px-[12px] py-[8px] rounded-[8px] text-[0.85rem] text-[#fbbf24]">

                    {getScheduleWarning()}

                  </div>

                )}

              </div>

              <textarea
                placeholder="Notes"
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
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

        {/* LOADING */}

        {loading && (
          <div className="text-center py-[60px] text-[var(--text-muted)]">
            Loading...
          </div>
        )}

        {/* EMPTY */}

        {!loading && logs.length === 0 && (

          <div className="text-center py-[60px] text-[var(--text-muted)]">

            <FiMoon size={48} />

            <h3>No sleep logs yet</h3>

            <p>Start tracking your sleep tonight 🌙</p>

          </div>

        )}

        {/* LIST */}

        {logs.length > 0 && (

          <div className="flex flex-col gap-[16px]">

            {logs.map(l => (

              <div
                key={l.id}
                className="bg-[var(--bg-card)] p-[20px] rounded-[12px] border border-[var(--border)] flex flex-col gap-[10px]"
              >

                <div className="flex justify-between items-center">

                  <strong>{l.date}</strong>

                  <span
                    className="font-semibold"
                    style={{
                      color: QUALITY_COLORS[l.sleepQuality] || '#ccc'
                    }}
                  >
                    {l.sleepQuality}
                  </span>

                </div>

                <div className="text-[1.1rem] font-semibold">
                  {l.sleepHours} hrs
                </div>

                {l.notes && (
                  <div className="text-[0.9rem] text-[var(--text-muted)]">
                    {l.notes}
                  </div>
                )}

                <div className="flex gap-[10px] justify-end">

                  <button
                    className="btn-ghost"
                    onClick={() => handleEdit(l)}
                  >
                    <FiEdit2 /> Edit
                  </button>

                  <button
                    className="btn-danger"
                    onClick={() => handleDelete(l.id)}
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