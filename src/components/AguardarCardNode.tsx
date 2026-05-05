"use client";

import { useState } from "react";

export interface AguardarNodeData {
  quantidade: number;
  unidade: "Minutos" | "Horas" | "Dias";
}

interface AguardarCardNodeProps {
  initialData?: AguardarNodeData;
  isNew?: boolean;
  style?: React.CSSProperties;
  onConfirm: (data: AguardarNodeData) => void;
  onCancel: () => void;
  onRemove: () => void;
}

const COLOR = "#64748b";
const UNIDADES = ["Minutos", "Horas", "Dias"] as const;

const IcWatchLater = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
  </svg>
);

const IcEdit = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const IcChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 6L8 10L12 6" stroke="#6f7680" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function pluralize(n: number, unidade: string) {
  if (unidade === "Minutos") return n === 1 ? "minuto" : "minutos";
  if (unidade === "Horas") return n === 1 ? "hora" : "horas";
  return n === 1 ? "dia" : "dias";
}

export default function AguardarCardNode({
  initialData,
  isNew = false,
  style,
  onConfirm,
  onCancel,
  onRemove,
}: AguardarCardNodeProps) {
  const [isOpen, setIsOpen] = useState(isNew || !initialData);
  const [quantidade, setQuantidade] = useState(initialData?.quantidade ?? 1);
  const [unidade, setUnidade] = useState<"Minutos" | "Horas" | "Dias">(
    initialData?.unidade ?? "Minutos"
  );

  const containerStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%) translateY(41px)",
    ...style,
  };

  const handleConfirm = () => {
    onConfirm({ quantidade, unidade });
    if (!isNew) setIsOpen(false);
  };

  const handleCancel = () => {
    if (isNew) {
      onCancel();
    } else {
      setQuantidade(initialData?.quantidade ?? 1);
      setUnidade(initialData?.unidade ?? "Minutos");
      setIsOpen(false);
    }
  };

  /* ── Closed state ── */
  if (!isOpen) {
    return (
      <div style={containerStyle}>
        <div className="flex items-center isolate relative">
          {/* Icon badge */}
          <div
            className="flex items-center justify-center p-[8px] rounded-[8px] border-2 border-white shrink-0 z-[2] mr-[-16px]"
            style={{ background: COLOR }}
          >
            <IcWatchLater />
          </div>
          {/* Header bar */}
          <div
            className="flex items-center justify-between pl-[26px] pr-[8px] py-[10px] rounded-[8px] z-[1]"
            style={{ background: COLOR, width: 324 }}
          >
            <span className="text-base font-semibold text-white pl-[4px]">
              Aguardar por
            </span>
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center justify-center p-[8px] rounded-[8px] hover:bg-white/10 transition-colors"
            >
              <IcEdit />
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Open/editing state ── */
  return (
    <div style={containerStyle}>
      <div className="flex flex-col items-end relative">
        {/* Icon + header row */}
        <div className="flex items-center isolate relative w-full">
          <div
            className="flex items-center justify-center p-[8px] rounded-[8px] border-2 border-white shrink-0 z-[2] mr-[-16px]"
            style={{ background: COLOR }}
          >
            <IcWatchLater />
          </div>
          <div
            className="flex items-center justify-between pl-[26px] pr-[8px] py-[10px] rounded-tl-[8px] rounded-tr-[8px] z-[1]"
            style={{ background: COLOR, width: 324 }}
          >
            <p className="text-base font-semibold text-white pl-[4px]">
              Aguardar por{" "}
              <span className="font-bold">
                {quantidade} {pluralize(quantidade, unidade)}
              </span>
            </p>
            <button className="flex items-center justify-center p-[8px] rounded-[8px] hover:bg-white/10 transition-colors">
              <IcEdit />
            </button>
          </div>
        </div>

        {/* White content */}
        <div
          className="bg-white border-l border-r border-[#e8eaec] flex gap-[10px] items-end p-[16px]"
          style={{ width: 324 }}
        >
          {/* Número */}
          <div className="flex flex-col gap-[6px]" style={{ width: 98 }}>
            <label className="text-sm font-medium text-[#343b44]">Tempo de aguardo</label>
            <input
              type="number"
              min={1}
              value={quantidade}
              onChange={(e) => setQuantidade(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full rounded-[8px] border border-[#e8eaec] bg-[#fcfcfc] px-[12px] py-[8px] text-sm text-[#12171d] outline-none focus:border-[#64748b] transition-colors"
            />
          </div>
          {/* Unidade */}
          <div className="relative" style={{ width: 127 }}>
            <select
              value={unidade}
              onChange={(e) => setUnidade(e.target.value as typeof unidade)}
              className="w-full appearance-none rounded-[8px] border border-[#e8eaec] bg-[#fcfcfc] px-[12px] py-[8px] pr-[32px] text-sm text-[#12171d] outline-none focus:border-[#64748b] cursor-pointer transition-colors"
            >
              {UNIDADES.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
            <span className="absolute right-[8px] top-1/2 -translate-y-1/2 pointer-events-none">
              <IcChevronDown />
            </span>
          </div>
        </div>

        {/* Footer */}
        <div
          className="bg-white border border-[#e8eaec] rounded-bl-[16px] rounded-br-[16px] flex items-center justify-between px-[16px] py-[12px]"
          style={{ width: 324 }}
        >
          <button
            type="button"
            onClick={onRemove}
            className="text-xs font-semibold text-[#d92d20] hover:opacity-80 transition-opacity"
          >
            Remover nó
          </button>
          <div className="flex items-center gap-[8px]">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-[8px] border border-[#e8eaec] bg-[#fcfcfc] px-[12px] py-[8px] text-xs font-semibold text-[#343b44] hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="rounded-[8px] px-[12px] py-[8px] text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              style={{ background: COLOR, height: 34 }}
            >
              Adicionar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
