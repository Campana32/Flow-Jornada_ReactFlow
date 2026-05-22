"use client";

import { Handle, Position, useViewport, type NodeProps } from "@xyflow/react";
import { useContext } from "react";
import { CanvasCtx } from "../CanvasContext";
import JornadaCardNode, { type JornadaCardNodeData } from "../JornadaCardNode";
import type { SavedNode } from "../../lib/flowUtils";

export interface FlowJornadaNodeData {
  nodeId: string | null;
  jornadaData?: JornadaCardNodeData;
  isNew?: boolean;
  branchCtx?: { parentNodeId: string; branchIdx: number };
}

export default function FlowJornadaNode({ data }: NodeProps) {
  const ctx = useContext(CanvasCtx)!;
  const { zoom } = useViewport();
  const d = data as unknown as FlowJornadaNodeData;

  const handleConfirm = (raw: JornadaCardNodeData) => {
    if (d.isNew) {
      if (d.branchCtx) {
        ctx.onBranchJornadaConfirm(d.branchCtx.parentNodeId, d.branchCtx.branchIdx, raw);
      } else {
        ctx.onJornadaConfirm(raw);
      }
    } else if (d.nodeId) {
      if (d.branchCtx) {
        ctx.onBranchInlineUpdate(
          d.branchCtx.parentNodeId,
          d.branchCtx.branchIdx,
          d.nodeId,
          (n: SavedNode) => ({
            ...n,
            data: {
              ...n.data,
              fields: [{ key: "Redirecionar para:", value: raw.jornada }],
              jornadaData: raw,
            },
          }),
        );
      } else {
        ctx.onJornadaUpdate(d.nodeId, raw);
      }
    }
  };

  const handleCancel = () => {
    if (d.isNew) {
      if (d.branchCtx) {
        ctx.onPendingBranchCancel();
      } else {
        ctx.onJornadaCancel();
      }
    }
  };

  const handleRemove = () => {
    if (d.isNew) {
      if (d.branchCtx) {
        ctx.onPendingBranchCancel();
      } else {
        ctx.onJornadaCancel();
      }
    } else if (d.nodeId) {
      ctx.onRemoveNode(d.nodeId);
    }
  };

  return (
    <div>
      <Handle type="target" position={Position.Left} id="in" style={{ opacity: 0, pointerEvents: "none" }} />
      <JornadaCardNode
        initialData={d.jornadaData}
        isNew={d.isNew}
        style={{ position: "relative", top: 0, transform: "none" }}
        forceCollapsed={zoom <= 0.6}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        onRemove={handleRemove}
      />
      <Handle type="source" position={Position.Right} id="out" style={{ opacity: 0, pointerEvents: "none" }} />
    </div>
  );
}
