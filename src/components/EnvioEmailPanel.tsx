"use client";

import { useState } from "react";

export interface EmailNodeData {
  provedor: string;
  naoPerturbe: boolean;
  tipoMensagem: "unica" | "ab";
  remetente: string;
  assunto: string;
  preheader: string;
}

interface EnvioEmailPanelProps {
  onClose: () => void;
  onAdd: (data: EmailNodeData) => void;
}

/* ── Inline SVG icons ── */
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
  info: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="#9ca3af" strokeWidth="1.2" />
      <path d="M8 7v4M8 5.5v.01" stroke="#9ca3af" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  envelope: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#6b7280">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  ),
  envelopeWhite: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  ),
  settings: (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" stroke="#9ca3af" strokeWidth="1.3" />
      <path d="M17 10a7 7 0 0 1-.1 1.1l1.6 1.2-1.5 2.6-1.9-.8a7 7 0 0 1-1.9 1.1l-.3 2H8.1l-.3-2A7 7 0 0 1 5.9 14l-1.9.8-1.5-2.6 1.6-1.2A7 7 0 0 1 4 10c0-.4 0-.8.1-1.1L2.5 7.7l1.5-2.6 1.9.8a7 7 0 0 1 1.9-1.1l.3-2h2.8l.3 2A7 7 0 0 1 14.1 5.9l1.9-.8 1.5 2.6-1.6 1.2c.1.3.1.7.1 1.1z" stroke="#9ca3af" strokeWidth="1.3" />
    </svg>
  ),
  pencil: (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path d="M14.7 2.3a1 1 0 0 1 1.4 0l1.6 1.6a1 1 0 0 1 0 1.4l-10 10L4 16l.7-3.7 10-10z" stroke="#2724ed" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  eye: (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path d="M1 10s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7z" stroke="#6b7280" strokeWidth="1.3" />
      <circle cx="10" cy="10" r="2.5" stroke="#6b7280" strokeWidth="1.3" />
    </svg>
  ),
  chevronDown: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 6L8 10L12 6" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

/* ── Label + Input ── */
function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
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

const inputClass =
  "w-full rounded-[8px] border border-[#e8eaec] bg-white px-[12px] py-[10px] text-sm text-[#12171d] placeholder:text-[#9ca3af] outline-none focus:border-[#2724ed] focus:ring-1 focus:ring-[#2724ed] transition-colors";

export default function EnvioEmailPanel({ onClose, onAdd }: EnvioEmailPanelProps) {
  const [provedor, setProvedor] = useState("");
  const [naoPerturbe, setNaoPerturbe] = useState(false);
  const [tipoMensagem, setTipoMensagem] = useState<"unica" | "ab" | null>(null);
  const [remetente, setRemetente] = useState("");
  const [assunto, setAssunto] = useState("");
  const [preheader, setPreheader] = useState("");

  const canAdd = provedor.trim().length > 0;

  const handleAdd = () => {
    if (!canAdd) return;
    onAdd({
      provedor,
      naoPerturbe,
      tipoMensagem: tipoMensagem ?? "unica",
      remetente,
      assunto,
      preheader,
    });
  };

  return (
    <div
      className="fixed z-50 flex flex-col rounded-[12px] overflow-hidden border border-[#e8eaec] bg-white shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(39,44,55,0.08)]"
      style={{ bottom: "24px", right: "24px", width: 660 }}
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-[12px] px-[16px] py-[14px] border-b border-[#e8eaec] shrink-0">
        {/* Icon badge */}
        <div
          className="flex items-center justify-center rounded-[10px] shrink-0"
          style={{ width: 52, height: 52, background: "#2724ed" }}
        >
          {icons.envelopeWhite}
        </div>

        <span className="flex-1 text-lg font-semibold text-[#12171d]">Envio de E-mail</span>

        {/* Arrow button */}
        <button className="flex items-center justify-center size-[36px] rounded-[8px] hover:bg-gray-100 transition-colors">
          {icons.arrowRight}
        </button>

        {/* Divider */}
        <div className="w-px h-[24px] bg-[#e8eaec]" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="flex items-center justify-center size-[36px] rounded-[8px] hover:bg-gray-100 transition-colors"
        >
          {icons.close}
        </button>
      </div>

      {/* ── Content (scrollável) ── */}
      <div className="flex-1 overflow-y-auto p-[20px] flex flex-col gap-[20px]">

        {/* Provedor */}
        <Field label="Selecione o provedor de serviços" required>
          <div className="relative">
            <select
              className={`${inputClass} appearance-none pr-[36px] cursor-pointer`}
              value={provedor}
              onChange={(e) => setProvedor(e.target.value)}
            >
              <option value="" disabled>Selecione uma Pool</option>
              <option value="pool-brasil">Pool Brasil</option>
              <option value="pool-internacional">Pool Internacional</option>
              <option value="pool-transacional">Pool Transacional</option>
            </select>
            <span className="absolute right-[10px] top-1/2 -translate-y-1/2 pointer-events-none">
              {icons.chevronDown}
            </span>
          </div>
        </Field>

        {/* Toggle: Não perturbe */}
        <div className="flex items-center justify-between py-[4px]">
          <span className="text-sm text-[#343b44]">
            Respeitar as restrições de entrega (Não perturbe)
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={naoPerturbe}
            onClick={() => setNaoPerturbe((v) => !v)}
            className={`relative inline-flex h-[22px] w-[40px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none ${
              naoPerturbe ? "bg-[#2724ed]" : "bg-[#d1d5db]"
            }`}
          >
            <span
              className={`pointer-events-none inline-block size-[18px] rounded-full bg-white shadow-sm ring-0 transition-transform ${
                naoPerturbe ? "translate-x-[18px]" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Tipo de Mensagem */}
        <div className="flex flex-col gap-[10px]">
          <span className="text-sm font-medium text-[#12171d]">Selecione o tipo de Mensagem</span>
          <div className="rounded-[10px] bg-[#f8f8f9] p-[8px] flex gap-[8px]">
            {/* Mensagem única */}
            <button
              type="button"
              onClick={() => setTipoMensagem("unica")}
              className={`flex-1 flex items-center gap-[8px] justify-center rounded-[8px] px-[14px] py-[10px] text-sm font-medium transition-all ${
                tipoMensagem === "unica"
                  ? "bg-white shadow-sm text-[#12171d] border border-[#e8eaec]"
                  : "text-[#6b7280] hover:text-[#343b44]"
              }`}
            >
              {icons.envelope}
              <span>Mensagem única</span>
              <span className="ml-1 opacity-60">{icons.info}</span>
            </button>
            {/* Teste A/B */}
            <button
              type="button"
              onClick={() => setTipoMensagem("ab")}
              className={`flex-1 flex items-center gap-[8px] justify-center rounded-[8px] px-[14px] py-[10px] text-sm font-medium transition-all ${
                tipoMensagem === "ab"
                  ? "bg-white shadow-sm text-[#12171d] border border-[#e8eaec]"
                  : "text-[#6b7280] hover:text-[#343b44]"
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M4 15l3-10 3 7 2-4 2 7" stroke="#6b7280" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Teste A/B</span>
              <span className="ml-1 opacity-60">{icons.info}</span>
            </button>
          </div>
        </div>

        {/* Seção Mensagem única — aparece só quando selecionado */}
        {tipoMensagem === "unica" && (
          <div className="flex flex-col gap-[16px] rounded-[10px] border border-[#e8eaec] overflow-hidden">
            {/* Sub-header */}
            <div className="flex items-center gap-[10px] px-[16px] pt-[14px] pb-[10px] border-b border-[#e8eaec] bg-[#f8f8f9]">
              <div className="flex items-center gap-[6px] flex-1">
                {icons.envelope}
                <span className="text-sm font-semibold text-[#12171d]">Mensagem única</span>
              </div>
              <button className="flex items-center gap-[4px] text-xs text-[#9ca3af] hover:text-[#6b7280] transition-colors">
                {icons.settings}
                <span>Alterar tipo de mensagem</span>
              </button>
              <button className="flex items-center gap-[4px] text-xs font-medium text-[#2724ed] hover:opacity-80 transition-opacity">
                {icons.pencil}
                <span>Email Builder</span>
              </button>
            </div>

            <div className="px-[16px] pb-[16px] flex flex-col gap-[16px]">
              {/* Tab + Preview */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <button className="text-sm font-semibold text-[#2724ed] border-b-2 border-[#2724ed] pb-[4px] pr-[4px]">
                    Variante A
                  </button>
                </div>
                <button className="flex items-center gap-[6px] rounded-[6px] border border-[#e8eaec] px-[10px] py-[6px] text-xs text-[#343b44] hover:bg-gray-50 transition-colors">
                  {icons.eye}
                  <span>Preview</span>
                </button>
              </div>

              {/* Campos */}
              <Field label="Nome do remetente (Sender name)" required>
                <input
                  className={inputClass}
                  placeholder="Digite o nome do remetente"
                  value={remetente}
                  onChange={(e) => setRemetente(e.target.value)}
                />
              </Field>

              <Field label="Assunto (Subject)" required>
                <input
                  className={inputClass}
                  placeholder="Digite o assunto"
                  value={assunto}
                  onChange={(e) => setAssunto(e.target.value)}
                />
              </Field>

              <Field label="Pré-cabeçalho (Pre-header)">
                <input
                  className={inputClass}
                  placeholder="Digite o pré-cabeçalho"
                  value={preheader}
                  onChange={(e) => setPreheader(e.target.value)}
                />
              </Field>
            </div>
          </div>
        )}

        {/* Teste A/B — MVP placeholder */}
        {tipoMensagem === "ab" && (
          <div className="rounded-[10px] border border-[#e8eaec] p-[16px] text-sm text-[#9ca3af] text-center">
            Configuração de Teste A/B em breve.
          </div>
        )}
      </div>

      {/* ── Footer ── */}
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
