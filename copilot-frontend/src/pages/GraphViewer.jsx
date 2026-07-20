import { useCallback, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import "reactflow/dist/style.css";
import ActionNode from "../components/ActionNode";

const nodeTypes = { action: ActionNode };

const MOCK_NODES = [
  {
    id: "n1",
    type: "action",
    position: { x: 0, y: 100 },
    data: { id: "A1", label: "Check nginx status", state: "live", risk: "low" },
  },
  {
    id: "n2",
    type: "action",
    position: { x: 280, y: 0 },
    data: {
      id: "A2",
      label: "Stop nginx service",
      state: "idle",
      risk: "medium",
    },
  },
  {
    id: "n3",
    type: "action",
    position: { x: 280, y: 200 },
    data: {
      id: "A3",
      label: "Clear stale PID file",
      state: "idle",
      risk: "medium",
    },
  },
  {
    id: "n4",
    type: "action",
    position: { x: 560, y: 100 },
    data: {
      id: "A4",
      label: "Start nginx service",
      state: "pending",
      risk: "high",
    },
  },
  {
    id: "n5",
    type: "action",
    position: { x: 840, y: 100 },
    data: {
      id: "A5",
      label: "Verify HTTP 200 on /health",
      state: "idle",
      risk: "low",
    },
  },
];

const MOCK_EDGES = [
  { id: "e1-2", source: "n1", target: "n2", animated: true },
  { id: "e1-3", source: "n1", target: "n3", animated: true },
  { id: "e2-4", source: "n2", target: "n4" },
  { id: "e3-4", source: "n3", target: "n4" },
  { id: "e4-5", source: "n4", target: "n5" },
];

const edgeDefaults = {
  style: { stroke: "#23282d" },
};

export default function GraphViewer() {
  const [nodes, setNodes] = useState(MOCK_NODES);
  const [edges, setEdges] = useState(
    MOCK_EDGES.map((e) => ({ ...edgeDefaults, ...e })),
  );
  const [selected, setSelected] = useState(null);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );
  const onNodeClick = useCallback((_, node) => setSelected(node), []);

  const pendingNode = useMemo(
    () => nodes.find((n) => n.data.state === "pending"),
    [nodes],
  );

  function resolvePending(approve) {
    if (!pendingNode) return;
    setNodes((nds) =>
      nds.map((n) =>
        n.id === pendingNode.id
          ? { ...n, data: { ...n.data, state: approve ? "live" : "blocked" } }
          : n,
      ),
    );
  }

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-lg font-bold tracking-wide text-glow">
            ACTION GRAPH
          </h1>
          <p className="text-sm text-muted mt-1">Restart nginx on staging-02</p>
        </div>
        {pendingNode && (
          <div className="flex items-center gap-2 hud-panel rounded-lg px-3 py-2 border-signal-pending/40">
            <span className="text-xs text-muted font-mono-data">
              APPROVAL NEEDED:{" "}
              <span className="text-text">{pendingNode.data.label}</span>
            </span>
            <button
              onClick={() => resolvePending(true)}
              className="text-xs bg-signal-live text-bg font-display font-semibold tracking-wide rounded px-2.5 py-1 hover:opacity-90"
            >
              APPROVE
            </button>
            <button
              onClick={() => resolvePending(false)}
              className="text-xs bg-signal-blocked text-bg font-display font-semibold tracking-wide rounded px-2.5 py-1 hover:opacity-90"
            >
              REJECT
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 hud-panel rounded-lg overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#23282d" gap={20} />
          <Controls showInteractive={false} />
          <MiniMap
            pannable
            zoomable
            maskColor="rgba(10,12,14,0.7)"
            style={{ background: "#131619" }}
          />
        </ReactFlow>
      </div>

      {selected && (
        <div className="text-xs text-muted font-mono-data">
          selected: {selected.data.id} — {selected.data.label}
        </div>
      )}
    </div>
  );
}
