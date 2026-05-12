"use client";

import { useState } from "react";

export interface GenericNodeFieldData {
  key: string;
  value: string;
}

export interface GenericNodeData {
  type: string;
  color: string;
  icon: React.ReactNode;
  label: string;
  fields: GenericNodeFieldData[];
  aguardarData?: { quantidade: number; unidade: "Minutos" | "Horas" | "Dias" };
  jornadaData?: { jornada: string };
}

interface GenericNodeProps {
  data: GenericNodeData;
  onEdit: () => void;
  style?: React.CSSProperties;
  forceCollapsed?: boolean;
}

const IcPencil = () => (
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
    <path d="M4 6L8 10L12 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IcChevronUp = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 10L8 6L12 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IcCopy = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
    <rect x="7" y="7" width="10" height="12" rx="2" stroke="#9ca3af" strokeWidth="1.4" />
    <path d="M4 13H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" stroke="#9ca3af" strokeWidth="1.4" />
  </svg>
);

const IcCheck = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
    <path d="M4 10l4 4 8-8" stroke="#16a34a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function DataRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-start justify-between gap-[8px]">
      <span className="text-xs text-[#6b7280] shrink-0">{label}</span>
      <div className="flex items-center gap-[4px] min-w-0">
        <span className="text-xs font-medium text-[#12171d] truncate max-w-[140px]" title={value}>
          {value}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); handleCopy(); }}
          title={copied ? "Copiado!" : "Copiar"}
          className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
        >
          {copied ? <IcCheck /> : <IcCopy />}
        </button>
      </div>
    </div>
  );
}

export function shortId(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(16).slice(0, 8).padStart(8, "0");
}

const BAR_W = 324;
const BADGE_W = 44;

export default function GenericNode({ data, onEdit, style, forceCollapsed }: GenericNodeProps) {
  const [expanded, setExpanded] = useState(true);
  const id = shortId(data.type);

  const containerStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%) translateY(41px)",
    ...style,
  };

  /* ── Collapsed (zoom ≤ 60%) ── */
  if (forceCollapsed) {
    return (
      <div style={containerStyle}>
        <div className="flex items-center isolate relative">
          <div
            className="flex items-center justify-center p-[8px] rounded-[8px] border-2 border-white shrink-0 z-[2] mr-[-16px]"
            style={{ background: data.color, width: BADGE_W, height: BADGE_W }}
          >
            {data.icon}
          </div>
          <div
            className="flex items-center pl-[26px] pr-[8px] py-[10px] rounded-[8px] z-[1]"
            style={{ background: data.color, width: BAR_W }}
          >
            <span className="text-base font-semibold text-white truncate pl-[4px]">{data.label}</span>
          </div>
        </div>
      </div>
    );
  }

  /* ── Normal view ── */
  return (
    <div style={containerStyle}>
      <div className="flex flex-col items-end isolate relative">

        {/* Badge + header */}
        <div className="flex items-center isolate relative shrink-0 z-[2]">
          <div
            className="flex items-center justify-center p-[8px] rounded-[8px] border-2 border-white shrink-0 z-[2] mr-[-16px]"
            style={{ background: data.color, width: BADGE_W, height: BADGE_W }}
          >
            {data.icon}
          </div>
          <div
            className={`flex items-center justify-between pl-[26px] pr-[8px] py-[10px] z-[1] ${expanded ? "rounded-tl-[8px] rounded-tr-[8px]" : "rounded-[8px]"}`}
            style={{ background: data.color, width: BAR_W }}
          >
            <span className="text-base font-semibold text-white truncate pl-[4px] flex-1 min-w-0">{data.label}</span>
            <div className="flex items-center gap-[2px] shrink-0">
              <button
                onClick={onEdit}
                title="Editar"
                className="flex items-center justify-center p-[8px] rounded-[8px] hover:bg-white/10 transition-colors"
              >
                <IcPencil />
              </button>
              <button
                onClick={() => setExpanded((v) => !v)}
                title={expanded ? "Recolher" : "Expandir"}
                className="flex items-center justify-center p-[8px] rounded-[8px] hover:bg-white/10 transition-colors"
              >
                {expanded ? <IcChevronUp /> : <IcChevronDown />}
              </button>
            </div>
          </div>
        </div>

        {/* White body */}
        {expanded && (
          <div
            className="bg-white border border-[#e8eaec] rounded-bl-[8px] rounded-br-[8px] px-[14px] py-[12px] flex flex-col gap-[10px] cursor-pointer hover:bg-gray-50 transition-colors z-[1] shrink-0"
            style={{ width: BAR_W }}
            onClick={onEdit}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <DataRow label="Id:" value={id} />
            {data.fields.map((f) => (
              <DataRow key={f.key} label={f.key} value={f.value} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
