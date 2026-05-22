"use client";

import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath, type EdgeProps } from "@xyflow/react";
import { useContext } from "react";
import { CanvasCtx } from "../CanvasContext";

export interface FlowEdgeData {
  isEmpty?: boolean;
  showAddBtn?: boolean;
  branchCtx?: { parentNodeId: string; branchIdx: number };
}

export default function FlowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
}: EdgeProps) {
  const ctx = useContext(CanvasCtx)!;
  const d = (data ?? {}) as FlowEdgeData;

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 8,
  });

  const handleAdd = d.showAddBtn
    ? () => {
        if (d.branchCtx) {
          ctx.onOpenAdicionarNoBranch(d.branchCtx.parentNodeId, d.branchCtx.branchIdx);
        } else {
          ctx.onOpenAdicionarNo();
        }
      }
    : null;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: "#9ca3af",
          strokeDasharray: d.isEmpty ? "6 3" : undefined,
          strokeWidth: 2,
        }}
      />
      {handleAdd && (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan"
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
              zIndex: 10,
            }}
          >
            <button
              onClick={handleAdd}
              className="flex items-center justify-center rounded-full bg-[#2724ed] text-white hover:opacity-90 transition-opacity shadow-md"
              style={{ width: 28, height: 28 }}
              title="Inserir nó"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3v10M3 8h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
