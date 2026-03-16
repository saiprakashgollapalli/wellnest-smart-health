import { useEffect, useState } from "react";
import { analyticsService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi";

export default function InsightPanel() {
  const [data, setData] = useState(null);
  const { theme, toggleTheme } = useTheme();

  const isProfileComplete =
    data?.bmi || data?.age;

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  

  useEffect(() => {
    analyticsService.getDashboard().then(res => {
      setData(res.data);
    });
  }, []);

  return (
    <div className="bg-[var(--bg-main)] p-5 border-l border-[var(--border)]">

      <div className="bg-[var(--bg-card)] p-7 rounded-[20px] text-center shadow-[0_0_25px_rgba(16,185,129,0.08)] transition duration-300 hover:-translate-y-1 relative">

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="absolute top-3 right-3 p-2 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] hover:scale-105 transition"
        >
          {theme === "dark" ? <FiSun /> : <FiMoon />}
        </button>

        {/* Avatar */}
        <div className="w-[90px] h-[90px] mx-auto mb-3 rounded-full bg-gradient-to-br from-[#10b981] to-[#06b6d4] flex items-center justify-center text-[2rem] font-bold text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]">
          {user?.name?.charAt(0)}
        </div>

        {/* Name */}
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
          {user?.name}
        </h3>

        {/* Role */}
        <p className="text-[var(--text-secondary)] text-[0.85rem]">
          WellNest Member
        </p>

        {/* Last Updated */}
        <p className="text-[var(--text-muted)] text-[0.75rem] mb-[15px]">
          Last updated today
        </p>

        {/* Edit Profile */}
        <button
          onClick={() => navigate("/profile-setup")}
          className="w-full p-[10px] rounded-[8px] bg-gradient-to-br from-[#2563eb] to-[#3b82f6] text-white mb-[20px] transition duration-300 hover:opacity-90"
        >
          {isProfileComplete ? "✏ Edit Profile" : "⚡ Complete Profile"}
        </button>

        {/* Health Score */}
        <div className="flex justify-between mb-[15px] text-sm">

          <div className="flex flex-col text-left">
            <span className="text-[var(--text-secondary)]">
              Health Score
            </span>

            <strong className="text-[var(--text-primary)] text-base">
              {data?.healthScore || 0}%
            </strong>
          </div>

        </div>

        {/* Logout */}
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="w-full p-[8px] rounded-[8px] bg-[#374151] text-white hover:bg-[#4b5563] transition"
        >
          Logout
        </button>

      </div>

    </div>
  );
}