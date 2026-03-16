import { NavLink } from "react-router-dom";
import { FiCalendar } from "react-icons/fi";
import { FiCpu } from "react-icons/fi";
import {
  FiHome,
  FiActivity,
  FiMoon,
  FiCoffee,
  FiDroplet,
  FiUsers,
  FiMenu
} from "react-icons/fi";

export default function Sidebar({ collapsed, setCollapsed }) {

  const linkClass =
    "flex items-center gap-3 text-slate-400 px-3 py-2 rounded-md transition hover:bg-slate-800 hover:text-white";

  const activeClass =
    "bg-slate-800 text-emerald-400";

  return (
    <div
     className={`
  bg-[var(--bg-sidebar)]
  border-r border-[var(--border)]
  h-screen
  flex flex-col
  gap-5
  p-5
  transition-all duration-300
  ${collapsed ? "w-[70px]" : "w-[240px]"}
`}
    >

      {/* HEADER */}

      <div className="flex items-center gap-2">

        <button onClick={() => setCollapsed(!collapsed)}>
  <FiMenu size={20} className="text-[var(--text-primary)]" />
</button>

{!collapsed && (
  <h2 className="font-semibold text-[var(--text-primary)]">
    WellNest
  </h2>
)}

      </div>

      {/* NAVIGATION */}

      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : ""}`
        }
      >
        <FiHome />
        {!collapsed && <span>Dashboard</span>}
      </NavLink>


      <NavLink
        to="/workouts"
        className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : ""}`
        }
      >
        <FiActivity />
        {!collapsed && <span>Workouts</span>}
      </NavLink>


      <NavLink
        to="/sleep"
        className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : ""}`
        }
      >
        <FiMoon />
        {!collapsed && <span>Sleep</span>}
      </NavLink>


      <NavLink
        to="/nutrition"
        className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : ""}`
        }
      >
        <FiCoffee />
        {!collapsed && <span>Nutrition</span>}
      </NavLink>


      <NavLink
        to="/water"
        className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : ""}`
        }
      >
        <FiDroplet />
        {!collapsed && <span>Hydration</span>}
      </NavLink>


      {/* TRAINERS PAGE */}

      <NavLink
        to="/trainers"
        className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : ""}`
        }
      >
        <FiUsers />
        {!collapsed && <span>Trainers</span>}
      </NavLink>


      {/* NEW SESSIONS PAGE */}

      <NavLink
        to="/sessions"
        className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : ""}`
        }
      >
        <FiCalendar />
        {!collapsed && <span>My Sessions</span>}
      </NavLink>
      <NavLink
  to="/ai-coach"
  className={({ isActive }) =>
    `${linkClass} ${isActive ? activeClass : ""}`
  }
>
  <FiCpu />
  {!collapsed && <span>AI Coach</span>}
</NavLink>


      {/* BLOG PAGE */}

      <NavLink
        to="/blogs"
        className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : ""}`
        }
      >
        <FiCoffee />
        {!collapsed && <span>Blog</span>}
      </NavLink>

    </div>
        
  );
  
}