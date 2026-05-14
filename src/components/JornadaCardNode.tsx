"use client";

import { useState } from "react";

export interface JornadaCardNodeData {
  jornada: string;
}

interface JornadaCardNodeProps {
  initialData?: JornadaCardNodeData;
  isNew?: boolean;
  style?: React.CSSProperties;
  forceCollapsed?: boolean;
  onConfirm: (data: JornadaCardNodeData) => void;
  onCancel: () => void;
  onRemove: () => void;
}

const COLOR = "#10b8a9";

const JORNADAS = [
  "Jornada ao vivo",
  "Jornada de boas-vindas",
  "Jornada VIP",
];

const IcSwapHoriz = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
    <path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z" />
  </svg>
);

const IcEdit = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path
      d="M14.7 2.3a1 1 0 0 1 1.4 0l1.6 1.6a1 1 0 0 1 0 1.4l-10 10L4 16l.7-3.7 10-10z"
      stroke="white"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IcChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 6L8 10L12 6" stroke="#6f7680" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function JornadaCardNode({
  initialData,
  isNew = false,
  style,
  forceCollapsed,
  onConfirm,
  onCancel,
  onRemove,
}: JornadaCardNodeProps) {
  const [isOpen, setIsOpen] = useState(isNew || !initialData);
  const [jornada, setJornada] = useState(initialData?.jornada ?? "");

  const containerStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%) translateY(41px)",
    ...style,
  };

  const handleConfirm = () => {
    if (!jornada) return;
    onConfirm({ jornada });
    if (!isNew) setIsOpen(false);
  };

  const handleCancel = () => {
    if (isNew) {
      onCancel();
    } else {
      setJornada(initialData?.jornada ?? "");
      setIsOpen(false);
    }
  };

  /* ── Compacto (zoom out) ── */
  if (forceCollapsed && !isNew) {
    return (
      <div style={containerStyle}>
        <div className="flex items-center isolate relative">
          <div
            className="flex items-center justify-center p-[8px] rounded-[8px] border-2 border-white shrink-0 z-[2] mr-[-16px]"
            style={{ background: COLOR }}
          >
            <IcSwapHoriz />
          </div>
          <div
            className="flex items-center justify-between pl-[26px] pr-[8px] py-[10px] rounded-[8px] z-[1]"
            style={{ background: COLOR, width: 324 }}
          >
            <span className="text-base font-semibold text-white pl-[4px]">
              Adicionar a outra jornada
            </span>
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center justify-center p-[8px] rounded-[8px] hover:bg-white/10 transition-colors shrink-0"
            >
              <IcEdit />
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Salvo / fechado ── */
  if (!isOpen) {
    return (
      <div style={containerStyle}>
        <div className="flex flex-col items-end isolate relative">
          <div className="flex items-center isolate relative shrink-0 z-[2]">
            <div
              className="flex items-center justify-center p-[8px] rounded-[8px] border-2 border-white shrink-0 z-[2] mr-[-16px]"
              style={{ background: COLOR }}
            >
              <IcSwapHoriz />
            </div>
            <div
              className="flex items-center justify-between pl-[26px] pr-[8px] py-[10px] rounded-tl-[8px] rounded-tr-[8px] z-[1]"
              style={{ background: COLOR, width: 324 }}
            >
              <span className="text-base font-semibold text-white pl-[4px]">
                Adicionar a outra jornada
              </span>
              <button
                onClick={() => setIsOpen(true)}
                className="flex items-center justify-center p-[8px] rounded-[8px] hover:bg-white/10 transition-colors shrink-0"
              >
                <IcEdit />
              </button>
            </div>
          </div>
          <div
            className="bg-white border border-[#e8eaec] rounded-bl-[8px] rounded-br-[8px] flex items-center gap-[6px] px-[16px] py-[12px] shrink-0 z-[1]"
            style={{ width: 324 }}
          >
            <span className="text-sm font-medium text-[#12171d] whitespace-nowrap">
              Redirecionar para:
            </span>
            <span className="text-sm font-semibold text-[#2724ed] underline whitespace-nowrap">
              {initialData?.jornada ?? "—"}
            </span>
          </div>
        </div>
      </div>
    );
  }

  /* ── Open/editing state ── */
  const canConfirm = jornada.trim().length > 0;

  return (
    <div style={containerStyle}>
      <div className="flex flex-col items-end relative">
        {/* Icon + header row */}
        <div className="flex items-center isolate relative w-full">
          <div
            className="flex items-center justify-center p-[8px] rounded-[8px] border-2 border-white shrink-0 z-[2] mr-[-16px]"
            style={{ background: COLOR }}
          >
            <IcSwapHoriz />
          </div>
          <div
            className="flex items-center justify-between pl-[26px] pr-[8px] py-[10px] rounded-tl-[8px] rounded-tr-[8px] z-[1]"
            style={{ background: COLOR, width: 324 }}
          >
            <span className="text-base font-semibold text-white pl-[4px]">
              Adicionar a outra jornada
            </span>
          </div>
        </div>

        {/* White content */}
        <div
          className="bg-white border-l border-r border-[#e8eaec] flex flex-col gap-[6px] items-start p-[16px]"
          style={{ width: 324 }}
        >
          <label className="text-sm font-medium text-[#343b44]">Adicionar na jornada</label>
          <div className="relative w-full">
            <select
              value={jornada}
              onChange={(e) => setJornada(e.target.value)}
              className="w-full appearance-none rounded-[8px] border border-[#e8eaec] bg-[#fcfcfc] px-[12px] py-[8px] pr-[32px] text-sm outline-none focus:border-[#10b8a9] cursor-pointer transition-colors"
              style={{ color: jornada ? "#12171d" : "#6f7680" }}
            >
              <option value="" disabled>Selecione a jornada</option>
              {JORNADAS.map((j) => (
                <option key={j} value={j}>{j}</option>
              ))}
            </select>
            <span className="absolute right-[8px] top-1/2 -translate-y-1/2 pointer-events-none">
              <IcChevronDown />
            </span>
          </div>
          <p className="text-xs text-[#4c535c]">*Apenas jornadas ativas poderão ser selecionadas</p>
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
              disabled={!canConfirm}
              className="rounded-[8px] px-[12px] py-[8px] text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
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
