"use client";

import { Handle, Position, useViewport, type NodeProps } from "@xyflow/react";
import { useContext } from "react";
import { CanvasCtx } from "../CanvasContext";

export interface FlowNegativaNodeData {
  nodeId: string;
}

const COLOR = "#f79f28";
const BAR_W = 324;

export default function FlowNegativaNode({ data }: NodeProps) {
  const ctx = useContext(CanvasCtx)!;
  const { zoom } = useViewport();
  const d = data as unknown as FlowNegativaNodeData;
  const collapsed = zoom <= 0.6;

  return (
    <div>
      <Handle type="target" position={Position.Top} id="branch-chain-in" style={{ opacity: 0, pointerEvents: "none", left: "50%" }} />
      <Handle type="target" position={Position.Left} id="in" style={{ opacity: 0, pointerEvents: "none" }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
        <div style={{ display: "flex", alignItems: "center", position: "relative", zIndex: 2 }}>
          <div style={{
            width: 44, height: 44, background: COLOR, borderRadius: 8,
            border: "2px solid white", display: "flex", alignItems: "center",
            justifyContent: "center", marginRight: -16, zIndex: 2, flexShrink: 0,
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z" />
            </svg>
          </div>
          <div style={{
            width: BAR_W, background: COLOR,
            borderRadius: collapsed ? 8 : "8px 8px 0 0",
            padding: "10px 8px 10px 26px",
            display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 1,
          }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: "white", whiteSpace: "nowrap" }}>Negativa</span>
            <button
              onClick={() => ctx.onRemoveNegativa(d.nodeId)}
              className="nodrag"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 8, background: "transparent", border: "none", cursor: "pointer", flexShrink: 0 }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            </button>
          </div>
        </div>
        {!collapsed && (
          <div style={{
            width: BAR_W, background: "white",
            borderRadius: "0 0 8px 8px", padding: 16, zIndex: 1,
            borderLeft: "1px solid #e8eaec", borderRight: "1px solid #e8eaec", borderBottom: "1px solid #e8eaec",
          }}>
            <p style={{ fontSize: 14, color: "#4c535c", lineHeight: 1.5, margin: 0 }}>
              Caso o usuário não preencha os requisitos das demais segmentações ele continuará por este caminho
            </p>
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Right} id="out" style={{ opacity: 0, pointerEvents: "none" }} />
    </div>
  );
}
