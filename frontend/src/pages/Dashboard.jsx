import { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { FiMoon, FiZap, FiDroplet, FiActivity, FiHeart, FiTrendingUp } from 'react-icons/fi';
import { analyticsService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const CARD_CONFIGS = [
  { key: 'stepsToday',           label: 'Steps Today',    icon: <FiActivity />, unit: '', color: '#38bdf8' },
  { key: 'avgSleepHours',        label: 'Avg. Sleep',     icon: <FiMoon />,     unit: 'hrs', color: '#a78bfa' },
  { key: 'hydrationLiters',      label: 'Hydration',      icon: <FiDroplet />,  unit: 'L',   color: '#34d399' },
  { key: 'totalCaloriesBurned',  label: 'Cal. Burned',    icon: <FiZap />,      unit: 'kcal', color: '#fb923c' },
  { key: 'totalWorkoutMinutes',  label: 'Active Time',    icon: <FiHeart />,    unit: 'min',  color: '#f472b6' },
  { key: 'workoutCount',         label: 'Workouts',       icon: <FiTrendingUp />, unit: 'this week', color: '#10b981' },
];

function SummaryCard({ label, icon, value, unit, color }) {
  return (
    <div style={{ ...styles.card, borderTop: `3px solid ${color}` }}>
      <div style={{ ...styles.cardIcon, background: color + '20', color }}>
        {icon}
      </div>
      <div>
        <div style={styles.cardValue}>{value ?? '—'}<span style={styles.cardUnit}> {unit}</span></div>
        <div style={styles.cardLabel}>{label}</div>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px 14px' }}>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '4px' }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color, fontSize: '0.9rem', fontWeight: 600 }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.getDashboard()
      .then(res => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <>
      <Navbar />
      <div style={styles.page} className="page-enter">
        <div style={styles.container}>

          {/* Header */}
          <div style={styles.header}>
            <div>
              <p style={styles.greeting}>{greeting},</p>
              <h1 style={styles.name}>{user?.name} <span style={{ color: 'var(--emerald)' }}>👋</span></h1>
              <p style={styles.sub}>Here's your health summary for this week</p>
            </div>
            {data?.bmi && (
              <div style={styles.bmiWidget}>
                <span style={styles.bmiNum}>{data.bmi}</span>
                <span style={styles.bmiLabel}>BMI · {data.bmiCategory}</span>
              </div>
            )}
          </div>

          {loading ? (
            <div style={{ padding: '80px 0', textAlign: 'center' }}>
              <div className="spinner" />
              <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Loading your health data…</p>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div style={styles.grid6}>
                {CARD_CONFIGS.map(c => (
                  <SummaryCard key={c.key} {...c} value={data?.[c.key]} />
                ))}
              </div>

              {/* Charts Row */}
              <div style={styles.chartsRow}>

                {/* Weekly Workouts Bar Chart */}
                <div style={styles.chartCard}>
                  <h3 style={styles.chartTitle}>Weekly Workout Activity</h3>
                  <p style={styles.chartSub}>Calories burned per day</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={data?.weeklyWorkoutData || []} barSize={24}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="calories" name="Calories" fill="var(--emerald)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Weekly Sleep Area Chart */}
                <div style={styles.chartCard}>
                  <h3 style={styles.chartTitle}>Sleep Pattern</h3>
                  <p style={styles.chartSub}>Hours of sleep per night</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={data?.weeklySleepData || []}>
                      <defs>
                        <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#a78bfa" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#a78bfa" stopOpacity={0}   />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 12]} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="hours" name="Sleep hrs" stroke="#a78bfa" strokeWidth={2} fill="url(#sleepGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Monthly Calorie Trend */}
              <div style={styles.chartCard}>
                <h3 style={styles.chartTitle}>Monthly Calorie Intake Trend</h3>
                <p style={styles.chartSub}>Total calories consumed per week</p>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={data?.monthlyCalorieTrend || []}>
                    <defs>
                      <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#fb923c" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#fb923c" stopOpacity={0}   />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="week" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="calories" name="Calories" stroke="#fb923c" strokeWidth={2} fill="url(#calGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

const styles = {
  page: { minHeight: 'calc(100vh - 64px)', padding: '32px 24px' },
  container: { maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px' },
  greeting: { color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 },
  name: { fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, margin: '4px 0' },
  sub: { color: 'var(--text-secondary)', fontSize: '0.95rem' },
  bmiWidget: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '16px 24px' },
  bmiNum: { fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 700, color: 'var(--emerald)' },
  bmiLabel: { fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 },
  grid6: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' },
  card: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: 'var(--shadow-card)' },
  cardIcon: { width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 },
  cardValue: { fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' },
  cardUnit: { fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)' },
  cardLabel: { fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' },
  chartsRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  chartCard: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '24px' },
  chartTitle: { fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, marginBottom: '4px' },
  chartSub: { color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '20px' },
};