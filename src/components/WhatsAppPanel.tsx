"use client";

import { useState } from "react";
import CollapsedPanelBar from "./CollapsedPanelBar";
import { NodeIconImg } from "@/lib/nodeConfig";

export interface WhatsAppVariante {
  nome: string;
  mensagem: string;
  percentual: number;
}

export interface WhatsAppNodeData {
  nome: string;
  provedor: string;
  naoPerturbe: boolean;
  tipoMensagem: "unica" | "ab";
  mensagemUnica: string;
  variantes: WhatsAppVariante[];
}

interface WhatsAppPanelProps {
  onClose: () => void;
  onAdd: (data: WhatsAppNodeData) => void;
  onRemove?: () => void;
  initialData?: Partial<WhatsAppNodeData>;
}

const COLOR = "#16a34a";
const PROVEDORES = ["Pool Brasil", "Pool Internacional", "Pool Transacional"];
const VARIANT_COLORS = ["#5290f5", "#3cca71", "#f88332", "#a855f7", "#ef4444"];

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
const IcMoreVert = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#6f7680">
    <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
  </svg>
);
const IcAdd = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#343b44" strokeWidth="1.8" strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);
const IcChangeCircle = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#343b44" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);
const IcEdit = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path d="M14.7 2.3a1 1 0 0 1 1.4 0l1.6 1.6a1 1 0 0 1 0 1.4l-10 10L4 16l.7-3.7 10-10z" stroke="#343b44" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const NodeIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M11.99 0C5.373 0 0 5.373 0 11.99c0 2.11.55 4.094 1.513 5.815L.057 23.929l6.304-1.474A11.944 11.944 0 0 0 11.99 24C18.607 24 24 18.627 24 12.01 24 5.393 18.607 0 11.99 0zm.01 21.818a9.828 9.828 0 0 1-5.014-1.368l-.36-.214-3.742.982 1-3.646-.233-.374a9.818 9.818 0 0 1-1.505-5.244c0-5.425 4.415-9.84 9.854-9.84 2.629 0 5.1 1.024 6.959 2.884A9.777 9.777 0 0 1 21.83 12c0 5.425-4.415 9.818-9.83 9.818z" />
  </svg>
);

const inputClass =
  "w-full rounded-[8px] border border-[#e8eaec] bg-[#fcfcfc] px-[12px] py-[8px] text-sm text-[#12171d] placeholder:text-[#6f7680] outline-none focus:border-[#16a34a] transition-colors h-[40px]";

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

/* ── WhatsApp bubble preview ── */
function WhatsAppPreview({ message }: { message: string }) {
  return (
    <div className="rounded-[8px] overflow-hidden w-[308px] self-center" style={{ background: "#e6dbd0" }}>
      <div className="h-[48px]" style={{ background: "#004f48" }} />
      <div className="px-[8px] pb-[16px] pt-[4px]">
        <div className="bg-white rounded-tr-[8px] rounded-br-[8px] rounded-bl-[8px] p-[16px]">
          <p className="text-sm text-[#667085] leading-[20px] whitespace-pre-wrap">
            {message || "Prévia da mensagem aparecerá aqui..."}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Distribuição de variantes ── */
function Distribuicao({
  variantes,
  onUpdate,
  onDividir,
}: {
  variantes: WhatsAppVariante[];
  onUpdate: (i: number, pct: number) => void;
  onDividir: () => void;
}) {
  return (
    <div className="bg-[#f1f2f3] rounded-[8px] p-[16px] flex flex-col gap-[16px]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-[#12171d]">Distribuição de variantes</p>
          <p className="text-sm text-[#4c535c]">Arraste os divisores ou edite os valores.</p>
        </div>
        <button
          type="button"
          onClick={onDividir}
          className="rounded-[8px] border border-[#e8eaec] bg-[#fcfcfc] px-[12px] py-[8px] text-sm font-semibold text-[#343b44] hover:bg-gray-50 transition-colors shrink-0"
        >
          Dividir igualmente
        </button>
      </div>
      <div className="flex h-[8px] rounded-full overflow-hidden">
        {variantes.map((v, i) => (
          <div key={i} style={{ flex: v.percentual, background: VARIANT_COLORS[i % VARIANT_COLORS.length] }} />
        ))}
      </div>
      <div className="flex flex-wrap gap-[16px]">
        {variantes.map((v, i) => (
          <div key={i} className="flex items-center gap-[12px]">
            <div className="flex items-center gap-[8px]">
              <div className="w-[16px] h-[16px] rounded-full shrink-0" style={{ background: VARIANT_COLORS[i % VARIANT_COLORS.length] }} />
              <span className="text-sm font-medium text-[#343b44]">{v.nome}</span>
            </div>
            <div className="flex items-center gap-[4px] rounded-[8px] border border-[#e8eaec] bg-[#fcfcfc] px-[12px] py-[8px]">
              <input
                type="number"
                min={1}
                max={99}
                value={v.percentual}
                onChange={(e) => onUpdate(i, parseInt(e.target.value) || 1)}
                className="w-[32px] text-sm text-[#12171d] outline-none bg-transparent"
              />
              <span className="text-sm text-[#6f7680]">%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main component ── */
export default function WhatsAppPanel({ onClose, onAdd, onRemove, initialData }: WhatsAppPanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [nome, setNome] = useState(initialData?.nome ?? "");
  const [provedor, setProvedor] = useState(initialData?.provedor ?? "");
  const [naoPerturbe, setNaoPerturbe] = useState(initialData?.naoPerturbe ?? true);
  const [tipoMensagem, setTipoMensagem] = useState<"unica" | "ab" | null>(
    initialData?.tipoMensagem ?? null
  );
  const [mensagemUnica, setMensagemUnica] = useState(initialData?.mensagemUnica ?? "");
  const [variantes, setVariantes] = useState<WhatsAppVariante[]>(
    initialData?.variantes ?? [
      { nome: "Variante A", mensagem: "", percentual: 50 },
      { nome: "Variante B", mensagem: "", percentual: 50 },
    ]
  );
  const [activeVariante, setActiveVariante] = useState(0);

  if (collapsed) {
    return (
      <CollapsedPanelBar
        title="Envio de WhatsApp"
        color={COLOR}
        icon={<NodeIconImg type="whatsapp" size={32} />}
        onExpand={() => setCollapsed(false)}
        onClose={onClose}
      />
    );
  }

  const canAdd = nome.trim().length > 0 && provedor.length > 0 && tipoMensagem !== null;

  const handleAdd = () => {
    if (!canAdd) return;
    onAdd({
      nome,
      provedor,
      naoPerturbe,
      tipoMensagem: tipoMensagem!,
      mensagemUnica,
      variantes,
    });
  };

  const addVariante = () => {
    const next = variantes.length + 1;
    const letra = String.fromCharCode(64 + next);
    const pct = Math.floor(100 / next);
    setVariantes((prev) => [
      ...prev.map((v) => ({ ...v, percentual: pct })),
      { nome: `Variante ${letra}`, mensagem: "", percentual: 100 - pct * (next - 1) },
    ]);
    setActiveVariante(next - 1);
  };

  const updateVarianteMensagem = (idx: number, msg: string) =>
    setVariantes((prev) => prev.map((v, i) => (i === idx ? { ...v, mensagem: msg } : v)));

  const updateVariantePercentual = (idx: number, pct: number) =>
    setVariantes((prev) => prev.map((v, i) => (i === idx ? { ...v, percentual: pct } : v)));

  const dividirIgualmente = () => {
    const pct = Math.floor(100 / variantes.length);
    const rem = 100 - pct * variantes.length;
    setVariantes((prev) => prev.map((v, i) => ({ ...v, percentual: pct + (i === 0 ? rem : 0) })));
  };

  const activeMensagem = tipoMensagem === "unica" ? mensagemUnica : (variantes[activeVariante]?.mensagem ?? "");

  return (
    <div
      className="fixed z-50 flex flex-col rounded-[12px] border border-[#e8eaec] bg-white shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(39,44,55,0.08)]"
      style={{ bottom: "24px", right: "24px", width: 660, height: "79vh" }}
      onWheel={(e) => e.nativeEvent.stopImmediatePropagation()}
    >
      {/* Header */}
      <div className="flex items-center gap-[12px] px-[16px] py-[14px] border-b border-[#e8eaec] shrink-0">
        <div className="flex items-center justify-center rounded-[10px] shrink-0" style={{ width: 52, height: 52, background: COLOR }}>
          <NodeIcon />
        </div>
        <span className="flex-1 text-lg font-semibold text-[#12171d]">Envio de WhatsApp</span>
        <button onClick={() => setCollapsed(true)} className="flex items-center justify-center size-[36px] rounded-[8px] hover:bg-gray-100 transition-colors">
          <IcArrowRight />
        </button>
        <div className="w-px h-[24px] bg-[#e8eaec]" />
        <button onClick={onClose} className="flex items-center justify-center size-[36px] rounded-[8px] hover:bg-gray-100 transition-colors">
          <IcClose />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-[20px] flex flex-col gap-[16px]">

        {/* Nome + Provedor */}
        <div className="flex gap-[8px]">
          <div className="flex-1 flex flex-col">
            <Label required>Nome</Label>
            <input className={inputClass} placeholder="Digite o nome" value={nome} onChange={(e) => setNome(e.target.value)} />
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
              <span className="absolute right-[8px] top-1/2 -translate-y-1/2 pointer-events-none"><IcChevronDown /></span>
            </div>
          </div>
        </div>

        <div className="h-px bg-[#e8eaec]" />

        {/* Toggle */}
        <div className="border border-[#e8eaec] rounded-[8px] bg-[#fcfcfc] flex items-center justify-between px-[12px] py-[16px]">
          <span className="text-sm font-medium text-[#12171d]">Respeitar as restrições de entrega (Não perturbe)</span>
          <button
            type="button"
            role="switch"
            aria-checked={naoPerturbe}
            onClick={() => setNaoPerturbe((v) => !v)}
            className={`inline-flex h-[20px] w-[36px] shrink-0 cursor-pointer rounded-full p-[2px] transition-colors items-center ${naoPerturbe ? "bg-[#2724ed] justify-end" : "bg-[#e8eaec] justify-start"}`}
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

            {/* Seleção inicial */}
            {!tipoMensagem && (
              <div className="flex gap-[8px]">
                {(["unica", "ab"] as const).map((tipo) => (
                  <button
                    key={tipo}
                    type="button"
                    onClick={() => setTipoMensagem(tipo)}
                    className="flex-1 flex items-center gap-[12px] p-[12px] rounded-[8px] border bg-[#fcfcfc] text-left"
                    style={{ borderColor: "#e8eaec" }}
                  >
                    {tipo === "unica" ? <IcEmail /> : <IcContrast />}
                    <span className="text-sm font-medium text-[#343b44] flex-1">
                      {tipo === "unica" ? "Mensagem única" : "Teste A/B"}
                    </span>
                    <IcHelp />
                  </button>
                ))}
              </div>
            )}

            {/* Após seleção */}
            {tipoMensagem && (
              <>
                {/* Header do tipo selecionado */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[8px]">
                    {tipoMensagem === "unica" ? <IcEmail /> : <IcContrast />}
                    <span className="text-base font-semibold text-[#12171d]">
                      {tipoMensagem === "unica" ? "Mensagem única" : "Teste A/B"}
                    </span>
                  </div>
                  <div className="flex items-center gap-[8px]">
                    <button
                      type="button"
                      onClick={() => setTipoMensagem(null)}
                      className="flex items-center gap-[4px] rounded-[8px] border border-[#e8eaec] bg-[#fcfcfc] px-[12px] py-[8px] text-sm font-semibold text-[#343b44] hover:bg-gray-50 transition-colors"
                    >
                      <IcChangeCircle />
                      Alterar tipo de mensagem
                    </button>
                    <button
                      type="button"
                      className="flex items-center gap-[4px] rounded-[8px] border border-[#e8eaec] bg-[#fcfcfc] px-[12px] py-[8px] text-sm font-semibold text-[#343b44] hover:bg-gray-50 transition-colors"
                    >
                      <IcEdit />
                      Editar
                    </button>
                  </div>
                </div>

                <div className="h-px bg-[#e8eaec]" />

                {/* Distribuição */}
                {tipoMensagem === "unica" ? (
                  <Distribuicao
                    variantes={[{ nome: "Variante A", mensagem: mensagemUnica, percentual: 100 }]}
                    onUpdate={() => {}}
                    onDividir={() => {}}
                  />
                ) : (
                  <>
                    <Distribuicao
                      variantes={variantes}
                      onUpdate={updateVariantePercentual}
                      onDividir={dividirIgualmente}
                    />

                    <div className="h-px bg-[#e8eaec]" />

                    {/* Tabs variantes */}
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
                  </>
                )}

                <div className="h-px bg-[#e8eaec]" />

                {/* Editor de mensagem */}
                <div className="flex flex-col gap-[8px]">
                  <label className="text-sm font-medium text-[#343b44]">Mensagem</label>
                  <textarea
                    className="w-full rounded-[8px] border border-[#e8eaec] bg-[#fcfcfc] px-[12px] py-[12px] text-sm text-[#12171d] placeholder:text-[#6f7680] outline-none focus:border-[#16a34a] transition-colors resize-none"
                    rows={4}
                    placeholder="Digite a mensagem aqui"
                    value={tipoMensagem === "unica" ? mensagemUnica : (variantes[activeVariante]?.mensagem ?? "")}
                    onChange={(e) => {
                      if (tipoMensagem === "unica") setMensagemUnica(e.target.value);
                      else updateVarianteMensagem(activeVariante, e.target.value);
                    }}
                  />
                </div>

                {/* Preview WhatsApp */}
                <div className="h-px bg-[#e8eaec]" />
                <WhatsAppPreview message={activeMensagem} />
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
          <button onClick={onClose} className="rounded-[8px] border border-[#e8eaec] px-[16px] py-[9px] text-sm font-semibold text-[#343b44] hover:bg-gray-50 transition-colors">
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
