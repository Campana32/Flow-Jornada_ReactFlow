"use client";
import { useState } from "react";
import CollapsedPanelBar from "./CollapsedPanelBar";
import type { TesteABCardNodeData, TesteABVariante } from "./TesteABCardNode";

export type { TesteABCardNodeData };

const VARIANT_COLORS = ["#5290f5", "#3cca71", "#f88332", "#f9c74f", "#ff5fa2"];
const VARIANT_LETTERS = ["A", "B", "C", "D", "E"];

const COLOR = "#fb7185";

interface TesteABPanelProps {
  onClose: () => void;
  onAdd: (data: TesteABCardNodeData) => void;
  onRemove?: () => void;
  initialData?: TesteABCardNodeData;
}

const IcClose = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#12171d">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

const IcArrowRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#12171d">
    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
  </svg>
);

const IcBeaker = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
    <path d="M9 2v8.5L5.5 17c-.91 1.37-.06 3 1.5 3h11c1.56 0 2.41-1.63 1.5-3L16 10.5V2H9zm1 2h4v5h-4V4zm2 11c-.83 0-1.5-.67-1.5-1.5S11.17 12 12 12s1.5.67 1.5 1.5S12.83 15 12 15z" />
  </svg>
);

const IcDelete = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#d92d20">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
);

const IcAdd = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#343b44">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
);

const IcPercent = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#9ca3af">
    <path d="M18.5 3.5l2 2-15 15-2-2 15-15zM7 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm10 10a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
  </svg>
);

function makeDefaultVariantes(): TesteABVariante[] {
  return [
    { id: "va", label: "Variante A", color: VARIANT_COLORS[0], percentual: 50 },
    { id: "vb", label: "Variante B", color: VARIANT_COLORS[1], percentual: 50 },
  ];
}

function distributeEqually(vars: TesteABVariante[]): TesteABVariante[] {
  const n = vars.length;
  const base = Math.floor(100 / n);
  const rem = 100 - base * n;
  return vars.map((v, i) => ({ ...v, percentual: base + (i < rem ? 1 : 0) }));
}

export default function TesteABPanel({ onClose, onAdd, onRemove, initialData }: TesteABPanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [variantes, setVariantes] = useState<TesteABVariante[]>(
    initialData?.variantes ?? makeDefaultVariantes()
  );

  if (collapsed) {
    return (
      <CollapsedPanelBar
        title="Teste A/B"
        color={COLOR}
        icon={<IcBeaker />}
        onExpand={() => setCollapsed(false)}
        onClose={onClose}
      />
    );
  }

  const handlePercent = (id: string, raw: string) => {
    const val = Math.min(100, Math.max(0, parseInt(raw) || 0));
    setVariantes((prev) => prev.map((v) => (v.id === id ? { ...v, percentual: val } : v)));
  };

  const handleAddVariante = () => {
    if (variantes.length >= 5) return;
    const idx = variantes.length;
    const newV: TesteABVariante = {
      id: `v${Date.now()}`,
      label: `Variante ${VARIANT_LETTERS[idx]}`,
      color: VARIANT_COLORS[idx],
      percentual: 0,
    };
    setVariantes(distributeEqually([...variantes, newV]));
  };

  const handleRemoveVariante = (id: string) => {
    if (variantes.length <= 2) return;
    const newList = variantes
      .filter((v) => v.id !== id)
      .map((v, i) => ({ ...v, label: `Variante ${VARIANT_LETTERS[i]}`, color: VARIANT_COLORS[i] }));
    setVariantes(distributeEqually(newList));
  };

  const handleDividirIgualmente = () => setVariantes(distributeEqually(variantes));

  const total = variantes.reduce((s, v) => s + v.percentual, 0);
  const canAdd = variantes.length >= 2 && total === 100;
  const canAddVariante = variantes.length < 5;

  return (
    <div
      className="fixed z-50 flex flex-col rounded-[12px] border border-[#e8eaec] bg-white shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(39,44,55,0.08)]"
      style={{ bottom: "24px", right: "24px", width: 660, minHeight: "79vh" }}
      onWheel={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center gap-[12px] px-[16px] py-[14px] border-b border-[#e8eaec] shrink-0">
        <div className="flex items-center justify-center rounded-[10px] shrink-0" style={{ width: 52, height: 52, background: COLOR }}>
          <IcBeaker />
        </div>
        <span className="flex-1 text-lg font-semibold text-[#12171d]">Teste A/B</span>
        <button onClick={() => setCollapsed(true)} className="flex items-center justify-center size-[36px] rounded-[8px] hover:bg-gray-100 transition-colors">
          <IcArrowRight />
        </button>
        <div className="w-px h-[24px] bg-[#e8eaec]" />
        <button onClick={onClose} className="flex items-center justify-center size-[36px] rounded-[8px] hover:bg-gray-100 transition-colors">
          <IcClose />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-[20px] flex flex-col gap-[20px]" style={{ minHeight: 0 }}>
        {/* Distribution section */}
        <div className="flex flex-col gap-[16px] p-[16px] rounded-[10px] border border-[#e8eaec]">
          {/* Title row */}
          <div className="flex items-start gap-[16px]">
            <div className="flex-1 flex flex-col gap-[2px]">
              <span className="text-sm font-medium text-[#12171d]">Distribuição de variantes</span>
              <span className="text-sm text-[#4c535c]">Arraste os divisores ou edite os valores.</span>
            </div>
            <button
              className="shrink-0 px-[12px] py-[8px] rounded-[8px] border border-[#e8eaec] bg-[#fcfcfc] text-sm font-semibold text-[#343b44] hover:bg-gray-50 transition-colors"
              onClick={handleDividirIgualmente}
            >
              Dividir igualmente
            </button>
          </div>

          {/* Color distribution bar */}
          <div className="flex h-[8px] rounded-full overflow-hidden w-full">
            {variantes.map((v) => (
              <div
                key={v.id}
                className="h-full transition-all"
                style={{ flex: `${v.percentual} 0 0`, background: v.color, minWidth: 2 }}
              />
            ))}
          </div>

          {/* Variant rows */}
          <div className="flex flex-wrap gap-x-[32px] gap-y-[12px] items-center">
            {variantes.map((v, i) => (
              <div key={v.id} className="flex items-center gap-[12px]">
                <div className="flex items-center gap-[8px]">
                  <div className="rounded-full shrink-0" style={{ width: 16, height: 16, background: v.color }} />
                  <span className="text-sm font-medium text-[#343b44] whitespace-nowrap">{v.label}</span>
                </div>
                <div className="flex items-center gap-[6px] border border-[#e8eaec] bg-[#fcfcfc] rounded-[8px] px-[10px] py-[7px]">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={v.percentual}
                    onChange={(e) => handlePercent(v.id, e.target.value)}
                    className="w-[28px] bg-transparent text-sm text-[#12171d] outline-none text-center"
                  />
                  <IcPercent />
                </div>
                {i >= 2 && (
                  <button
                    className="flex items-center justify-center p-[8px] rounded-[8px] hover:bg-red-50 transition-colors"
                    onClick={() => handleRemoveVariante(v.id)}
                  >
                    <IcDelete />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Adicionar variante */}
          <button
            className={`flex items-center gap-[4px] text-sm font-semibold rounded-[8px] py-[4px] transition-colors ${canAddVariante ? "text-[#343b44] hover:bg-gray-50" : "text-[#a0a6ad] cursor-not-allowed"}`}
            onClick={canAddVariante ? handleAddVariante : undefined}
            disabled={!canAddVariante}
          >
            <IcAdd />
            <span>Adicionar variante</span>
          </button>

          {total !== 100 && (
            <p className="text-xs text-[#d92d20]">A soma das variantes deve ser 100% (atual: {total}%)</p>
          )}
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
            onClick={() => onAdd({ variantes })}
            disabled={!canAdd}
            className="rounded-[8px] px-[16px] py-[9px] text-sm font-semibold text-white transition-opacity disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
            style={{ background: COLOR }}
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}
