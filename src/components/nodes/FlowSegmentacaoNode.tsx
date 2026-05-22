"use client";

import { Handle, Position, useViewport, type NodeProps } from "@xyflow/react";
import { useContext } from "react";
import { CanvasCtx } from "../CanvasContext";
import SegmentacaoCardNode from "../SegmentacaoCardNode";
import type { SegmentacaoNoNodeData } from "../SegmentacaoNoPanel";

export interface FlowSegmentacaoNodeData {
  nodeId: string;
  branchIdx: number;
  rawData?: SegmentacaoNoNodeData;
  priority: number;
  isFirst: boolean;
  hasNegativa: boolean;
  lastNonNegBi: number;
  openBranchDropdownKey: string | null;
}

export default function FlowSegmentacaoNode({ data }: NodeProps) {
  const ctx = useContext(CanvasCtx)!;
  const { zoom } = useViewport();
  const d = data as unknown as FlowSegmentacaoNodeData;

  const handleEdit = d.isFirst
    ? () => ctx.onEditNode(d.nodeId)
    : () => ctx.onEditSegBranch(d.nodeId, d.branchIdx);

  const handleRemove = d.isFirst
    ? () => ctx.onRemoveNode(d.nodeId)
    : undefined;

  return (
    <div>
      <Handle type="target" position={Position.Left} id="in" style={{ opacity: 0, pointerEvents: "none" }} />
      <Handle type="target" position={Position.Top} id="branch-chain-in" style={{ opacity: 0, pointerEvents: "none", left: "50%" }} />
      <SegmentacaoCardNode
        initialData={d.rawData}
        style={{ position: "relative", top: 0, transform: "none" }}
        forceCollapsed={zoom <= 0.6}
        priority={d.priority}
        onEdit={handleEdit}
        onRemove={handleRemove}
      />
      <Handle type="source" position={Position.Right} id="out" style={{ opacity: 0, pointerEvents: "none" }} />
      <Handle type="source" position={Position.Bottom} id="branch-chain" style={{ opacity: 0, pointerEvents: "none", left: "50%" }} />
    </div>
  );
}
