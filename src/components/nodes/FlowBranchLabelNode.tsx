"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";

export interface FlowBranchLabelNodeData {
  label: string;
  color: string;
  percentual: number;
}

export default function FlowBranchLabelNode({ data }: NodeProps) {
  const d = data as unknown as FlowBranchLabelNodeData;

  return (
    <div style={{ pointerEvents: "none", userSelect: "none" }}>
      <Handle type="target" position={Position.Left} id="in" style={{ opacity: 0, pointerEvents: "none" }} />
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        background: `${d.color}20`,
        border: `1px solid ${d.color}60`,
        borderRadius: 99,
        padding: "3px 10px",
        fontSize: 11,
        fontWeight: 600,
        color: "#343b44",
        whiteSpace: "nowrap",
      }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
        {`${d.label} · ${d.percentual}%`}
      </div>
      <Handle type="source" position={Position.Right} id="out" style={{ opacity: 0, pointerEvents: "none" }} />
    </div>
  );
}
