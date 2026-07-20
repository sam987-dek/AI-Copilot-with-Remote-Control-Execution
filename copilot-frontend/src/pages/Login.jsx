import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import AICore from "../components/AICore";

const BOOT_LINES = [
  "INITIALIZING CORE...",
  "LOADING SAFETY LAYER...",
  "CALIBRATING ACTION GRAPH ENGINE...",
  "AWAITING OPERATOR CREDENTIALS",
];

export default function Login() {
  const [booted, setBooted] = useState(false);
  const [lineIndex, setLineIndex] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (lineIndex >= BOOT_LINES.length) {
      const t = setTimeout(() => setBooted(true), 300);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setLineIndex((i) => i + 1), 420);
    return () => clearTimeout(t);
  }, [lineIndex]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-bg overflow-hidden">
      <div className="absolute inset-0 hud-grid opacity-60" />
      <div className="scan-sweep" />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <AICore
          state={booted ? "idle" : "pending"}
          speed={booted ? 1 : 2.2}
          className="w-[560px] h-[560px] opacity-70"
        />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <AnimatePresence mode="wait">
          {!booted ? (
            <motion.div
              key="boot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-mono-data text-xs text-accent space-y-2"
            >
              {BOOT_LINES.slice(0, lineIndex).map((line, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-signal-live">✓</span>
                  <span className="text-muted">{line}</span>
                </div>
              ))}
              {lineIndex < BOOT_LINES.length && (
                <div className="flex items-center gap-2">
                  <span className="text-accent blink-caret">▸</span>
                  <span>{BOOT_LINES[lineIndex]}</span>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-8 text-center">
                <div className="font-display text-lg font-bold tracking-widest text-glow">
                  AI COPILOT
                </div>
                <div className="text-[11px] text-muted font-mono-data mt-1 tracking-wide">
                  OPERATOR AUTHENTICATION REQUIRED
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-4 hud-panel hud-glow rounded-lg p-6"
              >
                <div>
                  <label className="block text-[11px] text-muted mb-1.5 tracking-wide font-mono-data">
                    USERNAME
                  </label>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-panel-raised border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-accent focus:hud-glow transition-shadow"
                    autoComplete="username"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-muted mb-1.5 tracking-wide font-mono-data">
                    PASSWORD
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-panel-raised border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-accent focus:hud-glow transition-shadow"
                    autoComplete="current-password"
                    required
                  />
                </div>

                {error && (
                  <div className="text-xs text-signal-blocked font-mono-data">
                    // {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-accent text-bg font-display font-semibold text-sm tracking-widest rounded-md py-2.5 hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? "AUTHENTICATING…" : "SIGN IN"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
