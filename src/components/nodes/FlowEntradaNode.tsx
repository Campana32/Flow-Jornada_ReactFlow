"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useContext } from "react";
import { CanvasCtx } from "../CanvasContext";
import EntradaCard from "../EntradaCard";

export default function FlowEntradaNode({ data }: NodeProps) {
  const ctx = useContext(CanvasCtx)!;
  const d = data as { savedSegmentacao?: string };

  return (
    <div>
      <Handle type="target" position={Position.Left} id="in" style={{ opacity: 0, pointerEvents: "none" }} />
      <EntradaCard
        onConfigure={ctx.onConfigure}
        savedSegmentacao={d.savedSegmentacao}
        noPosition
      />
      <Handle type="source" position={Position.Right} id="out" style={{ opacity: 0, pointerEvents: "none" }} />
    </div>
  );
}
