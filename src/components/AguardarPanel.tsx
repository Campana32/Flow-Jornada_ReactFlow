"use client";

import { useState } from "react";

export interface AguardarNodeData {
  quantidade: number;
  unidade: "Minutos" | "Horas" | "Dias";
}

interface AguardarPanelProps {
  onClose: () => void;
  onAdd: (data: AguardarNodeData) => void;
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
  chevronDown: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 6L8 10L12 6" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  nodeIcon: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
    </svg>
  ),
};

const inputClass =
  "w-full rounded-[8px] border border-[#e8eaec] bg-white px-[12px] py-[10px] text-sm text-[#12171d] placeholder:text-[#9ca3af] outline-none focus:border-[#2724ed] focus:ring-1 focus:ring-[#2724ed] transition-colors";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[6px] flex-1">
      <label className="text-sm font-medium text-[#12171d]">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const COLOR = "#64748b";

export default function AguardarPanel({ onClose, onAdd }: AguardarPanelProps) {
  const [quantidade, setQuantidade] = useState<number>(1);
  const [unidade, setUnidade] = useState<"Minutos" | "Horas" | "Dias">("Horas");

  const canAdd = quantidade > 0;

  const handleAdd = () => {
    if (!canAdd) return;
    onAdd({ quantidade, unidade });
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
        <span className="flex-1 text-lg font-semibold text-[#12171d]">Aguardar</span>
        <button className="flex items-center justify-center size-[36px] rounded-[8px] hover:bg-gray-100 transition-colors">
          {icons.arrowRight}
        </button>
        <div className="w-px h-[24px] bg-[#e8eaec]" />
        <button onClick={onClose} className="flex items-center justify-center size-[36px] rounded-[8px] hover:bg-gray-100 transition-colors">
          {icons.close}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-[20px] flex flex-col gap-[20px]">
        <div className="flex gap-[12px]">
          <div style={{ minWidth: 120 }}>
            <Field label="Quantidade">
              <input
                type="number"
                min={1}
                className={inputClass}
                value={quantidade}
                onChange={(e) => setQuantidade(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </Field>
          </div>

          <Field label="Unidade">
            <div className="relative">
              <select
                className={`${inputClass} appearance-none pr-[36px] cursor-pointer`}
                value={unidade}
                onChange={(e) => setUnidade(e.target.value as "Minutos" | "Horas" | "Dias")}
              >
                <option value="Minutos">Minutos</option>
                <option value="Horas">Horas</option>
                <option value="Dias">Dias</option>
              </select>
              <span className="absolute right-[10px] top-1/2 -translate-y-1/2 pointer-events-none">
                {icons.chevronDown}
              </span>
            </div>
          </Field>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-[12px] px-[20px] py-[14px] border-t border-[#e8eaec] shrink-0 bg-white">
        <button
          onClick={onClose}
          className="rounded-[8px] border border-[#e8eaec] px-[16px] py-[9px] text-sm font-semibold text-[#343b44] hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleAdd}
          disabled={!canAdd}
          className={`rounded-[8px] px-[16px] py-[9px] text-sm font-semibold transition-colors ${
            canAdd
              ? "bg-[#2724ed] text-white hover:opacity-90 cursor-pointer"
              : "bg-[#f8f8f9] text-[#9ca3af] border border-[#e8eaec] cursor-not-allowed"
          }`}
        >
          Adicionar
        </button>
      </div>
    </div>
  );
}


