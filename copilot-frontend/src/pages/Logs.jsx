const MOCK_LOGS = [
  {
    t: "14:02:11",
    level: "info",
    msg: "intent parsed → plan generated (5 steps)",
  },
  {
    t: "14:02:12",
    level: "info",
    msg: "action A1 executed: check nginx status → running",
  },
  {
    t: "14:02:13",
    level: "warn",
    msg: "action A4 flagged high risk, awaiting approval",
  },
  {
    t: "14:02:40",
    level: "error",
    msg: "action A2 failed: permission denied (sudo required)",
  },
];

const LEVEL_COLOR = {
  info: "text-muted",
  warn: "text-signal-pending",
  error: "text-signal-blocked",
};

export default function Logs() {
  return (
    <div>
      <h1 className="font-display text-lg font-bold tracking-wide text-glow mb-4">
        EXECUTION LOGS
      </h1>
      <div className="hud-panel rounded-lg p-4 font-mono-data text-xs space-y-1.5">
        {MOCK_LOGS.map((l, i) => (
          <div key={i} className="flex gap-3">
            <span className="text-dim">{l.t}</span>
            <span className={`${LEVEL_COLOR[l.level]} uppercase w-12`}>
              {l.level}
            </span>
            <span className="text-text">{l.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
