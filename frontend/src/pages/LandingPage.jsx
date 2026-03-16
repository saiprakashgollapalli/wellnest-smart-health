import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ─── Theme Context ────────────────────────────────────────────────────────────
const useTheme = () => {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  return { dark, toggle: () => setDark(d => !d) };
};

// ─── Count-up Hook ────────────────────────────────────────────────────────────
const useCountUp = (target, duration = 2000, start = false) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf;
    const startTime = performance.now();
    const tick = now => {
      const p = Math.min((now - startTime) / duration, 1);
      setVal(Math.floor(p * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return val;
};

// ─── Intersection Observer Hook ──────────────────────────────────────────────
const useInView = () => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
};

// ─── Navbar ───────────────────────────────────────────────────────────────────
const Navbar = ({ dark, toggle }) => {
  const navigate = useNavigate();
  const [scroll, setScroll] = useState(false);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    
    const h = () => setScroll(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const links = ["Home", "Features", "AI Coach", "Trainers", "Blogs", "Contact"];
  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scroll ? "py-2" : "py-4"}`}
      style={{ background: scroll ? (dark ? "rgba(10,10,10,0.95)" : "rgba(255,255,255,0.95)") : "transparent", backdropFilter: scroll ? "blur(16px)" : "none", borderBottom: scroll ? `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}` : "none" }}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #10b981, #06b6d4)" }}>
            <span className="text-white font-black text-sm">W</span>
          </div>
          <span className="font-black text-xl tracking-tight" style={{ fontFamily: "'Georgia', serif", color: dark ? "#fff" : "#0a0a0a" }}>WellNest</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l} href={l === "Features" ? "#features" : l === "Home" ? "#" : "#"} className="text-sm font-medium transition-colors duration-200"
              style={{ color: dark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)" }}
              onMouseEnter={e => e.target.style.color = "#10b981"} onMouseLeave={e => e.target.style.color = dark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)"}>
              {l}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggle} className="w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all"
            style={{ background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)", color: dark ? "#fff" : "#0a0a0a" }}>
            {dark ? "☀️" : "🌙"}
          </button>
          <button className="hidden md:block text-sm font-semibold px-4 py-2 rounded-lg transition-all"
            style={{ color: dark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)" }}>Sign In</button>
          <button 
          onClick={() => navigate("/login")}
          className="text-sm font-bold px-5 py-2 rounded-xl text-white transition-all hover:scale-105 active:scale-95"
            style={{ background: "linear-gradient(135deg, #10b981, #06b6d4)", boxShadow: "0 4px 15px rgba(16,185,129,0.4)" }}>
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

// ─── Hero ─────────────────────────────────────────────────────────────────────
const Hero = ({ dark }) => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden" style={{ paddingTop: "5rem" }}>
      {/* Animated gradient background */}
      <div className="absolute inset-0" style={{ background: dark ? "linear-gradient(135deg, #0a0a0a 0%, #0d1f1a 40%, #0a0a0a 100%)" : "linear-gradient(135deg, #f0fdf4 0%, #ecfeff 50%, #f0fdf4 100%)" }} />
      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #10b981, transparent)", filter: "blur(80px)", animation: "float 6s ease-in-out infinite" }} />
      <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #6366f1, transparent)", filter: "blur(80px)", animation: "float 8s ease-in-out infinite reverse" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, #06b6d4, transparent)", filter: "blur(100px)" }} />

      <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center w-full">
        <div>
          <div className={`transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
              style={{ background: dark ? "rgba(16,185,129,0.15)" : "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" }}>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              AI-Powered Health Platform
            </div>
            <h1 className="text-5xl lg:text-7xl font-black leading-tight mb-6" style={{ fontFamily: "'Georgia', serif", color: dark ? "#fff" : "#0a0a0a" }}>
              Your All-in-One{" "}
              <span style={{ background: "linear-gradient(135deg, #10b981, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Health & Fitness
              </span>{" "}
              Companion
            </h1>
            <p className="text-lg lg:text-xl mb-10 leading-relaxed" style={{ color: dark ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.6)" }}>
              Track workouts, monitor nutrition, stay hydrated, improve sleep, and get AI-powered insights — all in one beautiful dashboard.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
  onClick={() => navigate("/login")}
  className="px-8 py-4 rounded-2xl text-white font-bold text-lg transition-all hover:scale-105 active:scale-95"
  style={{
    background: "linear-gradient(135deg, #10b981, #06b6d4)",
    boxShadow: "0 8px 30px rgba(16,185,129,0.4)"
  }}
>
  Get Started Free →
</button>
              <a href="#features" className="px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 flex items-center gap-2"
                style={{ border: `2px solid ${dark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)"}`, color: dark ? "#fff" : "#0a0a0a", background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)" }}>
                Explore Features ↓
              </a>
            </div>
            <div className="flex items-center gap-8 mt-12">
              {[["10K+", "Active Users"], ["95%", "Goal Success"], ["500K+", "Workouts"]].map(([n, l]) => (
                <div key={l}>
                  <div className="text-2xl font-black" style={{ color: "#10b981" }}>{n}</div>
                  <div className="text-sm" style={{ color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive widgets */}
        <div className={`flex flex-col gap-5 transition-all duration-700 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <WaterWidget dark={dark} />
          <StreakWidget dark={dark} />
        </div>
      </div>

      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
        @keyframes fillWater { from{height:0} to{height:var(--fill)} }
        @keyframes wave { 0%,100%{transform:translateX(0)} 50%{transform:translateX(-25%)} }
      `}</style>
    </section>
  );
};

// ─── Water Widget ─────────────────────────────────────────────────────────────
const WaterWidget = ({ dark }) => {
  const [amount, setAmount] = useState(1.8);
  const max = 2.5;
  const pct = Math.round((amount / max) * 100);
  const card = dark ? "#111827" : "#fff";
  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const textP = dark ? "#fff" : "#0a0a0a";
  const textS = dark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)";

  return (
    <div className="rounded-3xl p-6" style={{ background: card, border: `1px solid ${border}`, boxShadow: dark ? "0 4px 30px rgba(0,0,0,0.4)" : "0 4px 30px rgba(0,0,0,0.08)" }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-sm font-semibold mb-1" style={{ color: "#06b6d4" }}>💧 Daily Hydration</div>
          <div className="text-3xl font-black" style={{ color: textP }}>{amount.toFixed(1)}L <span className="text-base font-medium" style={{ color: textS }}>/ {max}L</span></div>
        </div>
        <div className="relative w-16 h-20 rounded-2xl overflow-hidden" style={{ border: `2px solid #06b6d4`, background: dark ? "#1f2937" : "#f0f9ff" }}>
          <div className="absolute bottom-0 w-full transition-all duration-700 rounded-b-xl overflow-hidden" style={{ height: `${pct}%`, background: "linear-gradient(to top, #0891b2, #06b6d4, #67e8f9)" }}>
            <div className="absolute top-0 left-0 w-[200%] h-3 rounded-full opacity-60" style={{ background: "rgba(255,255,255,0.5)", animation: "wave 2s linear infinite" }} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-black" style={{ color: pct > 50 ? "#fff" : "#0891b2" }}>{pct}%</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        {[0.25, 0.5, 0.75].map(v => (
          <button key={v} onClick={() => setAmount(a => Math.min(max, a + v))}
            className="flex-1 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #0891b2, #06b6d4)", color: "#fff" }}>
            +{v}L
          </button>
        ))}
        <button onClick={() => setAmount(0)} className="px-3 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105"
          style={{ background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)", color: textS }}>↺</button>
      </div>
    </div>
  );
};

// ─── Streak Widget ────────────────────────────────────────────────────────────
const StreakWidget = ({ dark }) => {
  const days = [
    { d: "M", done: true }, { d: "T", done: true }, { d: "W", done: true },
    { d: "T", done: true }, { d: "F", done: false }, { d: "S", done: false }, { d: "S", done: false }
  ];
  const card = dark ? "#111827" : "#fff";
  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const textP = dark ? "#fff" : "#0a0a0a";
  const textS = dark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)";

  return (
    <div className="rounded-3xl p-6" style={{ background: card, border: `1px solid ${border}`, boxShadow: dark ? "0 4px 30px rgba(0,0,0,0.4)" : "0 4px 30px rgba(0,0,0,0.08)" }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm font-semibold mb-1" style={{ color: "#f59e0b" }}>🔥 Weekly Streak</div>
          <div className="text-3xl font-black" style={{ color: textP }}>4 <span className="text-base font-medium" style={{ color: textS }}>days active</span></div>
        </div>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)" }}>🏆</div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="text-xs font-bold" style={{ color: textS }}>{day.d}</div>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-all duration-500"
              style={{ background: day.done ? "linear-gradient(135deg, #10b981, #34d399)" : (dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"), animationDelay: `${i * 100}ms` }}>
              {day.done ? <span className="text-white font-bold">✓</span> : <span style={{ color: textS }}>·</span>}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-xl p-3 text-sm font-medium text-center" style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(6,182,212,0.12))", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)" }}>
        🎯 Keep going! Only 3 more days to complete the week
      </div>
    </div>
  );
};

// ─── Features ─────────────────────────────────────────────────────────────────
const features = [
  { icon: "📊", title: "Smart Dashboard", desc: "Unified view of all your health metrics, trends, and progress at a glance.", color: "#6366f1" },
  { icon: "🥗", title: "Nutrition Tracking", desc: "Log meals, scan barcodes, and get macro breakdowns with AI-powered suggestions.", color: "#10b981" },
  { icon: "💧", title: "Water Intake", desc: "Set hydration goals, log intake, and get smart reminders throughout the day.", color: "#06b6d4" },
  { icon: "🏋️", title: "Workout Tracker", desc: "Log sets, reps, weights, and cardio. Access 1000+ exercise guides.", color: "#f59e0b" },
  { icon: "🤖", title: "AI Coach", desc: "Personalized plans, real-time form feedback, and adaptive recommendations.", color: "#8b5cf6" },
  { icon: "👨‍🏫", title: "Trainer Guidance", desc: "Connect with certified trainers for live sessions and custom programs.", color: "#ec4899" },
  { icon: "📝", title: "Health Blogs", desc: "Evidence-based articles, recipes, and tips curated by experts.", color: "#14b8a6" },
  { icon: "😴", title: "Sleep Tracking", desc: "Monitor sleep stages, quality scores, and recovery metrics.", color: "#3b82f6" },
];

const FeatureGrid = ({ dark }) => {
  const { ref, inView } = useInView();
  const bg = dark ? "#0a0a0a" : "#fafafa";
  const card = dark ? "#111827" : "#fff";
  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const textP = dark ? "#fff" : "#0a0a0a";
  const textS = dark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)";

  return (
    <section id="features" ref={ref} className="py-28 px-6" style={{ background: bg }}>
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4" style={{ background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.25)" }}>
            Everything you need
          </div>
          <h2 className="text-4xl lg:text-6xl font-black mb-4" style={{ fontFamily: "'Georgia', serif", color: textP }}>
            Features Built for{" "}
            <span style={{ background: "linear-gradient(135deg, #10b981, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Real Results</span>
          </h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: textS }}>Every tool you need to transform your health, backed by science and powered by AI.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div key={f.title}
              className={`rounded-3xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ background: card, border: `1px solid ${border}`, boxShadow: dark ? "0 2px 20px rgba(0,0,0,0.3)" : "0 2px 20px rgba(0,0,0,0.06)", transitionDelay: `${i * 60}ms` }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 20px 60px ${f.color}30`; e.currentTarget.style.borderColor = `${f.color}40`; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = dark ? "0 2px 20px rgba(0,0,0,0.3)" : "0 2px 20px rgba(0,0,0,0.06)"; e.currentTarget.style.borderColor = border; }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4" style={{ background: `${f.color}18` }}>
                {f.icon}
              </div>
              <h3 className="text-lg font-black mb-2" style={{ color: textP }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: textS }}>{f.desc}</p>
              <div className="mt-4 text-sm font-semibold flex items-center gap-1" style={{ color: f.color }}>
                Learn more <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Goal Setter ──────────────────────────────────────────────────────────────
const GoalSetter = ({ dark }) => {
  const { ref, inView } = useInView();
  const [age, setAge] = useState("");
  const [goal, setGoal] = useState("");
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const plans = {
    "Weight Loss": { workout: "45 min cardio + HIIT", hydration: "3.0L water", sleep: "8 hours", nutrition: "Caloric deficit, high fiber" },
    "Muscle Gain": { workout: "60 min strength training", hydration: "2.5L water", sleep: "9 hours", nutrition: "High protein, caloric surplus" },
    "Improve Fitness": { workout: "30 min cardio + mobility", hydration: "2.5L water", sleep: "7-8 hours", nutrition: "Balanced macros" },
    "General Health": { workout: "30 min mixed activity", hydration: "2.0L water", sleep: "7-8 hours", nutrition: "Mediterranean diet" },
  };

  const generate = () => {
    if (!age || !goal) return;
    setLoading(true);
    setTimeout(() => { setPlan(plans[goal]); setLoading(false); }, 1000);
  };

  const bg = dark ? "#0d1117" : "#f8fafc";
  const card = dark ? "#111827" : "#fff";
  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const textP = dark ? "#fff" : "#0a0a0a";
  const textS = dark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)";
  const inputBg = dark ? "#1f2937" : "#f8fafc";

  return (
    <section ref={ref} className="py-28 px-6" style={{ background: bg }}>
      <div className="max-w-3xl mx-auto">
        <div className={`text-center mb-10 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4" style={{ background: "rgba(99,102,241,0.1)", color: "#6366f1", border: "1px solid rgba(99,102,241,0.25)" }}>
            Quick Goal Setter
          </div>
          <h2 className="text-4xl lg:text-5xl font-black mb-4" style={{ fontFamily: "'Georgia', serif", color: textP }}>
            Get Your{" "}
            <span style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Personalized Plan
            </span>
          </h2>
          <p className="text-lg" style={{ color: textS }}>No account needed. Just tell us about yourself.</p>
        </div>

        <div className={`rounded-3xl p-8 transition-all duration-700 delay-200 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ background: card, border: `1px solid ${border}`, boxShadow: dark ? "0 8px 40px rgba(0,0,0,0.4)" : "0 8px 40px rgba(0,0,0,0.08)" }}>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm font-semibold mb-2 block" style={{ color: textS }}>Your Age</label>
              <input type="number" placeholder="e.g. 28" value={age} onChange={e => setAge(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-base font-medium outline-none transition-all"
                style={{ background: inputBg, border: `2px solid ${border}`, color: textP }}
                onFocus={e => e.target.style.borderColor = "#6366f1"} onBlur={e => e.target.style.borderColor = border} />
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block" style={{ color: textS }}>Fitness Goal</label>
              <select value={goal} onChange={e => setGoal(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-base font-medium outline-none transition-all"
                style={{ background: inputBg, border: `2px solid ${border}`, color: goal ? textP : textS }}>
                <option value="">Select your goal…</option>
                {Object.keys(plans).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <button onClick={generate} disabled={!age || !goal}
            className="w-full py-4 rounded-2xl font-black text-lg text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 8px 25px rgba(99,102,241,0.4)" }}>
            {loading ? "✨ Generating your plan…" : "✨ Generate My Plan"}
          </button>

          {plan && (
            <div className="mt-6 rounded-2xl p-6 transition-all" style={{ background: dark ? "rgba(99,102,241,0.1)" : "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.2)" }}>
              <div className="text-lg font-black mb-4" style={{ color: textP }}>📋 Daily Recommendation</div>
              <div className="grid sm:grid-cols-2 gap-4">
                {[["🏃 Workout", plan.workout], ["💧 Hydration", plan.hydration], ["😴 Sleep", plan.sleep], ["🥗 Nutrition", plan.nutrition]].map(([label, val]) => (
                  <div key={label} className="rounded-xl p-4" style={{ background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}>
                    <div className="text-xs font-bold mb-1" style={{ color: "#6366f1" }}>{label}</div>
                    <div className="text-sm font-semibold" style={{ color: textP }}>{val}</div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-3 rounded-xl font-bold text-white transition-all hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, #10b981, #06b6d4)", boxShadow: "0 4px 15px rgba(16,185,129,0.35)" }}>
                Create Account for Full Plan →
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// ─── Dashboard Preview ────────────────────────────────────────────────────────
const DashboardPreview = ({ dark }) => {
  const { ref, inView } = useInView();
  const metrics = [
    { icon: "🔥", label: "Calories Burned", value: "2,340", unit: "kcal", color: "#ef4444", pct: 78 },
    { icon: "💤", label: "Sleep Hours", value: "7.4", unit: "hrs", color: "#6366f1", pct: 92 },
    { icon: "💧", label: "Water Intake", value: "2.1", unit: "liters", color: "#06b6d4", pct: 84 },
    { icon: "⚡", label: "Workout Time", value: "48", unit: "min", color: "#10b981", pct: 60 },
  ];
  const bg = dark ? "#0a0a0a" : "#f8fafc";
  const card = dark ? "#111827" : "#fff";
  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const textP = dark ? "#fff" : "#0a0a0a";
  const textS = dark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.5)";

  return (
    <section ref={ref} className="py-28 px-6" style={{ background: bg }}>
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-4xl lg:text-5xl font-black mb-4" style={{ fontFamily: "'Georgia', serif", color: textP }}>
            Your Health,{" "}
            <span style={{ background: "linear-gradient(135deg, #10b981, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>At a Glance</span>
          </h2>
          <p className="text-xl" style={{ color: textS }}>Beautiful analytics dashboard updated in real-time</p>
        </div>

        <div className={`rounded-3xl overflow-hidden transition-all duration-700 delay-200 ${inView ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
          style={{ background: dark ? "#0d1117" : "#fff", border: `1px solid ${border}`, boxShadow: dark ? "0 30px 80px rgba(0,0,0,0.6)" : "0 30px 80px rgba(0,0,0,0.12)" }}>

          {/* Mock browser bar */}
          <div className="flex items-center gap-2 px-5 py-3" style={{ background: dark ? "#161b22" : "#f3f4f6", borderBottom: `1px solid ${border}` }}>
            <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-400" /><div className="w-3 h-3 rounded-full bg-yellow-400" /><div className="w-3 h-3 rounded-full bg-green-400" /></div>
            <div className="flex-1 mx-4 px-4 py-1 rounded-lg text-xs font-mono" style={{ background: dark ? "#1f2937" : "#e5e7eb", color: textS }}>app.wellnest.io/dashboard</div>
          </div>

          {/* Dashboard content */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-black" style={{ color: textP }}>Good morning, Alex! 👋</h3>
                <p className="text-sm" style={{ color: textS }}>Here's your health summary for today</p>
              </div>
              <div className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ background: "rgba(16,185,129,0.12)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)" }}>
                🟢 On Track
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {metrics.map((m, i) => (
                <div key={m.label} className={`rounded-2xl p-4 transition-all duration-700`} style={{ background: dark ? "#1f2937" : "#f9fafb", transitionDelay: `${300 + i * 100}ms`, opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)" }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl">{m.icon}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${m.color}20`, color: m.color }}>Today</span>
                  </div>
                  <div className="text-2xl font-black mb-0.5" style={{ color: textP }}>{m.value}</div>
                  <div className="text-xs mb-3" style={{ color: textS }}>{m.label}</div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }}>
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: inView ? `${m.pct}%` : "0%", background: `linear-gradient(90deg, ${m.color}99, ${m.color})`, transitionDelay: `${500 + i * 100}ms` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Mini chart placeholder */}
            <div className="rounded-2xl p-4" style={{ background: dark ? "#1f2937" : "#f9fafb" }}>
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-sm" style={{ color: textP }}>Weekly Activity</span>
                <span className="text-xs font-semibold px-2 py-1 rounded-lg" style={{ background: "rgba(16,185,129,0.1)", color: "#10b981" }}>+12% vs last week</span>
              </div>
              <div className="flex items-end justify-between gap-2 h-16">
                {[40, 65, 45, 80, 60, 90, 75].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-lg transition-all duration-700" style={{ height: inView ? `${h}%` : "0%", background: `linear-gradient(to top, #10b981, #34d399)`, transitionDelay: `${600 + i * 50}ms`, opacity: 0.7 + i * 0.04 }} />
                ))}
              </div>
              <div className="flex justify-between mt-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                  <div key={d} className="flex-1 text-center text-xs" style={{ color: textS }}>{d}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Stats & Testimonials ─────────────────────────────────────────────────────
const testimonials = [
  { name: "Sarah K.", role: "Yoga Instructor", avatar: "🧘‍♀️", rating: 5, quote: "WellNest completely transformed my fitness routine. The AI coach is like having a personal trainer 24/7!" },
  { name: "Marcus R.", role: "Software Engineer", avatar: "👨‍💻", rating: 5, quote: "Lost 10kg in 3 months using the WellNest AI Coach. The nutrition tracking is incredibly detailed." },
  { name: "Priya S.", role: "Student", avatar: "👩‍🎓", rating: 5, quote: "I love how everything is connected — sleep, water, workouts. WellNest keeps me accountable every day." },
  { name: "James O.", role: "Marathon Runner", avatar: "🏃‍♂️", rating: 5, quote: "The training plans adapt to my schedule. Best health app I've ever used, period." },
];

const Testimonials = ({ dark }) => {
  const { ref, inView } = useInView();
  const [active, setActive] = useState(0);
  const users = useCountUp(10000, 2000, inView);
  const pct = useCountUp(95, 2000, inView);
  const workouts = useCountUp(500000, 2000, inView);
  const bg = dark ? "#0d1117" : "#fafafa";
  const card = dark ? "#111827" : "#fff";
  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const textP = dark ? "#fff" : "#0a0a0a";
  const textS = dark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)";

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % testimonials.length), 4000);
    return () => clearInterval(t);
  }, []);

  const fmt = n => n >= 1000 ? `${(n / 1000).toFixed(0)}K+` : `${n}%`;

  return (
    <section ref={ref} className="py-28 px-6" style={{ background: bg }}>
      <div className="max-w-7xl mx-auto">
        {/* Animated stats */}
        <div className={`grid grid-cols-3 gap-8 mb-20 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {[[users, "Active Users", "👥"], [pct, "Goal Achievement", "🎯"], [workouts, "Workouts Logged", "💪"]].map(([n, l, icon], i) => (
            <div key={l} className="text-center">
              <div className="text-5xl lg:text-7xl font-black mb-2" style={{ background: "linear-gradient(135deg, #10b981, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {icon} {i === 1 ? `${n}%` : fmt(n)}
              </div>
              <div className="text-lg font-semibold" style={{ color: textS }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black" style={{ fontFamily: "'Georgia', serif", color: textP }}>Loved by Thousands</h2>
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div key={t.name} onClick={() => setActive(i)} className="rounded-3xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
              style={{ background: card, border: `2px solid ${i === active ? "#10b981" : border}`, boxShadow: i === active ? "0 8px 30px rgba(16,185,129,0.2)" : (dark ? "0 2px 20px rgba(0,0,0,0.3)" : "0 2px 20px rgba(0,0,0,0.06)") }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)" }}>{t.avatar}</div>
                <div>
                  <div className="font-black" style={{ color: textP }}>{t.name}</div>
                  <div className="text-sm" style={{ color: textS }}>{t.role}</div>
                </div>
                <div className="ml-auto flex gap-0.5">{Array(t.rating).fill(0).map((_, i) => <span key={i} style={{ color: "#f59e0b" }}>★</span>)}</div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: textS }}>"{t.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Screenshots Section ──────────────────────────────────────────────────────
const screenshots = [
  { title: "Comprehensive Dashboard", desc: "All your health metrics beautifully visualized. Track trends, set goals, and celebrate progress in one place.", icon: "📊", color: "#6366f1", side: "right" },
  { title: "Workout Tracker", desc: "Log every exercise with detailed sets, reps, and weights. Access a library of 1000+ guided exercises.", icon: "🏋️", color: "#10b981", side: "left" },
  { title: "AI Coach Chat", desc: "Chat with your personal AI coach for real-time feedback, motivation, and adaptive workout plans.", icon: "🤖", color: "#8b5cf6", side: "right" },
  { title: "Nutrition Logging", desc: "Scan barcodes, log meals, and track macros effortlessly. AI-powered meal suggestions tailored to your goals.", icon: "🥗", color: "#f59e0b", side: "left" },
];

const ScreenshotsSection = ({ dark }) => {
  const bg = dark ? "#0a0a0a" : "#f8fafc";
  const card = dark ? "#111827" : "#fff";
  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const textP = dark ? "#fff" : "#0a0a0a";
  const textS = dark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)";

  return (
    <section className="py-28 px-6" style={{ background: bg }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-black mb-4" style={{ fontFamily: "'Georgia', serif", color: textP }}>
            See WellNest in{" "}
            <span style={{ background: "linear-gradient(135deg, #10b981, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Action</span>
          </h2>
          <p className="text-xl" style={{ color: textS }}>Every feature thoughtfully designed for your journey</p>
        </div>
        <div className="flex flex-col gap-20">
          {screenshots.map((s, i) => {
            const { ref, inView } = useInView();
            const isLeft = s.side === "left";
            return (
              <div key={s.title} ref={ref} className={`grid lg:grid-cols-2 gap-12 items-center ${isLeft ? "" : "lg:grid-flow-col-dense"}`}>
                <div className={`transition-all duration-700 ${inView ? "opacity-100 translate-x-0" : `opacity-0 ${isLeft ? "-translate-x-8" : "translate-x-8"}`} ${isLeft ? "" : "lg:col-start-2"}`}>
                  <div className="inline-block px-3 py-1.5 rounded-full text-xs font-bold mb-4" style={{ background: `${s.color}18`, color: s.color, border: `1px solid ${s.color}30` }}>
                    {s.icon} Feature
                  </div>
                  <h3 className="text-3xl font-black mb-4" style={{ fontFamily: "'Georgia', serif", color: textP }}>{s.title}</h3>
                  <p className="text-lg leading-relaxed mb-6" style={{ color: textS }}>{s.desc}</p>
                  <button className="px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-105"
                    style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}cc)`, boxShadow: `0 6px 20px ${s.color}40` }}>
                    Explore Feature →
                  </button>
                </div>
                <div className={`transition-all duration-700 delay-200 ${inView ? "opacity-100 translate-x-0" : `opacity-0 ${isLeft ? "translate-x-8" : "-translate-x-8"}`} ${isLeft ? "" : "lg:col-start-1 lg:row-start-1"}`}>
                  <div className="rounded-3xl p-8 flex items-center justify-center h-64 lg:h-80" style={{ background: `linear-gradient(135deg, ${s.color}18, ${s.color}08)`, border: `2px solid ${s.color}20`, boxShadow: `0 20px 60px ${s.color}20` }}>
                    <div className="text-center">
                      <div className="text-8xl mb-4">{s.icon}</div>
                      <div className="text-xl font-black" style={{ color: s.color }}>{s.title}</div>
                      <div className="text-sm mt-1" style={{ color: textS }}>Interactive Preview</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ─── CTA ──────────────────────────────────────────────────────────────────────
const CTASection = ({ dark }) => {
  const navigate = useNavigate();
  const { ref, inView } = useInView();
  return (
    <section ref={ref} className="py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0a1628 0%, #0d2919 40%, #0a1628 100%)" }} />
      <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(ellipse at 30% 50%, #10b981 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, #6366f1 0%, transparent 60%)" }} />
      <div className={`relative max-w-4xl mx-auto text-center transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6" style={{ background: "rgba(16,185,129,0.2)", color: "#34d399", border: "1px solid rgba(16,185,129,0.3)" }}>
          🚀 Join 10,000+ members
        </div>
        <h2 className="text-5xl lg:text-7xl font-black text-white mb-6" style={{ fontFamily: "'Georgia', serif" }}>
          Start Your Fitness{" "}
          <span style={{ background: "linear-gradient(135deg, #10b981, #34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Journey Today
          </span>
        </h2>
        <p className="text-xl mb-10" style={{ color: "rgba(255,255,255,0.7)" }}>
          Join thousands who have already transformed their lives with WellNest. Free forever for core features.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate("/register")}
            className="px-10 py-5 rounded-2xl font-black text-xl text-white transition-all hover:scale-105 active:scale-95"
            style={{ background: "linear-gradient(135deg, #10b981, #06b6d4)", boxShadow: "0 10px 40px rgba(16,185,129,0.5)" }}>
            Create Free Account
          </button>
          <a href="#features" className="px-10 py-5 rounded-2xl font-black text-xl transition-all hover:scale-105 flex items-center gap-2"
            style={{ border: "2px solid rgba(255,255,255,0.25)", color: "#fff", background: "rgba(255,255,255,0.08)" }}>
            Explore Features ↓
          </a>
        </div>
        <p className="mt-8 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>No credit card required · Cancel anytime · Free forever plan available</p>
      </div>
    </section>
  );
};

// ─── Footer ───────────────────────────────────────────────────────────────────
const Footer = ({ dark }) => {
  const bg = dark ? "#080808" : "#0a0a0a";
  const textP = "rgba(255,255,255,0.9)";
  const textS = "rgba(255,255,255,0.45)";
  const border = "rgba(255,255,255,0.08)";

  const cols = [
    { title: "Platform", links: ["Dashboard", "Nutrition", "Water Tracker", "Workouts", "AI Coach", "Trainer", "Blogs"] },
    { title: "Company", links: ["About Us", "Careers", "Press", "Blog", "Affiliates"] },
    { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Contact"] },
  ];

  return (
    <footer style={{ background: bg }}>
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-10">
        <div className="grid lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #10b981, #06b6d4)" }}>
                <span className="text-white font-black">W</span>
              </div>
              <span className="font-black text-2xl text-white" style={{ fontFamily: "'Georgia', serif" }}>WellNest</span>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: textS }}>Your all-in-one health & fitness companion. Track, improve, and thrive with AI-powered insights.</p>
            <div>
              <div className="text-sm font-semibold mb-3" style={{ color: textP }}>Stay updated</div>
              <div className="flex gap-2">
                <input type="email" placeholder="your@email.com" className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff" }} />
                <button className="px-5 py-3 rounded-xl text-sm font-bold text-white" style={{ background: "linear-gradient(135deg, #10b981, #06b6d4)" }}>Subscribe</button>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              {["𝕏", "📸", "💼", "⌚"].map((icon, i) => (
                <button key={i} className="w-9 h-9 rounded-lg flex items-center justify-center text-sm transition-all hover:scale-110"
                  style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}>{icon}</button>
              ))}
            </div>
          </div>
          {cols.map(col => (
            <div key={col.title}>
              <div className="text-sm font-black mb-4" style={{ color: textP }}>{col.title}</div>
              <ul className="space-y-3">
                {col.links.map(l => (
                  <li key={l}><a href="#" className="text-sm transition-colors hover:text-emerald-400" style={{ color: textS }}>{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 gap-4" style={{ borderTop: `1px solid ${border}` }}>
          <p className="text-sm" style={{ color: textS }}>© 2025 WellNest. All rights reserved.</p>
          <p className="text-sm" style={{ color: textS }}>Made with 💚 for a healthier world</p>
        </div>
      </div>
    </footer>
  );
};

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function WellNest() {
  const { dark, toggle } = useTheme();
  return (
    <div style={{ fontFamily: "'Trebuchet MS', sans-serif", minHeight: "100vh" }}>
      <Navbar dark={dark} toggle={toggle} />
      <Hero dark={dark} />
      <FeatureGrid dark={dark} />
      <GoalSetter dark={dark} />
      <DashboardPreview dark={dark} />
      <Testimonials dark={dark} />
      <ScreenshotsSection dark={dark} />
      <CTASection dark={dark} />
      <Footer dark={dark} />
    </div>
  );
}