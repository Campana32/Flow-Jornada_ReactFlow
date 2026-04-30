"use client";

import { useState } from "react";
import { EmailNodeData } from "./EnvioEmailPanel";

interface EmailNodeProps {
  data: EmailNodeData;
  onEdit: () => void;
}

/* ── Inline SVG icons ── */
const icons = {
  envelope: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  ),
  pencil: (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path d="M14.7 2.3a1 1 0 0 1 1.4 0l1.6 1.6a1 1 0 0 1 0 1.4l-10 10L4 16l.7-3.7 10-10z" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  chevronDown: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 6L8 10L12 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  chevronUp: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 10L8 6L12 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  copy: (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
      <rect x="7" y="7" width="10" height="12" rx="2" stroke="#9ca3af" strokeWidth="1.4" />
      <path d="M4 13H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" stroke="#9ca3af" strokeWidth="1.4" />
    </svg>
  ),
};

/* Gera um ID curto simulado determinístico a partir do provedor */
function shortId(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(16).slice(0, 8).padStart(8, "0");
}

/* ── Row de dado com botão copy ── */
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
        <span className="text-xs font-medium text-[#12171d] truncate max-w-[120px]" title={value}>
          {value}
        </span>
        <button
          onClick={handleCopy}
          title={copied ? "Copiado!" : "Copiar"}
          className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
        >
          {copied ? (
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path d="M4 10l4 4 8-8" stroke="#16a34a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            icons.copy
          )}
        </button>
      </div>
    </div>
  );
}

export default function EmailNode({ data, onEdit }: EmailNodeProps) {
  const [expanded, setExpanded] = useState(true);
  const id = shortId(data.provedor);

  const tipoLabel = data.tipoMensagem === "unica" ? "Mensagem única" : "Teste A/B";

  return (
    <div
      className="rounded-[10px] overflow-hidden border border-[#e8eaec] shadow-[0px_4px_12px_rgba(16,24,40,0.08)]"
      style={{
        position: "absolute",
        left: "500px",
        top: "50%",
        transform: "translateY(-50%) translateY(41px)",
        width: 260,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-[8px] px-[12px] py-[10px]"
        style={{ background: "#2724ed" }}
      >
        {/* Icon */}
        <div className="flex items-center justify-center rounded-[6px] shrink-0" style={{ width: 28, height: 28, background: "rgba(255,255,255,0.18)" }}>
          {icons.envelope}
        </div>

        <span className="flex-1 text-sm font-semibold text-white truncate">Envio de E-mail</span>

        {/* Edit */}
        <button
          onClick={onEdit}
          title="Editar"
          className="shrink-0 opacity-80 hover:opacity-100 transition-opacity"
        >
          {icons.pencil}
        </button>

        {/* Expand/collapse */}
        <button
          onClick={() => setExpanded((v) => !v)}
          title={expanded ? "Recolher" : "Expandir"}
          className="shrink-0 opacity-80 hover:opacity-100 transition-opacity"
        >
          {expanded ? icons.chevronUp : icons.chevronDown}
        </button>
      </div>

      {/* Body */}
      {expanded && (
        <div className="bg-white px-[14px] py-[12px] flex flex-col gap-[10px]">
          <DataRow label="Id:" value={id} />
          <DataRow label="Tipo de Mensagem:" value={tipoLabel} />
        </div>
      )}
    </div>
  );
}
