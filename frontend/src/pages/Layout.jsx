import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import InsightPanel from "./InsightPanel";

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`grid h-screen transition-all duration-300 ${
        collapsed
          ? "grid-cols-[70px_1fr_300px]"
          : "grid-cols-[240px_1fr_300px]"
      }`}
    >
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content */}
      <main className="p-[30px] overflow-y-auto">
        <Outlet />
      </main>

      {/* Insight Panel */}
      <InsightPanel />
    </div>
  );
}