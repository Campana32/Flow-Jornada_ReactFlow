"use client";

import { Handle, Position, useViewport, type NodeProps } from "@xyflow/react";
import { useContext } from "react";
import { CanvasCtx } from "../CanvasContext";
import TesteABCardNode, { type TesteABCardNodeData } from "../TesteABCardNode";

export interface FlowTesteABNodeData {
  nodeId: string;
  rawData?: TesteABCardNodeData;
}

export default function FlowTesteABNode({ data }: NodeProps) {
  const ctx = useContext(CanvasCtx)!;
  const { zoom } = useViewport();
  const d = data as unknown as FlowTesteABNodeData;

  return (
    <div>
      <Handle type="target" position={Position.Left} id="in" style={{ opacity: 0, pointerEvents: "none" }} />
      <TesteABCardNode
        initialData={d.rawData}
        style={{ position: "relative", top: 0, transform: "none" }}
        forceCollapsed={zoom <= 0.6}
        onEdit={() => ctx.onEditNode(d.nodeId)}
        onRemove={() => ctx.onRemoveNode(d.nodeId)}
      />
      <Handle type="source" position={Position.Right} id="out" style={{ opacity: 0, pointerEvents: "none" }} />
    </div>
  );
}
