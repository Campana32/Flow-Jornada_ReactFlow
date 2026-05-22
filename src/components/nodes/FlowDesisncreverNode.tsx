"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useContext } from "react";
import { CanvasCtx } from "../CanvasContext";
import DesisncreverCardNode from "../DesisncreverCardNode";

export interface FlowDesisncreverNodeData {
  nodeId: string;
  branchCtx?: { parentNodeId: string; branchIdx: number };
}

export default function FlowDesisncreverNode({ data }: NodeProps) {
  const ctx = useContext(CanvasCtx)!;
  const d = data as unknown as FlowDesisncreverNodeData;

  return (
    <div>
      <Handle type="target" position={Position.Left} id="in" style={{ opacity: 0, pointerEvents: "none" }} />
      <DesisncreverCardNode
        style={{ position: "relative", top: 0, transform: "none" }}
        onRemove={() => ctx.onRemoveNode(d.nodeId)}
      />
    </div>
  );
}
