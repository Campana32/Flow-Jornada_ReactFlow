"use client";

import { Handle, Position, useViewport, type NodeProps } from "@xyflow/react";
import { useContext } from "react";
import { CanvasCtx } from "../CanvasContext";
import AguardarCardNode, { type AguardarNodeData } from "../AguardarCardNode";
import type { SavedNode } from "../../lib/flowUtils";

export interface FlowAguardarNodeData {
  nodeId: string | null;
  aguardarData?: AguardarNodeData;
  isNew?: boolean;
  branchCtx?: { parentNodeId: string; branchIdx: number };
}

export default function FlowAguardarNode({ data }: NodeProps) {
  const ctx = useContext(CanvasCtx)!;
  const { zoom } = useViewport();
  const d = data as unknown as FlowAguardarNodeData;

  const handleConfirm = (raw: AguardarNodeData) => {
    if (d.isNew) {
      if (d.branchCtx) {
        ctx.onBranchAguardarConfirm(d.branchCtx.parentNodeId, d.branchCtx.branchIdx, raw);
      } else {
        ctx.onAguardarConfirm(raw);
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
              fields: [{ key: "Duração:", value: `${raw.quantidade} ${raw.unidade}` }],
              aguardarData: raw,
            },
          }),
        );
      } else {
        ctx.onAguardarUpdate(d.nodeId, raw);
      }
    }
  };

  const handleCancel = () => {
    if (d.isNew) {
      if (d.branchCtx) {
        ctx.onPendingBranchCancel();
      } else {
        ctx.onAguardarCancel();
      }
    }
  };

  const handleRemove = () => {
    if (d.isNew) {
      if (d.branchCtx) {
        ctx.onPendingBranchCancel();
      } else {
        ctx.onAguardarCancel();
      }
    } else if (d.nodeId) {
      ctx.onRemoveNode(d.nodeId);
    }
  };

  return (
    <div>
      <Handle type="target" position={Position.Left} id="in" style={{ opacity: 0, pointerEvents: "none" }} />
      <AguardarCardNode
        initialData={d.aguardarData}
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
