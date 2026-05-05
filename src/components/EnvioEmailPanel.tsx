"use client";

import { useState } from "react";

export interface EmailNodeData {
  nome: string;
  provedor: string;
  naoPerturbe: boolean;
  tipoMensagem: "unica" | "ab";
  remetente: string;
  assunto: string;
  preheader: string;
  variantesAB?: { a: number; b: number };
}

interface EnvioEmailPanelProps {
  onClose: () => void;
  onAdd: (data: EmailNodeData) => void;
}

/* ── Icons ── */
const IcClose = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M15 5L5 15M5 5L15 15" stroke="#12171d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IcArrowRight = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M4 10h12M10 4l6 6-6 6" stroke="#12171d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IcEnvelopeWhite = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

const IcEnvelope = ({ size = 16, color = "#343b44" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m2 7 10 7 10-7" />
  </svg>
);

const IcContrast = ({ size = 16, color = "#343b44" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a10 10 0 0 1 0 20V2z" fill={color} stroke="none" />
  </svg>
);

const IcHelp = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.6">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 17h.01" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IcChangeCircle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#343b44" strokeWidth="1.6">
    <path d="M12 4a8 8 0 1 0 8 8" strokeLinecap="round" />
    <path d="M20 4v8h-8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IcEdit = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#343b44" strokeWidth="1.6">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IcPreview = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2724ed" strokeWidth="1.6">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IcMoreVert = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#343b44">
    <circle cx="12" cy="5" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="12" cy="19" r="1.5" />
  </svg>
);

const IcPercent = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6f7680" strokeWidth="1.6">
    <line x1="19" y1="5" x2="5" y2="19" strokeLinecap="round" />
    <circle cx="6.5" cy="6.5" r="2.5" />
    <circle cx="17.5" cy="17.5" r="2.5" />
  </svg>
);

/* ── Helpers ── */
const inputClass =
  "w-full rounded-[8px] border border-[#e8eaec] bg-[#fcfcfc] px-[12px] py-[8px] text-sm text-[#12171d] placeholder:text-[#6f7680] outline-none focus:border-[#2724ed] focus:ring-1 focus:ring-[#2724ed] transition-colors";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[6px]">
      <div className="flex items-center gap-[6px]">
        <label className="text-sm font-medium text-[#343b44]">{label}</label>
        {required && (
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M4 0v8M0 4h8M1.17 1.17l5.66 5.66M6.83 1.17 1.17 6.83" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        )}
      </div>
      {children}
    </div>
  );
}

function BtnSecondary({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-[4px] rounded-[8px] border border-[#e8eaec] bg-[#fcfcfc] px-[12px] py-[8px] text-sm font-semibold text-[#343b44] hover:bg-gray-50 transition-colors shrink-0"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

const VARIANT_COLORS = ["#5290f5", "#3cca71"] as const;
const VARIANT_LABELS = ["Variante A", "Variante B"] as const;

/* ── Main component ── */
export default function EnvioEmailPanel({ onClose, onAdd }: EnvioEmailPanelProps) {
  const [nome, setNome] = useState("");
  const [provedor, setProvedor] = useState("");
  const [naoPerturbe, setNaoPerturbe] = useState(true);
  const [tipoMensagem, setTipoMensagem] = useState<"unica" | "ab" | null>(null);
  const [remetente, setRemetente] = useState("");
  const [assunto, setAssunto] = useState("");
  const [preheader, setPreheader] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [varPercent, setVarPercent] = useState([50, 50]);

  const canAdd = nome.trim().length > 0 && provedor.length > 0 && tipoMensagem !== null;

  const handleAdd = () => {
    if (!canAdd) return;
    onAdd({
      nome,
      provedor,
      naoPerturbe,
      tipoMensagem: tipoMensagem!,
      remetente,
      assunto,
      preheader,
      variantesAB:
        tipoMensagem === "ab"
          ? { a: varPercent[0], b: varPercent[1] }
          : undefined,
    });
  };

  const handleEqualSplit = () => setVarPercent([50, 50]);

  const updateVariantPercent = (idx: number, val: string) => {
    const n = Math.min(100, Math.max(0, parseInt(val) || 0));
    // The other variant fills the remainder so sum stays at 100
    setVarPercent(idx === 0 ? [n, 100 - n] : [100 - n, n]);
  };

  return (
    <div
      className="fixed z-50 flex flex-col rounded-[12px] overflow-hidden border border-[#e8eaec] bg-white shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(39,44,55,0.08)]"
      style={{ bottom: "24px", right: "24px", width: 660, height: "79vh" }}
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-[12px] px-[16px] py-[14px] border-b border-[#e8eaec] shrink-0">
        <div
          className="flex items-center justify-center rounded-[10px] shrink-0"
          style={{ width: 52, height: 52, background: "#2724ed" }}
        >
          <IcEnvelopeWhite />
        </div>
        <span className="flex-1 text-lg font-semibold text-[#12171d]">Envio de E-mail</span>
        <button className="flex items-center justify-center size-[36px] rounded-[8px] hover:bg-gray-100 transition-colors">
          <IcArrowRight />
        </button>
        <div className="w-px h-[24px] bg-[#e8eaec]" />
        <button
          onClick={onClose}
          className="flex items-center justify-center size-[36px] rounded-[8px] hover:bg-gray-100 transition-colors"
        >
          <IcClose />
        </button>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto p-[20px] flex flex-col gap-[16px]">

        {/* ── Nome + Provedor ── */}
        <div className="flex gap-[8px]">
          <Field label="Nome" required>
            <input
              className={inputClass}
              placeholder="Digite o nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </Field>
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
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6L8 10L12 6" stroke="#6f7680" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          </Field>
        </div>

        <div className="h-px bg-[#e8eaec]" />

        {/* ── Toggle Não perturbe ── */}
        <div className="flex items-center justify-between rounded-[8px] border border-[#e8eaec] bg-[#fcfcfc] px-[12px] py-[16px]">
          <span className="text-sm font-medium text-[#12171d]">
            Respeitar as restrições de entrega (Não perturbe)
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={naoPerturbe}
            onClick={() => setNaoPerturbe((v) => !v)}
            className={`relative inline-flex h-[20px] w-[36px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none ${
              naoPerturbe ? "bg-[#2724ed]" : "bg-[#e8eaec]"
            }`}
          >
            <span
              className={`pointer-events-none inline-block size-[16px] rounded-full bg-white shadow-sm transition-transform ${
                naoPerturbe ? "translate-x-[16px]" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div className="h-px bg-[#e8eaec]" />

        {/* ── Estado: Selecione o tipo ── */}
        {tipoMensagem === null && (
          <div className="rounded-[16px] border border-[#e8eaec] overflow-hidden bg-[#f1f2f3]">
            {/* Sub-header */}
            <div className="px-[20px] py-[20px]">
              <p className="text-base font-medium text-[#12171d]">Selecione o tipo de Mensagem</p>
            </div>
            {/* Cards */}
            <div className="bg-white px-[20px] pb-[20px] flex gap-[8px]">
              {/* Mensagem única */}
              <button
                type="button"
                onClick={() => setTipoMensagem("unica")}
                className="flex-1 flex items-center gap-[12px] rounded-[8px] border border-[#e8eaec] bg-[#fcfcfc] p-[12px] hover:border-[#2724ed] hover:bg-[#f2f4ff] transition-all text-left"
              >
                <IcEnvelope />
                <span className="flex-1 text-sm font-medium text-[#343b44]">Mensagem única</span>
                <IcHelp />
              </button>
              {/* Teste A/B */}
              <button
                type="button"
                onClick={() => setTipoMensagem("ab")}
                className="flex-1 flex items-center gap-[12px] rounded-[8px] border border-[#e8eaec] bg-[#fcfcfc] p-[12px] hover:border-[#2724ed] hover:bg-[#f2f4ff] transition-all text-left"
              >
                <IcContrast />
                <span className="flex-1 text-sm font-medium text-[#343b44]">Teste A/B</span>
                <IcHelp />
              </button>
            </div>
          </div>
        )}

        {/* ── Estado: Mensagem única ── */}
        {tipoMensagem === "unica" && (
          <div className="rounded-[16px] border border-[#e8eaec] bg-white flex flex-col gap-[24px] p-[20px]">
            {/* Header row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[8px]">
                <IcEnvelope size={18} />
                <span className="text-base font-semibold text-[#12171d]">Mensagem única</span>
              </div>
              <div className="flex items-center gap-[8px]">
                <BtnSecondary icon={<IcChangeCircle />} label="Alterar tipo de mensagem" onClick={() => setTipoMensagem(null)} />
                <BtnSecondary icon={<IcEdit />} label="Email Builder" />
              </div>
            </div>

            <div className="h-px bg-[#e8eaec]" />

            {/* Tab + Preview */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[8px]">
                <div className="flex items-center gap-[8px] rounded-[6px] bg-[#f2f4ff] px-[12px] py-[8px] h-[36px]">
                  <span className="text-sm font-semibold text-[#2724ed]">Variante A</span>
                  <IcMoreVert />
                </div>
              </div>
              <button type="button" className="flex items-center gap-[4px] px-[12px] py-[8px] rounded-[8px] hover:bg-gray-50 transition-colors">
                <IcPreview />
                <span className="text-sm font-semibold text-[#2724ed]">Preview</span>
              </button>
            </div>

            <div className="h-px bg-[#e8eaec]" />

            {/* Campos */}
            <div className="flex flex-col gap-[16px]">
              <Field label="Nome do remetente (Sender name)" required>
                <input className={inputClass} placeholder="Digite o nome do remetente" value={remetente} onChange={(e) => setRemetente(e.target.value)} />
              </Field>
              <Field label="Assunto (Subject)" required>
                <input className={inputClass} placeholder="Digite o assunto" value={assunto} onChange={(e) => setAssunto(e.target.value)} />
              </Field>
              <Field label="Pré cabeçalho (Pre-header)">
                <input className={inputClass} placeholder="Digite o pré cabeçalho" value={preheader} onChange={(e) => setPreheader(e.target.value)} />
              </Field>
            </div>
          </div>
        )}

        {/* ── Estado: Teste A/B ── */}
        {tipoMensagem === "ab" && (
          <div className="rounded-[16px] border border-[#e8eaec] bg-white flex flex-col gap-[24px] p-[20px]">
            {/* Header row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[8px]">
                <IcContrast size={18} />
                <span className="text-base font-semibold text-[#12171d]">Teste A/B</span>
              </div>
              <div className="flex items-center gap-[8px]">
                <BtnSecondary icon={<IcChangeCircle />} label="Alterar tipo de mensagem" onClick={() => setTipoMensagem(null)} />
                <BtnSecondary icon={<IcEdit />} label="Email Builder" />
              </div>
            </div>

            <div className="h-px bg-[#e8eaec]" />

            {/* Distribuição de variantes */}
            <div className="rounded-[8px] bg-[#f1f2f3] px-[16px] py-[12px] flex flex-col gap-[16px]">
              {/* Title + button */}
              <div className="flex items-center gap-[16px]">
                <div className="flex-1 flex flex-col">
                  <span className="text-sm font-medium text-[#12171d]">Distribuição de variantes</span>
                  <span className="text-sm text-[#4c535c]">Arraste os divisores ou edite os valores.</span>
                </div>
                <button
                  type="button"
                  onClick={handleEqualSplit}
                  className="rounded-[8px] border border-[#e8eaec] bg-[#fcfcfc] px-[12px] py-[8px] text-sm font-semibold text-[#343b44] hover:bg-gray-50 transition-colors shrink-0"
                >
                  Dividir igualmente
                </button>
              </div>
              {/* Color bar */}
              <div className="h-[8px] rounded-[99px] flex overflow-hidden w-full">
                {varPercent.map((p, i) => (
                  <div key={i} className="h-full" style={{ background: VARIANT_COLORS[i], flex: p }} />
                ))}
              </div>
              {/* Variant inputs */}
              <div className="flex flex-wrap items-center justify-between gap-y-[16px]">
                {VARIANT_LABELS.map((label, i) => (
                  <div key={i} className="flex items-center gap-[12px] h-[36px]">
                    <div className="flex items-center gap-[8px]">
                      <div className="size-[16px] rounded-full shrink-0" style={{ background: VARIANT_COLORS[i] }} />
                      <span className="text-sm font-medium text-[#343b44]">{label}</span>
                    </div>
                    <div className="flex items-center gap-[8px] rounded-[8px] border border-[#e8eaec] bg-[#fcfcfc] px-[12px] py-[8px]">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={varPercent[i]}
                        onChange={(e) => updateVariantPercent(i, e.target.value)}
                        className="w-[32px] text-sm text-[#12171d] bg-transparent outline-none text-right"
                      />
                      <IcPercent />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-[#e8eaec]" />

            {/* Tabs + Preview */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[8px]">
                {VARIANT_LABELS.map((label, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveTab(i)}
                    className={`flex items-center gap-[8px] rounded-[6px] px-[12px] py-[8px] h-[36px] transition-colors ${
                      activeTab === i
                        ? "bg-[#f2f4ff]"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <span className={`text-sm font-semibold ${activeTab === i ? "text-[#2724ed]" : "text-[#6f7680]"}`}>
                      {label}
                    </span>
                    <IcMoreVert />
                  </button>
                ))}
              </div>
              <button type="button" className="flex items-center gap-[4px] px-[12px] py-[8px] rounded-[8px] hover:bg-gray-50 transition-colors">
                <IcPreview />
                <span className="text-sm font-semibold text-[#2724ed]">Preview</span>
              </button>
            </div>

            <div className="h-px bg-[#e8eaec]" />

            {/* Campos */}
            <div className="flex flex-col gap-[16px]">
              <Field label="Nome do remetente (Sender name)" required>
                <input className={inputClass} placeholder="Digite o nome do remetente" value={remetente} onChange={(e) => setRemetente(e.target.value)} />
              </Field>
              <Field label="Assunto (Subject)" required>
                <input className={inputClass} placeholder="Digite o assunto" value={assunto} onChange={(e) => setAssunto(e.target.value)} />
              </Field>
              <Field label="Pré cabeçalho (Pre-header)">
                <input className={inputClass} placeholder="Digite o pré cabeçalho" value={preheader} onChange={(e) => setPreheader(e.target.value)} />
              </Field>
            </div>
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
