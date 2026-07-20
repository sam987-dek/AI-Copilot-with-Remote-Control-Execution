import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StatusDot from "../components/StatusDot";
import AICore from "../components/AICore";

const NAV_ITEMS = [
  { to: "/", label: "Overview", end: true },
  { to: "/task", label: "New Task" },
  { to: "/graph", label: "Action Graph" },
  { to: "/logs", label: "Logs" },
];

function NavItem({ to, label, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `block px-3 py-2 rounded-md text-sm font-medium tracking-wide transition-colors border-l-2 ${
          isActive
            ? "bg-panel-raised text-text border-accent"
            : "text-muted hover:text-text hover:bg-panel-raised border-transparent"
        }`
      }
    >
      {label}
    </NavLink>
  );
}

export default function DashboardLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="relative flex h-screen bg-bg text-text overflow-hidden">
      <div className="absolute inset-0 hud-grid opacity-30 pointer-events-none" />

      <aside className="relative z-10 w-56 shrink-0 border-r border-border flex flex-col bg-bg/60 backdrop-blur-sm">
        <div className="px-4 py-4 border-b border-border flex items-center gap-3">
          <AICore state="idle" speed={0.8} className="w-9 h-9 shrink-0" />
          <div>
            <div className="font-display text-xs font-bold tracking-widest text-glow">
              AI COPILOT
            </div>
            <div className="text-[10px] text-muted font-mono-data mt-0.5">
              control room
            </div>
          </div>
        </div>
        <nav className="flex-1 px-2 py-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>
        <div className="px-3 py-3 border-t border-border">
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="w-full text-left text-xs text-muted hover:text-text px-3 py-2 rounded-md hover:bg-panel-raised transition-colors font-mono-data tracking-wide"
          >
            SIGN OUT
          </button>
        </div>
      </aside>

      <div className="relative z-10 flex-1 flex flex-col min-w-0">
        <header className="h-14 shrink-0 border-b border-border flex items-center justify-between px-6 bg-bg/60 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-sm text-muted">
            <StatusDot state="live" pulse />
            <span className="font-mono-data text-xs tracking-wide">
              EXECUTION MODE: SEMI-AUTONOMOUS
            </span>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
