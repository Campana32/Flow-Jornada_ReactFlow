"use client";

import { Handle, Position, useViewport, type NodeProps } from "@xyflow/react";
import { useContext } from "react";
import { CanvasCtx } from "../CanvasContext";
import GenericNode, { type GenericNodeData } from "../GenericNode";

export interface FlowGenericNodeData {
  nodeId: string;
  nodeData: GenericNodeData;
  branchCtx?: { parentNodeId: string; branchIdx: number };
}

export default function FlowGenericNode({ data }: NodeProps) {
  const ctx = useContext(CanvasCtx)!;
  const { zoom } = useViewport();
  const d = data as unknown as FlowGenericNodeData;

  return (
    <div>
      <Handle type="target" position={Position.Left} id="in" style={{ opacity: 0, pointerEvents: "none" }} />
      <GenericNode
        data={d.nodeData}
        onEdit={() => ctx.onEditNode(d.nodeId, d.branchCtx)}
        style={{ position: "relative", top: 0, transform: "none" }}
        forceCollapsed={zoom <= 0.6}
      />
      <Handle type="source" position={Position.Right} id="out" style={{ opacity: 0, pointerEvents: "none" }} />
    </div>
  );
}
