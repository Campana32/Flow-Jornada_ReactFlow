"use client";

import { useState } from "react";
import CollapsedPanelBar from "./CollapsedPanelBar";
import { NodeIconImg } from "@/lib/nodeConfig";

export interface WebhooksNodeData {
  url: string;
  metodo: string;
}

interface WebhooksPanelProps {
  onClose: () => void;
  onAdd: (data: WebhooksNodeData) => void;
  onRemove?: () => void;
  initialData?: Partial<WebhooksNodeData>;
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
      <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
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

const COLOR = "#75ab21";

export default function WebhooksPanel({ onClose, onAdd, onRemove, initialData }: WebhooksPanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [url, setUrl] = useState(initialData?.url ?? "");
  const [metodo, setMetodo] = useState(initialData?.metodo ?? "GET");

  if (collapsed) {
    return (
      <CollapsedPanelBar
        title="Webhooks"
        color="#75ab21"
        icon={<NodeIconImg type="webhooks" size={32} />}
        onExpand={() => setCollapsed(false)}
        onClose={onClose}
      />
    );
  }

  const canAdd = url.trim().length > 0;

  const handleAdd = () => {
    if (!canAdd) return;
    onAdd({ url: url.trim(), metodo });
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
        <span className="flex-1 text-lg font-semibold text-[#12171d]">Webhooks</span>
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
        <div className="flex gap-[12px]">
          <Field label="URL" required>
            <input
              className={inputClass}
              placeholder="https://exemplo.com/webhook"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </Field>

          <div style={{ minWidth: 140 }}>
            <Field label="Método">
              <div className="relative">
                <select
                  className={`${inputClass} appearance-none pr-[36px] cursor-pointer`}
                  value={metodo}
                  onChange={(e) => setMetodo(e.target.value)}
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
                <span className="absolute right-[10px] top-1/2 -translate-y-1/2 pointer-events-none">
                  {icons.chevronDown}
                </span>
              </div>
            </Field>
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
    </div>
  );
}


