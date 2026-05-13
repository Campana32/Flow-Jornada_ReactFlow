"use client";

import { useState } from "react";
import CollapsedPanelBar from "./CollapsedPanelBar";
import { NodeIconImg } from "@/lib/nodeConfig";

export interface DesisncreverNodeData {
  _placeholder?: never;
}

interface DesisncreverPanelProps {
  onClose: () => void;
  onAdd: (data: DesisncreverNodeData) => void;
  onRemove?: () => void;
}

const icons = {
  close: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M15 5L5 15M5 5L15 15" stroke="#12171d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  arrowRight: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 10h12M10 4l6 6-6 6" stroke="#12171d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  nodeIcon: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
      <path d="M14 8c0-2.21-1.79-4-4-4S6 5.79 6 8s1.79 4 4 4 4-1.79 4-4zm3 2v2h6v-2h-6zM2 18v2h16v-2c0-2.66-5.33-4-8-4s-8 1.34-8 4z" />
    </svg>
  ),
};

const COLOR = "#ef4444";

export default function DesisncreverPanel({ onClose, onAdd, onRemove }: DesisncreverPanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <CollapsedPanelBar
        title="Desisncrever"
        color="#ef4444"
        icon={<NodeIconImg type="desisncrever" size={32} />}
        onExpand={() => setCollapsed(false)}
        onClose={onClose}
      />
    );
  }

  const handleAdd = () => {
    onAdd({});
  };

  return (
    <div
      className="fixed z-50 flex flex-col rounded-[12px] overflow-hidden border border-[#e8eaec] bg-white shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(39,44,55,0.08)]"
      style={{ bottom: "24px", right: "24px", width: 660, minHeight: "79vh" }}
      onWheel={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center gap-[12px] px-[16px] py-[14px] border-b border-[#e8eaec] shrink-0">
        <div
          className="flex items-center justify-center rounded-[10px] shrink-0"
          style={{ width: 52, height: 52, background: COLOR }}
        >
          {icons.nodeIcon}
        </div>
        <span className="flex-1 text-lg font-semibold text-[#12171d]">Desisncrever</span>
        <button onClick={() => setCollapsed(true)} className="flex items-center justify-center size-[36px] rounded-[8px] hover:bg-gray-100 transition-colors">
          {icons.arrowRight}
        </button>
        <div className="w-px h-[24px] bg-[#e8eaec]" />
        <button onClick={onClose} className="flex items-center justify-center size-[36px] rounded-[8px] hover:bg-gray-100 transition-colors">
          {icons.close}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-[20px] flex flex-col gap-[20px]">
        <p className="text-sm text-[#343b44]">
          Usuários que entrarem neste nó serão desinscritos da jornada.
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-[20px] py-[14px] border-t border-[#e8eaec] shrink-0 bg-white">
        {onRemove ? (
          <button type="button" onClick={onRemove} className="text-sm font-semibold text-[#d92d20] hover:opacity-80 transition-opacity">
            Remover nó
          </button>
        ) : <div />}
        <div className="flex items-center gap-[12px]">
          <button
            onClick={onClose}
            className="rounded-[8px] border border-[#e8eaec] px-[16px] py-[9px] text-sm font-semibold text-[#343b44] hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleAdd}
            className="rounded-[8px] px-[16px] py-[9px] text-sm font-semibold transition-colors bg-[#2724ed] text-white hover:opacity-90 cursor-pointer"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}


