import { Handle, Position } from "reactflow";
import StatusDot from "./StatusDot";

const RISK_BORDER = {
  low: "border-border",
  medium: "border-signal-pending",
  high: "border-signal-blocked",
};

export default function ActionNode({ data }) {
  return (
    <div
      className={`bg-panel-raised/90 backdrop-blur-sm border ${RISK_BORDER[data.risk] ?? "border-border"} rounded-lg px-3 py-2 w-56 shadow-[0_0_16px_-4px_rgba(45,217,255,0.3)]`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-dim !border-0 !w-2 !h-2"
      />
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-mono-data text-muted">{data.id}</span>
        <StatusDot state={data.state} pulse={data.state === "live"} />
      </div>
      <div className="text-sm font-medium leading-snug">{data.label}</div>
      {data.risk && (
        <div className="text-[10px] text-muted mt-1 capitalize">
          {data.risk} risk
        </div>
      )}
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-dim !border-0 !w-2 !h-2"
      />
    </div>
  );
}
