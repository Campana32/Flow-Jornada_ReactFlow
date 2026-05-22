"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useContext, useState } from "react";
import { CanvasCtx } from "../CanvasContext";

export interface FlowAddBtnNodeData {
  label: string;
  disabled?: boolean;
  branchCtx?: { parentNodeId: string; branchIdx: number; nestedNodeId?: string; subBranchIdx?: number };
  isAddBranch?: boolean;
  nodeId?: string;
  lastNonNegBi?: number;
  openBranchDropdownKey?: string | null;
  _parentNodeId?: string;
}

function BranchDropdown({
  onSelect,
  onClose,
}: {
  onSelect: (type: "segmentar" | "nao-atende") => void;
  onClose: () => void;
}) {
  return (
    <div
      className="absolute top-full mt-1 left-1/2 -translate-x-1/2 z-50"
      onMouseLeave={onClose}
    >
      <div
        className="rounded-[8px] border border-[#E8EAEC] bg-[#FCFCFC] overflow-hidden"
        style={{ width: 224, boxShadow: "0 4px 6px -2px rgba(16,24,40,0.03), 0 12px 16px -4px rgba(16,24,40,0.08)" }}
      >
        <button
          className="w-full flex items-center gap-3 px-3 py-[11px] hover:bg-[#F5F6F7] transition-colors text-left"
          onMouseDown={(e) => { e.stopPropagation(); onSelect("segmentar"); }}
        >
          <svg width="14" height="12" viewBox="28 17 12 12" fill="none">
            <path d="M35.3327 17.6665L36.8593 19.1932L34.9393 21.1132L35.886 22.0598L37.806 20.1398L39.3327 21.6665V17.6665H35.3327ZM32.666 17.6665H28.666V21.6665L30.1927 20.1398L33.3327 23.2732V28.3332H34.666V22.7265L31.1393 19.1932L32.666 17.6665Z" fill="#6F7680" />
          </svg>
          <span className="text-sm text-[#343B44]">Segmentação</span>
        </button>
        <div className="h-px bg-[#E8EAEC]" />
        <button
          className="w-full flex items-center gap-3 px-3 py-[11px] hover:bg-[#F5F6F7] transition-colors text-left"
          onMouseDown={(e) => { e.stopPropagation(); onSelect("nao-atende"); }}
        >
          <svg width="14" height="14" viewBox="27 54 14 14" fill="none">
            <path d="M34.0007 54.3335C30.3207 54.3335 27.334 57.3202 27.334 61.0002C27.334 64.6802 30.3207 67.6668 34.0007 67.6668C37.6807 67.6668 40.6673 64.6802 40.6673 61.0002C40.6673 57.3202 37.6807 54.3335 34.0007 54.3335ZM34.0007 66.3335C31.0607 66.3335 28.6673 63.9402 28.6673 61.0002C28.6673 58.0602 31.0607 55.6668 34.0007 55.6668C36.9407 55.6668 39.334 58.0602 39.334 61.0002C39.334 63.9402 36.9407 66.3335 34.0007 66.3335ZM30.6673 60.3335H37.334V61.6668H30.6673V60.3335Z" fill="#6F7680" />
          </svg>
          <span className="text-sm text-[#343B44]">Negativa</span>
        </button>
      </div>
    </div>
  );
}

export default function FlowAddBtnNode({ data }: NodeProps) {
  const ctx = useContext(CanvasCtx)!;
  const d = data as unknown as FlowAddBtnNodeData;
  const [dropOpen, setDropOpen] = useState(false);

  const handleClick = () => {
    if (d.isAddBranch && d.nodeId !== undefined) {
      setDropOpen((v) => !v);
    } else if (d.branchCtx) {
      ctx.onOpenAdicionarNoBranch(
        d.branchCtx.parentNodeId,
        d.branchCtx.branchIdx,
        d.branchCtx.nestedNodeId,
        d.branchCtx.subBranchIdx,
      );
    } else {
      ctx.onOpenAdicionarNo();
    }
  };

  const handleSelect = (type: "segmentar" | "nao-atende") => {
    setDropOpen(false);
    if (!d.nodeId) return;
    if (type === "segmentar") {
      ctx.onSelectBranchType(d.nodeId, "segmentar", d.lastNonNegBi ?? 0);
    } else {
      ctx.onAddNegativa(d.nodeId);
    }
  };

  return (
    <div className="nodrag relative">
      <Handle type="target" position={Position.Left} id="in" style={{ opacity: 0, pointerEvents: "none" }} />
      <button
        onClick={handleClick}
        disabled={d.disabled}
        className={`flex items-center justify-center rounded-[8px] px-[12px] py-[8px] text-sm font-semibold whitespace-nowrap transition-colors ${
          d.disabled
            ? "bg-[#f1f2f3] border border-[#e8eaec] text-[#9ca3af] cursor-not-allowed"
            : "bg-[#2724ed] text-white hover:opacity-90 cursor-pointer"
        }`}
      >
        {d.label}
      </button>
      {dropOpen && d.isAddBranch && (
        <BranchDropdown
          onSelect={handleSelect}
          onClose={() => setDropOpen(false)}
        />
      )}
    </div>
  );
}
