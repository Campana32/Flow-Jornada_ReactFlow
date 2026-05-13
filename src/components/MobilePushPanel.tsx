"use client";

import { useState } from "react";
import CollapsedPanelBar from "./CollapsedPanelBar";
import { NodeIconImg } from "@/lib/nodeConfig";

export interface PushVariante {
  nome: string;
  titulo: string;
  mensagem: string;
  clickAction: string;
}

export interface MobilePushNodeData {
  nome: string;
  notificacaoId: string;
  naoPerturbe: boolean;
  tipoMensagem: "unica" | "ab";
  varianteUnica: PushVariante;
  variantes: PushVariante[];
}

interface MobilePushPanelProps {
  onClose: () => void;
  onAdd: (data: MobilePushNodeData) => void;
  onRemove?: () => void;
  initialData?: Partial<MobilePushNodeData>;
}

const COLOR = "#f77316";

const NOTIFICACAO_IDS = ["OneSignal", "Firebase FCM", "Expo Push", "Custom ID"];

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
const IcUpload = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6f7680" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);
const NodeIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
  </svg>
);

const inputClass =
  "w-full rounded-[8px] border border-[#e8eaec] bg-[#fcfcfc] px-[12px] py-[8px] text-sm text-[#12171d] placeholder:text-[#6f7680] outline-none focus:border-[#f77316] transition-colors h-[40px]";

function Label({ children, required, optional }: { children: React.ReactNode; required?: boolean; optional?: boolean }) {
  return (
    <div className="flex items-center gap-[6px] mb-[6px]">
      <span className="text-sm font-medium text-[#343b44]">{children}</span>
      {required && (
        <svg width="8" height="8" viewBox="0 0 8 8" fill="#d92d20">
          <path d="M4 0L4.9 2.8L7.6 1.4L6.2 4L9 4.9L6.2 5.8L7.6 8.4L4.9 7L4 9.8L3.1 7L0.4 8.4L1.8 5.8L-1 4.9L1.8 4L0.4 1.4L3.1 2.8Z" />
        </svg>
      )}
      {optional && <span className="text-xs text-[#6f7680]">(Opcional)</span>}
    </div>
  );
}

const emptyVariante = (nome: string): PushVariante => ({
  nome,
  titulo: "",
  mensagem: "",
  clickAction: "",
});

/* ── Form fields for a single Push variant ── */
function PushForm({
  variante,
  onChange,
}: {
  variante: PushVariante;
  onChange: (v: PushVariante) => void;
}) {
  return (
    <div className="flex flex-col gap-[16px]">
      <div className="h-px bg-[#e8eaec]" />

      {/* Título */}
      <div className="flex flex-col">
        <Label required>Título</Label>
        <input
          className={inputClass}
          placeholder="Digite o título aqui"
          value={variante.titulo}
          onChange={(e) => onChange({ ...variante, titulo: e.target.value })}
        />
      </div>

      {/* Mensagem */}
      <div className="flex flex-col">
        <Label required>Mensagem</Label>
        <textarea
          className="w-full rounded-[8px] border border-[#e8eaec] bg-[#fcfcfc] px-[12px] py-[12px] text-sm text-[#12171d] placeholder:text-[#6f7680] outline-none focus:border-[#f77316] transition-colors resize-none shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]"
          rows={5}
          placeholder="Digite a mensagem aqui"
          value={variante.mensagem}
          onChange={(e) => onChange({ ...variante, mensagem: e.target.value })}
        />
      </div>

      {/* Click Action */}
      <div className="flex flex-col">
        <Label>Click Action</Label>
        <input
          className={inputClass}
          placeholder="Digite o link aqui"
          value={variante.clickAction}
          onChange={(e) => onChange({ ...variante, clickAction: e.target.value })}
        />
      </div>

      <div className="h-px bg-[#e8eaec]" />

      {/* Carregar imagem */}
      <div className="flex flex-col gap-[6px]">
        <Label optional>Carregar imagem</Label>
        <div className="bg-[#fcfcfc] border border-dashed border-[#e8eaec] rounded-[8px] flex flex-col items-center justify-center gap-[12px] p-[16px]">
          <div className="bg-[#f1f2f3] rounded-[4px] p-[6px]">
            <IcUpload />
          </div>
          <div className="flex flex-col items-center gap-[4px]">
            <p className="text-xs text-center text-[#12171d]">
              <span className="text-[#2724ed] underline cursor-pointer">Clique aqui</span>
              {" ou arraste a imagem para enviar"}
            </p>
            <p className="text-xs text-[#a0a6ad] text-center whitespace-pre-line">
              {"Tamanho recomendado: 24x24px\nFormato suportado: PNG"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main component ── */
export default function MobilePushPanel({ onClose, onAdd, onRemove, initialData }: MobilePushPanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  const [nome, setNome] = useState(initialData?.nome ?? "");
  const [notificacaoId, setNotificacaoId] = useState(initialData?.notificacaoId ?? "");
  const [naoPerturbe, setNaoPerturbe] = useState(initialData?.naoPerturbe ?? true);
  const [tipoMensagem, setTipoMensagem] = useState<"unica" | "ab">(
    initialData?.tipoMensagem ?? "unica"
  );
  const [varianteUnica, setVarianteUnica] = useState<PushVariante>(
    initialData?.varianteUnica ?? emptyVariante("Push")
  );
  const [variantes, setVariantes] = useState<PushVariante[]>(
    initialData?.variantes ?? [emptyVariante("Push A"), emptyVariante("Push B")]
  );
  const [activeVariante, setActiveVariante] = useState(0);

  if (collapsed) {
    return (
      <CollapsedPanelBar
        title="Envio de Mobile Push"
        color={COLOR}
        icon={<NodeIconImg type="mobilePush" size={32} />}
        onExpand={() => setCollapsed(false)}
        onClose={onClose}
      />
    );
  }

  const canAdd = nome.trim().length > 0 && notificacaoId.length > 0;

  const handleAdd = () => {
    if (!canAdd) return;
    onAdd({ nome, notificacaoId, naoPerturbe, tipoMensagem, varianteUnica, variantes });
  };

  const addVariante = () => {
    const next = variantes.length + 1;
    setVariantes((prev) => [...prev, emptyVariante(`Push ${String.fromCharCode(64 + next)}`)]);
    setActiveVariante(next - 1);
  };

  const updateVariante = (idx: number, v: PushVariante) => {
    setVariantes((prev) => prev.map((item, i) => (i === idx ? v : item)));
  };

  return (
    <div
      className="fixed z-50 flex flex-col rounded-[12px] border border-[#e8eaec] bg-white shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(39,44,55,0.08)]"
      style={{ bottom: "24px", right: "24px", width: 660, height: "79vh" }}
      onWheel={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center gap-[12px] px-[16px] py-[14px] border-b border-[#e8eaec] shrink-0">
        <div className="flex items-center justify-center rounded-[10px] shrink-0" style={{ width: 52, height: 52, background: COLOR }}>
          <NodeIcon />
        </div>
        <span className="flex-1 text-lg font-semibold text-[#12171d]">Envio de Mobile Push</span>
        <button onClick={() => setCollapsed(true)} className="flex items-center justify-center size-[36px] rounded-[8px] hover:bg-gray-100 transition-colors">
          <IcArrowRight />
        </button>
        <div className="w-px h-[24px] bg-[#e8eaec]" />
        <button onClick={onClose} className="flex items-center justify-center size-[36px] rounded-[8px] hover:bg-gray-100 transition-colors">
          <IcClose />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto p-[20px] flex flex-col gap-[16px]">

        {/* Nome + ID de notificação */}
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
            <Label required>Selecione ID de notificação</Label>
            <div className="relative">
              <select
                className={`${inputClass} appearance-none pr-[28px] cursor-pointer`}
                value={notificacaoId}
                onChange={(e) => setNotificacaoId(e.target.value)}
              >
                <option value="" disabled>Selecione um ID</option>
                {NOTIFICACAO_IDS.map((id) => <option key={id} value={id}>{id}</option>)}
              </select>
              <span className="absolute right-[8px] top-1/2 -translate-y-1/2 pointer-events-none">
                <IcChevronDown />
              </span>
            </div>
          </div>
        </div>

        <div className="h-px bg-[#e8eaec]" />

        {/* Toggle Não perturbe */}
        <div className="border border-[#e8eaec] rounded-[8px] bg-[#fcfcfc] flex items-center justify-between px-[12px] py-[16px] shrink-0">
          <span className="text-sm font-medium text-[#12171d]">
            Respeitar as restrições de entrega (Não perturbe)
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={naoPerturbe}
            onClick={() => setNaoPerturbe((v) => !v)}
            className={`relative inline-flex h-[20px] w-[36px] shrink-0 cursor-pointer rounded-full p-[2px] transition-colors ${naoPerturbe ? "bg-[#2724ed] justify-end" : "bg-[#e8eaec] justify-start"} flex items-center`}
          >
            <span className="size-[16px] rounded-full bg-white shadow-sm" />
          </button>
        </div>

        <div className="h-px bg-[#e8eaec]" />

        {/* Tipo de Mensagem */}
        <div className="bg-[#f1f2f3] border border-[#e8eaec] rounded-[16px] overflow-hidden shrink-0">
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
                  className="flex-1 flex items-center gap-[12px] p-[12px] rounded-[8px] border bg-[#fcfcfc] text-left"
                  style={{ borderColor: "#e8eaec" }}
                >
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
              <PushForm
                variante={varianteUnica}
                onChange={setVarianteUnica}
              />
            )}

            {/* Teste A/B */}
            {tipoMensagem === "ab" && (
              <>
                <div className="h-px bg-[#e8eaec]" />

                {/* Tabs */}
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

                {variantes[activeVariante] && (
                  <PushForm
                    variante={variantes[activeVariante]}
                    onChange={(v) => updateVariante(activeVariante, v)}
                  />
                )}
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
