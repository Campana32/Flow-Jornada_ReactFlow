"use client";

import { useState } from "react";
import CollapsedPanelBar from "./CollapsedPanelBar";
import { NodeIconImg } from "@/lib/nodeConfig";

export interface WebPushBotao {
  nome: string;
  texto: string;
  link: string;
  adicionarIcone: boolean;
}

export interface WebPushVariante {
  nome: string;
  titulo: string;
  mensagem: string;
  percentual: number;
}

export interface WebPushNodeData {
  nome: string;
  provedor: string;
  naoPerturbe: boolean;
  tipoMensagem: "unica" | "ab";
  titulo: string;
  mensagem: string;
  variantes: WebPushVariante[];
  midiaAtiva: boolean;
  adicionarImagem: boolean;
  adicionarIcone: boolean;
  adicionarBadge: boolean;
  botoesAtivos: boolean;
  botoes: WebPushBotao[];
  comportamentoAtivo: boolean;
  clickUrl: string;
  naoDescartar: boolean;
  notificacaoSilenciosa: boolean;
  agruparNotificacoes: boolean;
  padraVibracao: boolean;
  linguagemAtiva: boolean;
  linguagem: string;
}

interface WebPushPanelProps {
  onClose: () => void;
  onAdd: (data: WebPushNodeData) => void;
  onRemove?: () => void;
  initialData?: Partial<WebPushNodeData>;
}

const COLOR = "#7c3aed";
const PROVEDORES = ["Pool Brasil", "Pool Internacional", "Pool Transacional"];
const LINGUAGENS = ["Português (BR)", "English", "Español", "Français"];
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
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
  </svg>
);

const inputClass =
  "w-full rounded-[8px] border border-[#e8eaec] bg-[#fcfcfc] px-[12px] py-[8px] text-sm text-[#12171d] placeholder:text-[#6f7680] outline-none focus:border-[#7c3aed] transition-colors h-[40px]";

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

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`inline-flex h-[20px] w-[36px] shrink-0 cursor-pointer rounded-full p-[2px] transition-colors items-center ${checked ? "bg-[#2724ed] justify-end" : "bg-[#e8eaec] justify-start"}`}
    >
      <span className="size-[16px] rounded-full bg-white shadow-sm" />
    </button>
  );
}

function Checkbox({ checked, onChange, label, badge }: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  badge?: string;
}) {
  return (
    <label className="flex items-center gap-[8px] cursor-pointer select-none">
      <div
        onClick={() => onChange(!checked)}
        className={`w-[16px] h-[16px] rounded-[4px] border flex items-center justify-center shrink-0 transition-colors ${checked ? "bg-[#2724ed] border-[#2724ed]" : "border-[#d2d6db] bg-white"}`}
      >
        {checked && (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className="text-sm font-medium text-[#343b44]">{label}</span>
      {badge && (
        <span className="text-xs font-medium text-[#2724ed] bg-[#f2f4ff] border border-[#dce2ff] px-[6px] py-[2px] rounded-full">
          {badge}
        </span>
      )}
    </label>
  );
}

function AccordionToggle({ title, enabled, onToggle, children }: {
  title: string;
  enabled: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-[#e8eaec] rounded-[8px] overflow-hidden bg-[#fcfcfc] shrink-0">
      <div className="flex items-center justify-between px-[12px] h-[54px]">
        <span className="text-sm font-medium text-[#12171d]">{title}</span>
        <Toggle checked={enabled} onChange={onToggle} />
      </div>
      {enabled && (
        <div className="border-t border-[#e8eaec] bg-white px-[12px] py-[16px] flex flex-col gap-[16px]">
          {children}
        </div>
      )}
    </div>
  );
}

/* ── Main component ── */
export default function WebPushPanel({ onClose, onAdd, onRemove, initialData }: WebPushPanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  const [nome, setNome] = useState(initialData?.nome ?? "");
  const [provedor, setProvedor] = useState(initialData?.provedor ?? "");
  const [naoPerturbe, setNaoPerturbe] = useState(initialData?.naoPerturbe ?? true);
  const [tipoMensagem, setTipoMensagem] = useState<"unica" | "ab">(initialData?.tipoMensagem ?? "unica");

  // Conteúdo (mensagem única)
  const [titulo, setTitulo] = useState(initialData?.titulo ?? "");
  const [mensagem, setMensagem] = useState(initialData?.mensagem ?? "");

  // A/B variantes
  const [variantes, setVariantes] = useState<WebPushVariante[]>(
    initialData?.variantes ?? [
      { nome: "Variante A", titulo: "", mensagem: "", percentual: 50 },
      { nome: "Variante B", titulo: "", mensagem: "", percentual: 50 },
    ]
  );
  const [activeVariante, setActiveVariante] = useState(0);

  // Mídia
  const [midiaAtiva, setMidiaAtiva] = useState(initialData?.midiaAtiva ?? false);
  const [adicionarImagem, setAdicionarImagem] = useState(initialData?.adicionarImagem ?? false);
  const [adicionarIcone, setAdicionarIcone] = useState(initialData?.adicionarIcone ?? false);
  const [adicionarBadge, setAdicionarBadge] = useState(initialData?.adicionarBadge ?? false);

  // Botões
  const [botoesAtivos, setBotoesAtivos] = useState(initialData?.botoesAtivos ?? false);
  const [botoes, setBotoes] = useState<WebPushBotao[]>(
    initialData?.botoes ?? [{ nome: "Botão 1", texto: "", link: "", adicionarIcone: false }]
  );
  const [activeBotao, setActiveBotao] = useState(0);

  // Comportamento
  const [comportamentoAtivo, setComportamentoAtivo] = useState(initialData?.comportamentoAtivo ?? false);
  const [clickUrl, setClickUrl] = useState(initialData?.clickUrl ?? "");
  const [naoDescartar, setNaoDescartar] = useState(initialData?.naoDescartar ?? false);
  const [notificacaoSilenciosa, setNotificacaoSilenciosa] = useState(initialData?.notificacaoSilenciosa ?? false);
  const [agruparNotificacoes, setAgruparNotificacoes] = useState(initialData?.agruparNotificacoes ?? false);
  const [padraVibracao, setPadraVibracao] = useState(initialData?.padraVibracao ?? false);

  // Linguagem
  const [linguagemAtiva, setLinguagemAtiva] = useState(initialData?.linguagemAtiva ?? false);
  const [linguagem, setLinguagem] = useState(initialData?.linguagem ?? "");

  if (collapsed) {
    return (
      <CollapsedPanelBar
        title="Envio de Web Push"
        color={COLOR}
        icon={<NodeIconImg type="webPush" size={32} />}
        onExpand={() => setCollapsed(false)}
        onClose={onClose}
      />
    );
  }

  const canAdd = nome.trim().length > 0 && provedor.length > 0;

  const handleAdd = () => {
    if (!canAdd) return;
    onAdd({
      nome, provedor, naoPerturbe, tipoMensagem, titulo, mensagem, variantes,
      midiaAtiva, adicionarImagem, adicionarIcone, adicionarBadge,
      botoesAtivos, botoes, comportamentoAtivo, clickUrl,
      naoDescartar, notificacaoSilenciosa, agruparNotificacoes, padraVibracao,
      linguagemAtiva, linguagem,
    });
  };

  const addVariante = () => {
    const next = variantes.length + 1;
    const letra = String.fromCharCode(64 + next);
    const pct = Math.floor(100 / next);
    setVariantes((prev) => [
      ...prev.map((v) => ({ ...v, percentual: pct })),
      { nome: `Variante ${letra}`, titulo: "", mensagem: "", percentual: 100 - pct * (next - 1) },
    ]);
    setActiveVariante(next - 1);
  };

  const updateVariante = (idx: number, field: "titulo" | "mensagem", val: string) =>
    setVariantes((prev) => prev.map((v, i) => (i === idx ? { ...v, [field]: val } : v)));

  const updateVariantePercentual = (idx: number, pct: number) =>
    setVariantes((prev) => prev.map((v, i) => (i === idx ? { ...v, percentual: pct } : v)));

  const dividirIgualmente = () => {
    const pct = Math.floor(100 / variantes.length);
    const rem = 100 - pct * variantes.length;
    setVariantes((prev) => prev.map((v, i) => ({ ...v, percentual: pct + (i === 0 ? rem : 0) })));
  };

  const addBotao = () => {
    const next = botoes.length + 1;
    setBotoes((prev) => [...prev, { nome: `Botão ${next}`, texto: "", link: "", adicionarIcone: false }]);
    setActiveBotao(next - 1);
  };

  const updateBotao = (idx: number, field: keyof WebPushBotao, val: string | boolean) =>
    setBotoes((prev) => prev.map((b, i) => (i === idx ? { ...b, [field]: val } : b)));

  const currentTitulo = tipoMensagem === "unica" ? titulo : (variantes[activeVariante]?.titulo ?? "");
  const currentMensagem = tipoMensagem === "unica" ? mensagem : (variantes[activeVariante]?.mensagem ?? "");
  const setCurrentTitulo = (v: string) => tipoMensagem === "unica" ? setTitulo(v) : updateVariante(activeVariante, "titulo", v);
  const setCurrentMensagem = (v: string) => tipoMensagem === "unica" ? setMensagem(v) : updateVariante(activeVariante, "mensagem", v);

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
        <span className="flex-1 text-lg font-semibold text-[#12171d]">Envio de Web Push</span>
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

        {/* Nome + Provedor */}
        <div className="flex gap-[8px]">
          <div className="flex-1 flex flex-col">
            <Label required>Nome</Label>
            <input className={inputClass} placeholder="Digite o nome" value={nome} onChange={(e) => setNome(e.target.value)} />
          </div>
          <div className="flex-1 flex flex-col">
            <Label required>Selecione o provedor de serviços</Label>
            <div className="relative">
              <select className={`${inputClass} appearance-none pr-[28px] cursor-pointer`} value={provedor} onChange={(e) => setProvedor(e.target.value)}>
                <option value="" disabled>Selecione uma Pool</option>
                {PROVEDORES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <span className="absolute right-[8px] top-1/2 -translate-y-1/2 pointer-events-none"><IcChevronDown /></span>
            </div>
          </div>
        </div>

        <div className="h-px bg-[#e8eaec]" />

        {/* Toggle Não perturbe */}
        <div className="border border-[#e8eaec] rounded-[8px] bg-[#fcfcfc] flex items-center justify-between px-[12px] py-[16px] shrink-0">
          <span className="text-sm font-medium text-[#12171d]">Respeitar as restrições de entrega (Não perturbe)</span>
          <Toggle checked={naoPerturbe} onChange={() => setNaoPerturbe((v) => !v)} />
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
                  <span className="text-sm font-medium text-[#343b44] flex-1">{tipo === "unica" ? "Mensagem única" : "Teste A/B"}</span>
                  <IcHelp />
                </button>
              ))}
            </div>

            {/* A/B tabs + distribuição */}
            {tipoMensagem === "ab" && (
              <>
                <div className="h-px bg-[#e8eaec]" />
                {/* Distribuição */}
                <div className="bg-[#f1f2f3] rounded-[8px] p-[16px] flex flex-col gap-[16px]">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#12171d]">Distribuição de variantes</p>
                      <p className="text-sm text-[#4c535c]">Arraste os divisores ou edite os valores.</p>
                    </div>
                    <button type="button" onClick={dividirIgualmente} className="rounded-[8px] border border-[#e8eaec] bg-[#fcfcfc] px-[12px] py-[8px] text-sm font-semibold text-[#343b44] hover:bg-gray-50 transition-colors shrink-0">
                      Dividir igualmente
                    </button>
                  </div>
                  <div className="flex h-[8px] rounded-full overflow-hidden">
                    {variantes.map((v, i) => <div key={i} style={{ flex: v.percentual, background: VARIANT_COLORS[i % VARIANT_COLORS.length] }} />)}
                  </div>
                  <div className="flex flex-wrap gap-[16px]">
                    {variantes.map((v, i) => (
                      <div key={i} className="flex items-center gap-[12px]">
                        <div className="flex items-center gap-[8px]">
                          <div className="w-[16px] h-[16px] rounded-full shrink-0" style={{ background: VARIANT_COLORS[i % VARIANT_COLORS.length] }} />
                          <span className="text-sm font-medium text-[#343b44]">{v.nome}</span>
                        </div>
                        <div className="flex items-center gap-[4px] rounded-[8px] border border-[#e8eaec] bg-[#fcfcfc] px-[12px] py-[8px]">
                          <input type="number" min={1} max={99} value={v.percentual} onChange={(e) => updateVariantePercentual(i, parseInt(e.target.value) || 1)} className="w-[32px] text-sm text-[#12171d] outline-none bg-transparent" />
                          <span className="text-sm text-[#6f7680]">%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="h-px bg-[#e8eaec]" />
                {/* Tabs */}
                <div className="flex items-center gap-[8px] flex-wrap">
                  {variantes.map((v, i) => (
                    <button key={i} type="button" onClick={() => setActiveVariante(i)}
                      className={`flex items-center gap-[4px] h-[36px] px-[12px] rounded-[6px] text-sm font-semibold transition-colors ${activeVariante === i ? "bg-[#f2f4ff] text-[#2724ed]" : "text-[#6f7680] hover:bg-gray-50"}`}
                    >
                      {v.nome}<IcMoreVert />
                    </button>
                  ))}
                  <button type="button" onClick={addVariante} className="flex items-center gap-[4px] text-sm font-semibold text-[#343b44] hover:opacity-70 transition-opacity">
                    <IcAdd />Adicionar variante
                  </button>
                </div>
              </>
            )}

            {/* Conteúdo */}
            <div className="h-px bg-[#e8eaec]" />
            <p className="text-base font-medium text-[#12171d]">Conteúdo</p>
            <div className="flex flex-col">
              <Label required>Título</Label>
              <input className={inputClass} placeholder="Digite o título aqui" value={currentTitulo} onChange={(e) => setCurrentTitulo(e.target.value)} />
            </div>
            <div className="flex flex-col">
              <Label required>Mensagem</Label>
              <textarea
                className="w-full rounded-[8px] border border-[#e8eaec] bg-[#fcfcfc] px-[12px] py-[12px] text-sm text-[#12171d] placeholder:text-[#6f7680] outline-none focus:border-[#7c3aed] transition-colors resize-none shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]"
                rows={5}
                placeholder="Digite a mensagem aqui"
                value={currentMensagem}
                onChange={(e) => setCurrentMensagem(e.target.value)}
              />
            </div>

            {/* Mídia */}
            <AccordionToggle title="Mídia" enabled={midiaAtiva} onToggle={() => setMidiaAtiva((v) => !v)}>
              <Checkbox checked={adicionarImagem} onChange={setAdicionarImagem} label="Adicionar imagem" />
              <div className="h-px bg-[#e8eaec]" />
              <Checkbox checked={adicionarIcone} onChange={setAdicionarIcone} label="Adicionar ícone" />
              <div className="h-px bg-[#e8eaec]" />
              <Checkbox checked={adicionarBadge} onChange={setAdicionarBadge} label="Adicionar badge" />
            </AccordionToggle>

            {/* Botões */}
            <AccordionToggle title="Botões" enabled={botoesAtivos} onToggle={() => setBotoesAtivos((v) => !v)}>
              {/* Tabs de botões */}
              <div className="flex items-center gap-[8px] flex-wrap">
                {botoes.map((b, i) => (
                  <button key={i} type="button" onClick={() => setActiveBotao(i)}
                    className={`flex items-center gap-[4px] h-[36px] px-[12px] rounded-[6px] text-sm font-semibold transition-colors ${activeBotao === i ? "bg-[#f2f4ff] text-[#2724ed]" : "text-[#6f7680] hover:bg-gray-50"}`}
                  >
                    {b.nome}<IcMoreVert />
                  </button>
                ))}
                <button type="button" onClick={addBotao} className="flex items-center gap-[4px] text-sm font-semibold text-[#343b44] hover:opacity-70 transition-opacity">
                  <IcAdd />Adicionar botão
                </button>
              </div>
              {botoes[activeBotao] && (
                <>
                  <div className="h-px bg-[#e8eaec]" />
                  <div className="flex flex-col">
                    <Label required>Texto do botão</Label>
                    <input className={inputClass} placeholder="Digite aqui" value={botoes[activeBotao].texto} onChange={(e) => updateBotao(activeBotao, "texto", e.target.value)} />
                  </div>
                  <div className="flex flex-col">
                    <Label required>Link do botão</Label>
                    <input className={inputClass} placeholder="Cole a URL aqui" value={botoes[activeBotao].link} onChange={(e) => updateBotao(activeBotao, "link", e.target.value)} />
                  </div>
                  <div className="border border-[#e8eaec] rounded-[8px] bg-[#fcfcfc] flex items-center justify-between px-[12px] py-[16px]">
                    <span className="text-sm font-medium text-[#12171d]">Adicionar ícone ao botão</span>
                    <Toggle checked={botoes[activeBotao].adicionarIcone} onChange={() => updateBotao(activeBotao, "adicionarIcone", !botoes[activeBotao].adicionarIcone)} />
                  </div>
                </>
              )}
            </AccordionToggle>

            {/* Comportamento */}
            <AccordionToggle title="Comportamento" enabled={comportamentoAtivo} onToggle={() => setComportamentoAtivo((v) => !v)}>
              <div>
                <p className="text-sm font-medium text-[#12171d]">Para onde o usuário vai ao clicar*</p>
                <p className="text-sm text-[#4c535c] mb-[8px]">Cole a URL completa da página que deve abrir.</p>
                <input className={inputClass} placeholder="Cole a URL aqui" value={clickUrl} onChange={(e) => setClickUrl(e.target.value)} />
              </div>
              <div className="h-px bg-[#e8eaec]" />
              <Checkbox checked={naoDescartar} onChange={setNaoDescartar} label="Não descarte a notificação a menos que o usuário interaja com ela" />
              <div className="h-px bg-[#e8eaec]" />
              <Checkbox checked={notificacaoSilenciosa} onChange={setNotificacaoSilenciosa} label="Notificação silenciosa" />
              <div className="h-px bg-[#e8eaec]" />
              <Checkbox checked={agruparNotificacoes} onChange={setAgruparNotificacoes} label="Agrupar notificações semelhantes" />
              <div className="h-px bg-[#e8eaec]" />
              <Checkbox checked={padraVibracao} onChange={setPadraVibracao} label="Padrão de vibração" badge="Disponível para Android" />
            </AccordionToggle>

            {/* Linguagem */}
            <AccordionToggle title="Linguagem" enabled={linguagemAtiva} onToggle={() => setLinguagemAtiva((v) => !v)}>
              <div className="flex flex-col">
                <Label>Selecione a linguagem</Label>
                <div className="relative">
                  <select className={`${inputClass} appearance-none pr-[28px] cursor-pointer`} value={linguagem} onChange={(e) => setLinguagem(e.target.value)}>
                    <option value="" disabled>Selecione</option>
                    {LINGUAGENS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                  <span className="absolute right-[8px] top-1/2 -translate-y-1/2 pointer-events-none"><IcChevronDown /></span>
                </div>
              </div>
            </AccordionToggle>

          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-[20px] py-[14px] border-t border-[#e8eaec] shrink-0 bg-white">
        {onRemove ? (
          <button type="button" onClick={onRemove} className="text-sm font-semibold text-[#d92d20] hover:opacity-80 transition-opacity">Remover nó</button>
        ) : <div />}
        <div className="flex items-center gap-[12px]">
          <button onClick={onClose} className="rounded-[8px] border border-[#e8eaec] px-[16px] py-[9px] text-sm font-semibold text-[#343b44] hover:bg-gray-50 transition-colors">Cancelar</button>
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
