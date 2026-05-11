"use client";

import { useState } from "react";
import CollapsedPanelBar from "./CollapsedPanelBar";
import { NodeIconImg } from "@/lib/nodeConfig";

export interface SmsVariante {
  nome: string;
  mensagem: string;
  percentual: number;
}

export interface SmsNodeData {
  nome: string;
  provedor: string;
  naoPerturbe: boolean;
  tipoMensagem: "unica" | "ab";
  mensagemUnica: string;
  variantes: SmsVariante[];
}

interface SmsPanelProps {
  onClose: () => void;
  onAdd: (data: SmsNodeData) => void;
  onRemove?: () => void;
  initialData?: Partial<SmsNodeData>;
}

const COLOR = "#0ea5e9";
const SMS_MAX = 160;

const PROVEDORES = ["Pool Brasil", "Pool Internacional", "Pool Transacional"];

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
const IcChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 6L8 10L12 6" stroke="#6f7680" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IcHelp = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7" stroke="#9ca3af" strokeWidth="1.2" />
    <path d="M8 11v-1M8 9c0-1.5 2-1.5 2-3a2 2 0 1 0-4 0" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
const IcEmail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#343b44">
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);
const IcContrast = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#343b44">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18V4c4.41 0 8 3.59 8 8s-3.59 8-8 8z" />
  </svg>
);
const IcPlay = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#343b44">
    <path d="M8 5v14l11-7z" />
  </svg>
);
const IcAdd = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#343b44" strokeWidth="1.8" strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);
const IcMoreVert = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#6f7680">
    <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
  </svg>
);
const NodeIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm4 0h-2V9h2v2zm4 0h-2V9h2v2z" />
  </svg>
);

const inputClass =
  "w-full rounded-[8px] border border-[#e8eaec] bg-[#fcfcfc] px-[12px] py-[8px] text-sm text-[#12171d] placeholder:text-[#6f7680] outline-none focus:border-[#0ea5e9] transition-colors h-[40px]";

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <div className="flex items-center gap-[6px] mb-[6px]">
      <span className="text-sm font-medium text-[#343b44]">{children}</span>
      {required && (
        <svg width="8" height="8" viewBox="0 0 8 8" fill="#d92d20">
          <path d="M4 0L4.9 2.8L7.6 1.4L6.2 4L9 4.9L6.2 5.8L7.6 8.4L4.9 7L4 9.8L3.1 7L0.4 8.4L1.8 5.8L-1 4.9L1.8 4L0.4 1.4L3.1 2.8Z" />
        </svg>
      )}
    </div>
  );
}

/* ── Textarea with char counter ── */
function MensagemArea({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-[4px]">
      <textarea
        className="w-full rounded-[8px] border border-[#e8eaec] bg-[#fcfcfc] px-[12px] py-[12px] text-base text-[#12171d] placeholder:text-[#6f7680] outline-none focus:border-[#0ea5e9] transition-colors resize-none shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]"
        rows={5}
        placeholder="Insira o SMS aqui"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <p className="text-sm text-[#4c535c] text-right">
        {value.length}/{SMS_MAX}
      </p>
    </div>
  );
}

/* ── Variables + Testar row ── */
function VariaveisRow({ onTestar }: { onTestar?: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-[8px]">
        <span className="text-sm font-semibold text-[#12171d]">Variáveis:</span>
        <button
          type="button"
          className="rounded-[8px] border border-[#e8eaec] bg-[#fcfcfc] px-[12px] py-[8px] text-sm font-semibold text-[#4c535c] hover:bg-gray-50 transition-colors"
        >
          {"{.link}"}
        </button>
      </div>
      <button
        type="button"
        onClick={onTestar}
        className="flex items-center gap-[4px] rounded-[8px] border border-[#e8eaec] bg-[#fcfcfc] px-[12px] py-[8px] text-sm font-semibold text-[#343b44] hover:bg-gray-50 transition-colors"
      >
        <IcPlay />
        Testar mensagem
      </button>
    </div>
  );
}

/* ── Main component ── */
export default function SmsPanel({ onClose, onAdd, onRemove, initialData }: SmsPanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  const [nome, setNome] = useState(initialData?.nome ?? "");
  const [provedor, setProvedor] = useState(initialData?.provedor ?? "");
  const [naoPerturbe, setNaoPerturbe] = useState(initialData?.naoPerturbe ?? true);
  const [tipoMensagem, setTipoMensagem] = useState<"unica" | "ab">(
    initialData?.tipoMensagem ?? "unica"
  );
  const [mensagemUnica, setMensagemUnica] = useState(initialData?.mensagemUnica ?? "");
  const [variantes, setVariantes] = useState<SmsVariante[]>(
    initialData?.variantes ?? [
      { nome: "SMS 1", mensagem: "", percentual: 50 },
      { nome: "SMS 2", mensagem: "", percentual: 50 },
    ]
  );
  const [activeVariante, setActiveVariante] = useState(0);

  if (collapsed) {
    return (
      <CollapsedPanelBar
        title="Envio de SMS"
        color={COLOR}
        icon={<NodeIconImg type="sms" size={32} />}
        onExpand={() => setCollapsed(false)}
        onClose={onClose}
      />
    );
  }

  const canAdd = nome.trim().length > 0 && provedor.length > 0;

  const handleAdd = () => {
    if (!canAdd) return;
    onAdd({ nome, provedor, naoPerturbe, tipoMensagem, mensagemUnica, variantes });
  };

  const addVariante = () => {
    const next = variantes.length + 1;
    const pct = Math.floor(100 / next);
    const updated = variantes.map((v) => ({ ...v, percentual: pct }));
    updated.push({ nome: `SMS ${next}`, mensagem: "", percentual: 100 - pct * (next - 1) });
    setVariantes(updated);
    setActiveVariante(next - 1);
  };

  const updateVarianteMensagem = (idx: number, msg: string) => {
    setVariantes((prev) => prev.map((v, i) => (i === idx ? { ...v, mensagem: msg } : v)));
  };

  const updateVariantePercentual = (idx: number, val: number) => {
    setVariantes((prev) => prev.map((v, i) => (i === idx ? { ...v, percentual: val } : v)));
  };

  const dividirIgualmente = () => {
    const pct = Math.floor(100 / variantes.length);
    const remainder = 100 - pct * variantes.length;
    setVariantes((prev) =>
      prev.map((v, i) => ({ ...v, percentual: pct + (i === 0 ? remainder : 0) }))
    );
  };

  const VARIANT_COLORS = ["#5290f5", "#3cca71", "#f88332", "#a855f7", "#ef4444"];

  return (
    <div
      className="fixed z-50 flex flex-col rounded-[12px] overflow-hidden border border-[#e8eaec] bg-white shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(39,44,55,0.08)]"
      style={{ bottom: "24px", right: "24px", width: 660, height: "79vh" }}
    >
      {/* Header */}
      <div className="flex items-center gap-[12px] px-[16px] py-[14px] border-b border-[#e8eaec] shrink-0">
        <div className="flex items-center justify-center rounded-[10px] shrink-0" style={{ width: 52, height: 52, background: COLOR }}>
          <NodeIcon />
        </div>
        <span className="flex-1 text-lg font-semibold text-[#12171d]">Envio de SMS</span>
        <button onClick={() => setCollapsed(true)} className="flex items-center justify-center size-[36px] rounded-[8px] hover:bg-gray-100 transition-colors">
          <IcArrowRight />
        </button>
        <div className="w-px h-[24px] bg-[#e8eaec]" />
        <button onClick={onClose} className="flex items-center justify-center size-[36px] rounded-[8px] hover:bg-gray-100 transition-colors">
          <IcClose />
        </button>
      </div>

      {/* Content */}
      <div className="p-[20px] flex flex-col gap-[16px]" style={{ overflowY: 'auto', flex: '1 1 0px' }}>

        {/* Nome + Provedor */}
        <div className="flex gap-[8px]">
          <div className="flex-1 flex flex-col">
            <Label required>Nome</Label>
            <input
              className={inputClass}
              placeholder="Digite o nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>
          <div className="flex-1 flex flex-col">
            <Label required>Selecione o provedor de serviços</Label>
            <div className="relative">
              <select
                className={`${inputClass} appearance-none pr-[28px] cursor-pointer`}
                value={provedor}
                onChange={(e) => setProvedor(e.target.value)}
              >
                <option value="" disabled>Selecione uma Pool</option>
                {PROVEDORES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <span className="absolute right-[8px] top-1/2 -translate-y-1/2 pointer-events-none">
                <IcChevronDown />
              </span>
            </div>
          </div>
        </div>

        <div className="h-px bg-[#e8eaec]" />

        {/* Toggle Não perturbe */}
        <div className="border border-[#e8eaec] rounded-[8px] bg-[#fcfcfc] flex items-center justify-between px-[12px] py-[16px]">
          <span className="text-sm font-medium text-[#12171d]">
            Respeitar as restrições de entrega (Não perturbe)
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={naoPerturbe}
            onClick={() => setNaoPerturbe((v) => !v)}
            className={`relative inline-flex h-[20px] w-[36px] shrink-0 cursor-pointer rounded-full p-[2px] transition-colors ${naoPerturbe ? "bg-[#2724ed] justify-end" : "bg-[#e8eaec] justify-start"}`}
          >
            <span className="size-[16px] rounded-full bg-white shadow-sm" />
          </button>
        </div>

        <div className="h-px bg-[#e8eaec]" />

        {/* Tipo de Mensagem */}
        <div className="bg-[#f1f2f3] border border-[#e8eaec] rounded-[16px] overflow-hidden">
          <div className="px-[20px] py-[16px]">
            <p className="text-base font-medium text-[#12171d]">Selecione o tipo de Mensagem</p>
          </div>
          <div className="bg-white px-[20px] pb-[20px] flex flex-col gap-[24px]">
            {/* Radio cards */}
            <div className="flex gap-[8px]">
              {(["unica", "ab"] as const).map((tipo) => (
                <button
                  key={tipo}
                  type="button"
                  onClick={() => setTipoMensagem(tipo)}
                  className="flex-1 flex items-center gap-[12px] p-[12px] rounded-[8px] border bg-[#fcfcfc] transition-colors text-left"
                  style={{ borderColor: "#e8eaec" }}
                >
                  {/* Radio */}
                  <div className={`w-[16px] h-[16px] rounded-full border-2 flex items-center justify-center shrink-0 ${tipoMensagem === tipo ? "border-[#2724ed] bg-[#2724ed]" : "border-[#d2d6db]"}`}>
                    {tipoMensagem === tipo && <div className="w-[5px] h-[5px] rounded-full bg-white" />}
                  </div>
                  {tipo === "unica" ? <IcEmail /> : <IcContrast />}
                  <span className="text-sm font-medium text-[#343b44] flex-1">
                    {tipo === "unica" ? "Mensagem única" : "Teste A/B"}
                  </span>
                  <IcHelp />
                </button>
              ))}
            </div>

            {/* Mensagem única */}
            {tipoMensagem === "unica" && (
              <>
                <div className="h-px bg-[#e8eaec]" />
                <div className="flex flex-col gap-[8px]">
                  <Label>Mensagem</Label>
                  <MensagemArea value={mensagemUnica} onChange={setMensagemUnica} />
                  <VariaveisRow />
                </div>
              </>
            )}

            {/* Teste A/B */}
            {tipoMensagem === "ab" && (
              <>
                <div className="h-px bg-[#e8eaec]" />

                {/* Tabs de variantes */}
                <div className="flex items-center gap-[8px] flex-wrap">
                  {variantes.map((v, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveVariante(i)}
                      className={`flex items-center gap-[4px] h-[36px] px-[12px] rounded-[6px] text-sm font-semibold transition-colors ${activeVariante === i ? "bg-[#f2f4ff] text-[#2724ed]" : "text-[#6f7680] hover:bg-gray-50"}`}
                    >
                      {v.nome}
                      <IcMoreVert />
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={addVariante}
                    className="flex items-center gap-[4px] text-sm font-semibold text-[#343b44] hover:opacity-70 transition-opacity"
                  >
                    <IcAdd />
                    Adicionar variante
                  </button>
                </div>

                {/* Editor da variante ativa */}
                {variantes[activeVariante] && (
                  <div className="flex flex-col gap-[8px]">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#12171d]">Mensagem</span>
                      <button
                        type="button"
                        className="flex items-center gap-[4px] rounded-[8px] border border-[#e8eaec] bg-[#fcfcfc] px-[12px] py-[8px] text-sm font-semibold text-[#343b44] hover:bg-gray-50 transition-colors"
                      >
                        Campo dinâmico
                        <IcChevronDown />
                      </button>
                    </div>
                    <MensagemArea
                      value={variantes[activeVariante].mensagem}
                      onChange={(v) => updateVarianteMensagem(activeVariante, v)}
                    />
                    <VariaveisRow />
                  </div>
                )}

                <div className="h-px bg-[#e8eaec]" />

                {/* Distribuição de variantes */}
                <div className="bg-[#f1f2f3] rounded-[8px] p-[16px] flex flex-col gap-[16px]">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#12171d]">Distribuição de variantes</p>
                      <p className="text-sm text-[#4c535c]">Arraste os divisores ou edite os valores.</p>
                    </div>
                    <button
                      type="button"
                      onClick={dividirIgualmente}
                      className="rounded-[8px] border border-[#e8eaec] bg-[#fcfcfc] px-[12px] py-[8px] text-sm font-semibold text-[#343b44] hover:bg-gray-50 transition-colors shrink-0"
                    >
                      Dividir igualmente
                    </button>
                  </div>
                  {/* Color bar */}
                  <div className="flex h-[8px] rounded-full overflow-hidden">
                    {variantes.map((v, i) => (
                      <div
                        key={i}
                        style={{ flex: v.percentual, background: VARIANT_COLORS[i % VARIANT_COLORS.length] }}
                      />
                    ))}
                  </div>
                  {/* % inputs */}
                  <div className="flex flex-wrap gap-[16px]">
                    {variantes.map((v, i) => (
                      <div key={i} className="flex items-center gap-[12px]">
                        <div className="flex items-center gap-[8px]">
                          <div
                            className="w-[16px] h-[16px] rounded-full shrink-0"
                            style={{ background: VARIANT_COLORS[i % VARIANT_COLORS.length] }}
                          />
                          <span className="text-sm font-medium text-[#343b44]">{v.nome}</span>
                        </div>
                        <div className="flex items-center gap-[4px] rounded-[8px] border border-[#e8eaec] bg-[#fcfcfc] px-[12px] py-[8px]">
                          <input
                            type="number"
                            min={1}
                            max={99}
                            value={v.percentual}
                            onChange={(e) => updateVariantePercentual(i, parseInt(e.target.value) || 1)}
                            className="w-[32px] text-sm text-[#12171d] outline-none bg-transparent"
                          />
                          <span className="text-sm text-[#6f7680]">%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
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
            className={`rounded-[8px] px-[16px] py-[9px] text-sm font-semibold transition-colors ${canAdd ? "text-white hover:opacity-90 cursor-pointer" : "bg-[#f8f8f9] text-[#9ca3af] border border-[#e8eaec] cursor-not-allowed"}`}
            style={canAdd ? { background: COLOR } : undefined}
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}
