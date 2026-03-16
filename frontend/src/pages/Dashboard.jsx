//Remember in dark theme it should be like this only what already we have in the light theme it should be changes all the text and all also in the monthly grid the box size is too big so make it only required for grid size
//remember not to remove or forget to change one single line

import { useState, useEffect } from 'react';
import AIAgentButton from "../components/AIAgentButton";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  FiMoon, FiZap, FiDroplet,
  FiActivity, FiHeart, FiTrendingUp
} from 'react-icons/fi';

import API, { analyticsService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CARD_CONFIGS = [
  
  { key: 'avgSleepHours', label: 'Avg. Sleep', icon: <FiMoon />, unit: 'hrs', color: '#a78bfa' },
  { key: 'hydrationLiters', label: 'Hydration', icon: <FiDroplet />, unit: 'L', color: '#34d399' },
  { key: 'totalCaloriesBurned', label: 'Cal. Burned', icon: <FiZap />, unit: 'kcal', color: '#fb923c' },
  { key: 'totalWorkoutMinutes', label: 'Active Time', icon: <FiHeart />, unit: 'min', color: '#f472b6' },
  { key: 'workoutCount', label: 'Workouts', icon: <FiTrendingUp />, unit: 'this week', color: '#10b981' },
];

function SummaryCard({ label, icon, value, unit, color }) {
  return (
    <div
      className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-[18px] flex gap-[14px] transition-all duration-200 hover:shadow-md hover:-translate-y-[2px]"
      style={{ borderTop: `3px solid ${color}` }}
    >
      <div
        className="w-[42px] h-[42px] rounded-[10px] flex items-center justify-center"
        style={{ background: color + "20", color }}
      >
        {icon}
      </div>

      <div>
        <div className="text-[1.4rem] font-bold text-[var(--text-primary)]">
          {value ?? '—'} <span className="text-[0.75rem] text-[var(--text-muted)]">{unit}</span>
        </div>
        <div className="text-[0.8rem] text-[var(--text-muted)]">{label}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {

  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [weeklyStreak, setWeeklyStreak] = useState([]);
  const [monthlyStreak, setMonthlyStreak] = useState([])
  const [weeklyMap, setWeeklyMap] = useState({});
  const [monthlyMap, setMonthlyMap] = useState({});
  const [bmiData, setBmiData] = useState(null);
  const [dailyTip, setDailyTip] = useState("");

  useEffect(() => {
    Promise.all([
      analyticsService.getDashboard(),
      API.get('/streak'),
      API.get('/streak/weekly'),
      API.get('/streak/monthly'),
      API.get('/bmi/me'),
      API.get('/tips/daily')
    ])
      .then(([dashboardRes, streakRes, weeklyRes, monthlyRes, bmiRes, tipRes]) => {
        setData(dashboardRes.data);
        setStreak(streakRes.data);
        setWeeklyStreak(weeklyRes.data); 
        setMonthlyStreak(monthlyRes.data)
        setWeeklyMap(weeklyRes.data || {});
        setMonthlyMap(monthlyRes.data || {});
        setBmiData(bmiRes.data);
        setDailyTip(tipRes.data);
      })
      .catch(err => console.error("Dashboard error:", err))
      .finally(() => setLoading(false));
  }, []);

  const calorieBalance =
    (data?.totalCaloriesBurned || 0) -
    (data?.totalCaloriesConsumed || 0);

  const balanceColor =
    calorieBalance > 0 ? "#10b981"
    : calorieBalance < 0 ? "#ef4444"
    : "var(--text-muted)";

  const healthScore = data?.healthScore || 0;

  const getActivityColor = (value) => {
    if (!value) return "#1f2937";
    if (value < 2) return "#065f46";
    if (value < 4) return "#047857";
    return "#10b981";
  };

  const now = new Date();
  const currentMonth = now.toLocaleString('default', { month: 'long' });
  const currentYear = now.getFullYear();

  return (
    <div className="px-6 py-8">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-7">

        {/* HERO */}
        <div className="grid grid-cols-[1.5fr_1fr] gap-[30px] items-start">

          <div>

            <div className="mb-5">
              <h1 className="text-[2rem] font-bold text-[var(--text-primary)]">{user?.name} 👋</h1>
              <p className="text-[var(--text-secondary)]">
                Your weekly health intelligence
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {CARD_CONFIGS.slice(0, 4).map(c => (
                <SummaryCard
                  key={c.key}
                  label={c.label}
                  icon={c.icon}
                  unit={c.unit}
                  color={c.color}
                  value={data?.[c.key]}
                />
              ))}
            </div>
{/* Weekly Streak */}
<div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-4 mt-5">

  <div className="flex justify-between text-[0.85rem] font-semibold mb-[10px] text-[var(--text-primary)]">
    <span>🔥 Weekly Streak</span>
   <span>{streak} day{streak !== 1 && "s"}</span>
  </div>

  <div className="flex gap-[6px]">

    {Object.entries(weeklyMap).map(([date,active], index) => {

      const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

      return (
        <div
          key={date}
          className="px-[9px] py-[5px] rounded-[20px] text-[0.65rem]"
          style={{
            background: active ? "#10b981" : "#2d3748",
            color: active ? "#fff" : "#94a3b8",
            transition: "all 0.2s ease"
          }}
        >
          {days[index]}
        </div>
      );

    })}

  </div>

</div>

          </div>

          {/* Health Card */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 flex flex-col items-center min-h-[220px]">

            <h3 className="text-[1rem] mb-3 text-[var(--text-primary)]">Health Score</h3>

            <SmallHealthRing score={healthScore} size={100} />

            <p className="text-[0.85rem] mt-3 text-center text-[var(--text-secondary)]">
              {data?.healthInsight}
            </p>

          </div>

        </div>

        {/* BMI */}
        {bmiData && (
          <div className="mt-4 p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-center shadow-sm hover:shadow-md transition">

            <div className="text-xs text-[var(--text-secondary)]">
              Body Mass Index
            </div>

            <div className="text-2xl font-bold text-[var(--text-primary)] mt-1">
              {bmiData.bmi}
            </div>

            <div
              className={`text-xs font-semibold mt-1 px-2 py-1 inline-block rounded-full
                ${
                  bmiData.category === "Normal"
                    ? "bg-green-100 text-green-700"
                    : bmiData.category === "Underweight"
                    ? "bg-yellow-100 text-yellow-700"
                    : bmiData.category === "Overweight"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-red-100 text-red-700"
                }
              `}
            >
              {bmiData.category}
            </div>

            <div className="text-xs mt-2 text-[var(--text-secondary)]">
              {bmiData.interpretation}
            </div>

          </div>
        )}

        {/* Daily Tip */}
        {dailyTip && (
          <div className="rounded-2xl p-5 border border-[rgba(16,185,129,0.25)] bg-[linear-gradient(135deg,rgba(16,185,129,0.08),rgba(16,185,129,0.02))]">
            <div className="text-[0.75rem] font-semibold tracking-[0.08em] uppercase text-[#10b981]">
              Today’s WellNest Insight
            </div>

            <div className="mt-[10px] text-[0.95rem] leading-[1.6] font-medium text-[var(--text-primary)]">
              {dailyTip}
            </div>
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center">
            <div className="spinner" />
          </div>
        ) : (
          <>

            {/* Calorie Balance */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 flex justify-between items-center hover:shadow-md transition">
              <div>
                <h3 className="text-[1rem] font-semibold text-[var(--text-primary)]">Weekly Calorie Balance</h3>
                <p className="text-[0.8rem] text-[var(--text-muted)] mt-1">
                  Burned vs Consumed this week
                </p>
              </div>

              <div className="text-[1.8rem] font-bold" style={{color:balanceColor}}>
                {calorieBalance > 0 ? "+" : ""}
                {calorieBalance} kcal
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-2 gap-5">

              <div className="bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border)] hover:shadow-md transition">
                <h3 className="text-[1rem] font-semibold text-[var(--text-primary)]">Weekly Workout Activity</h3>

                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={data?.weeklyWorkoutData || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                    <XAxis dataKey="day"/>
                    <YAxis/>
                    <Tooltip
                      contentStyle={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px"
                      }}
                    />
                    <Bar dataKey="calories" fill="#10b981" radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border)] hover:shadow-md transition">
                <h3 className="text-[1rem] font-semibold text-[var(--text-primary)]">Weekly Sleep Pattern</h3>

                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={data?.weeklySleepData || []}>

                    <defs>
                      <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                    <XAxis dataKey="day"/>
                    <YAxis domain={[0,12]}/>

                    <Tooltip
                      contentStyle={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px"
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey="hours"
                      stroke="#8b5cf6"
                      fill="url(#sleepGradient)"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />

                  </AreaChart>
                </ResponsiveContainer>
              </div>

            </div>
{/* Monthly Activity */}
{/* Monthly Activity */}
<div className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border)] w-fit hover:shadow-md transition">

  <h3 className="text-[1rem] font-semibold text-[var(--text-primary)]">
    {currentMonth} {currentYear} Activity
  </h3>

  <div className="grid grid-cols-7 gap-[8px] mt-3">

    {(monthlyStreak || []).map((active, index) => {

      const dayNumber = index + 1
      const today = new Date().getDate()

      // Hide future days
      if (dayNumber > today) return null

      return (
        <div
          key={index}
          className="h-[32px] w-[32px] rounded-md text-[0.8rem] font-medium flex items-center justify-center text-white transition hover:scale-110"
          style={{
            background: active ? "#10b981" : "#2d3748"
          }}
        >
          {dayNumber}
        </div>
      )

    })}

  </div>

</div>

          </>
        )}

      </div>
    </div>
  );
}

function SmallHealthRing({ score, size = 80 }) {

  const radius = size / 2 - 12;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const ringColor =
    score >= 80 ? "#10b981"
    : score >= 50 ? "#f59e0b"
    : "#ef4444";

  return (
    <div className="text-center">

      <svg width={size} height={size}>

        <circle
          cx={size/2}
          cy={size/2}
          r={radius}
          stroke="#2d2d2d"
          strokeWidth="8"
          fill="none"
        />

        <circle
          cx={size/2}
          cy={size/2}
          r={radius}
          stroke={ringColor}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{transition:"stroke-dashoffset 0.5s ease"}}
        />

        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          fontSize="18"
          fill="var(--text-primary)"
        >
          {score}%
        </text>

      </svg>

      <AIAgentButton />

    </div>
  );

}