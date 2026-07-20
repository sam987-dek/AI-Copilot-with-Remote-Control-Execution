import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function TaskInput() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Samarth's /intent -> /plan -> /graph pipeline
      const { data } = await api.post("/intent", { text: prompt });
      navigate("/graph", { state: { graphId: data.graph_id } });
    } catch (err) {
      setError(err.response?.data?.detail ?? "Could not parse intent");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-lg font-bold tracking-wide text-glow">
        NEW TASK
      </h1>
      <p className="text-sm text-muted mt-1 mb-6">
        Describe what you want the copilot to do in plain language.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Restart the nginx service on staging-02 and confirm it's healthy"
          rows={5}
          className="w-full hud-panel rounded-lg px-4 py-3 text-sm outline-none focus:hud-glow focus:border-accent resize-none transition-shadow"
          required
        />

        {error && (
          <div className="text-xs text-signal-blocked font-mono-data">
            // {error}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="bg-accent text-bg font-display font-semibold text-sm tracking-widest rounded-md px-4 py-2.5 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "PARSING INTENT…" : "GENERATE PLAN"}
          </button>
          <span className="text-xs text-muted font-mono-data">
            → intent parser → planner → action graph
          </span>
        </div>
      </form>
    </div>
  );
}
