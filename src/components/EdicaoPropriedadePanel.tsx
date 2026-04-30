"use client";

import { useState } from "react";

export interface EdicaoPropriedadeNodeData {
  propriedade: string;
  tipo: string;
}

interface EdicaoPropriedadePanelProps {
  onClose: () => void;
  onAdd: (data: EdicaoPropriedadeNodeData) => void;
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
      <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z" />
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

const COLOR = "#9d174d";

export default function EdicaoPropriedadePanel({ onClose, onAdd }: EdicaoPropriedadePanelProps) {
  const [propriedade, setPropriedade] = useState("");
  const [tipo, setTipo] = useState("");

  const canAdd = propriedade.trim().length > 0;

  const handleAdd = () => {
    if (!canAdd) return;
    onAdd({ propriedade, tipo });
  };

  return (
    <div
      className="fixed z-50 flex flex-col rounded-[12px] overflow-hidden border border-[#e8eaec] bg-white shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(39,44,55,0.08)]"
      style={{ bottom: "24px", right: "24px", width: 660 }}
    >
      {/* Header */}
      <div className="flex items-center gap-[12px] px-[16px] py-[14px] border-b border-[#e8eaec] shrink-0">
        <div
          className="flex items-center justify-center rounded-[10px] shrink-0"
          style={{ width: 52, height: 52, background: COLOR }}
        >
          {icons.nodeIcon}
        </div>
        <span className="flex-1 text-lg font-semibold text-[#12171d]">Edição de Propriedade</span>
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
        {/* Propriedade alterada */}
        <div className="flex flex-col gap-[12px] rounded-[10px] border border-[#e8eaec] p-[16px]">
          <span className="text-sm font-semibold text-[#12171d]">Propriedade alterada</span>

          <div className="flex gap-[12px]">
            <Field label="Propriedade" required>
              <div className="relative">
                <select
                  className={`${inputClass} appearance-none pr-[36px] cursor-pointer`}
                  value={propriedade}
                  onChange={(e) => setPropriedade(e.target.value)}
                >
                  <option value="" disabled>Selecione a propriedade</option>
                  <option value="nome">Nome</option>
                  <option value="email">E-mail</option>
                  <option value="telefone">Telefone</option>
                  <option value="cidade">Cidade</option>
                  <option value="estado">Estado</option>
                </select>
                <span className="absolute right-[10px] top-1/2 -translate-y-1/2 pointer-events-none">
                  {icons.chevronDown}
                </span>
              </div>
            </Field>

            <Field label="Tipo">
              <div className="relative">
                <select
                  className={`${inputClass} appearance-none pr-[36px] cursor-pointer`}
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                >
                  <option value="" disabled>Selecione o tipo</option>
                  <option value="texto">Texto</option>
                  <option value="numero">Número</option>
                  <option value="data">Data</option>
                  <option value="booleano">Booleano</option>
                </select>
                <span className="absolute right-[10px] top-1/2 -translate-y-1/2 pointer-events-none">
                  {icons.chevronDown}
                </span>
              </div>
            </Field>
          </div>

          <button
            type="button"
            className="flex items-center gap-[6px] text-sm font-medium text-[#2724ed] hover:opacity-80 transition-opacity self-start"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8h10" stroke="#2724ed" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Adicionar propriedade
          </button>
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
