"use client";

import { useState } from "react";
import CollapsedPanelBar from "./CollapsedPanelBar";
import { NodeIconImg } from "@/lib/nodeConfig";

export interface TesteABNodeData {
  varianteA: number;
  varianteB: number;
}

interface TesteABPanelProps {
  onClose: () => void;
  onAdd: (data: TesteABNodeData) => void;
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
      <path d="M9 2v8.5L5.5 17c-.91 1.37-.06 3 1.5 3h11c1.56 0 2.41-1.63 1.5-3L16 10.5V2H9zm1 2h4v5h-4V4zm2 11c-.83 0-1.5-.67-1.5-1.5S11.17 12 12 12s1.5.67 1.5 1.5S12.83 15 12 15z" />
    </svg>
  ),
};

const COLOR = "#fb7185";

export default function TesteABPanel({ onClose, onAdd, onRemove }: TesteABPanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [varianteA, setVarianteA] = useState(50);
  const [varianteB, setVarianteB] = useState(50);

  if (collapsed) {
    return (
      <CollapsedPanelBar
        title="Teste A/B"
        color="#fb7185"
        icon={<NodeIconImg type="testeAB" size={32} />}
        onExpand={() => setCollapsed(false)}
        onClose={onClose}
      />
    );
  }

  const handleVarianteAChange = (val: number) => {
    const clamped = Math.min(100, Math.max(0, val));
    setVarianteA(clamped);
    setVarianteB(100 - clamped);
  };

  const handleAdd = () => {
    onAdd({ varianteA, varianteB });
  };

  return (
    <div
      className="fixed z-50 flex flex-col rounded-[12px] overflow-hidden border border-[#e8eaec] bg-white shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(39,44,55,0.08)]"
      style={{ bottom: "24px", right: "24px", width: 660, minHeight: "79vh" }}
    >
      {/* Header */}
      <div className="flex items-center gap-[12px] px-[16px] py-[14px] border-b border-[#e8eaec] shrink-0">
        <div
          className="flex items-center justify-center rounded-[10px] shrink-0"
          style={{ width: 52, height: 52, background: COLOR }}
        >
          {icons.nodeIcon}
        </div>
        <span className="flex-1 text-lg font-semibold text-[#12171d]">Teste A/B</span>
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
        {/* Distribuição */}
        <div className="flex flex-col gap-[12px] rounded-[10px] border border-[#e8eaec] p-[16px]">
          <span className="text-sm font-semibold text-[#12171d]">Distribuição de variantes</span>

          {/* Variante A */}
          <div className="flex items-center gap-[12px]">
            <div
              className="flex items-center justify-center rounded-[6px] text-white text-xs font-bold shrink-0"
              style={{ width: 28, height: 28, background: COLOR }}
            >
              A
            </div>
            <span className="text-sm text-[#343b44] flex-1">Variante A</span>
            <div className="flex items-center gap-[8px]">
              <input
                type="number"
                min={0}
                max={100}
                className="w-[72px] rounded-[8px] border border-[#e8eaec] bg-white px-[10px] py-[8px] text-sm text-center text-[#12171d] outline-none focus:border-[#2724ed] focus:ring-1 focus:ring-[#2724ed]"
                value={varianteA}
                onChange={(e) => handleVarianteAChange(parseInt(e.target.value) || 0)}
              />
              <span className="text-sm text-[#6b7280]">%</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-[8px] rounded-full bg-[#e8eaec] overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${varianteA}%`, background: COLOR }}
            />
          </div>

          {/* Variante B */}
          <div className="flex items-center gap-[12px]">
            <div
              className="flex items-center justify-center rounded-[6px] text-white text-xs font-bold shrink-0"
              style={{ width: 28, height: 28, background: "#94a3b8" }}
            >
              B
            </div>
            <span className="text-sm text-[#343b44] flex-1">Variante B</span>
            <div className="flex items-center gap-[8px]">
              <input
                type="number"
                min={0}
                max={100}
                className="w-[72px] rounded-[8px] border border-[#e8eaec] bg-white px-[10px] py-[8px] text-sm text-center text-[#12171d] outline-none focus:border-[#2724ed] focus:ring-1 focus:ring-[#2724ed]"
                value={varianteB}
                readOnly
              />
              <span className="text-sm text-[#6b7280]">%</span>
            </div>
          </div>
        </div>
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


