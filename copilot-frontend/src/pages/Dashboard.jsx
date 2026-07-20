import { motion } from "framer-motion";
import StatusDot from "../components/StatusDot";
import AICore from "../components/AICore";

const MOCK_TASKS = [
  {
    id: "t-104",
    intent: "Restart nginx on staging-02",
    state: "live",
    risk: "low",
  },
  {
    id: "t-103",
    intent: "Rotate API keys for billing service",
    state: "pending",
    risk: "medium",
  },
  {
    id: "t-102",
    intent: "Delete unused Docker volumes",
    state: "blocked",
    risk: "high",
  },
  {
    id: "t-101",
    intent: "Deploy frontend build to prod",
    state: "idle",
    risk: "low",
  },
];

function Card({ label, value, tone, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="hud-panel rounded-lg p-4"
    >
      <div className="text-[11px] text-muted tracking-wide font-mono-data mb-1">
        {label}
      </div>
      <div className={`text-2xl font-display font-bold ${tone ?? "text-text"}`}>
        {value}
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-lg font-bold tracking-wide text-glow">
          SYSTEM OVERVIEW
        </h1>
        <p className="text-sm text-muted mt-1">
          Live state of active and recent copilot tasks.
        </p>
      </div>

      <div className="relative hud-panel rounded-lg h-64 flex items-center justify-center overflow-hidden">
        <div className="scan-sweep" />
        <AICore state="live" speed={1} className="w-64 h-64" />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
          <div className="text-[11px] text-muted font-mono-data tracking-widest">
            CORE STATUS
          </div>
          <div className="text-sm font-display font-semibold text-signal-live tracking-wide">
            OPERATIONAL
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card label="RUNNING" value="1" tone="text-signal-live" delay={0.05} />
        <Card
          label="AWAITING APPROVAL"
          value="1"
          tone="text-signal-pending"
          delay={0.1}
        />
        <Card
          label="BLOCKED"
          value="1"
          tone="text-signal-blocked"
          delay={0.15}
        />
        <Card label="COMPLETED TODAY" value="12" delay={0.2} />
      </div>

      <div className="hud-panel rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-border text-sm font-medium tracking-wide font-mono-data text-muted">
          RECENT TASKS
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] text-muted border-b border-border font-mono-data">
              <th className="px-4 py-2 font-normal">TASK</th>
              <th className="px-4 py-2 font-normal">INTENT</th>
              <th className="px-4 py-2 font-normal">RISK</th>
              <th className="px-4 py-2 font-normal">STATE</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_TASKS.map((t) => (
              <tr
                key={t.id}
                className="border-b border-border last:border-0 hover:bg-panel-raised transition-colors"
              >
                <td className="px-4 py-2.5 font-mono-data text-muted">
                  {t.id}
                </td>
                <td className="px-4 py-2.5">{t.intent}</td>
                <td className="px-4 py-2.5 capitalize text-muted">{t.risk}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <StatusDot state={t.state} pulse={t.state === "live"} />
                    <span className="capitalize text-muted">{t.state}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
