"use client";

import { useState } from "react";
import CollapsedPanelBar from "./CollapsedPanelBar";
import { NodeIconImg } from "@/lib/nodeConfig";

export interface SegmentacaoResumoRow {
  label: string;
  items: string[];
}

export interface SegmentacaoNoNodeData {
  segmentacao: string;
  salvarParaReutilizar?: boolean;
  resumo?: SegmentacaoResumoRow[];
}

interface SegmentacaoNoPanelProps {
  onClose: () => void;
  onAdd: (data: SegmentacaoNoNodeData) => void;
  onRemove?: () => void;
  initialData?: Partial<SegmentacaoNoNodeData>;
}

const COLOR = "#f79f28";

const SEGMENTACOES = [
  "Todos os contatos",
  "Clientes ativos",
  "Clientes inativos",
  "Leads qualificados",
  "Compradores recentes",
  "Alto valor",
];

const EVENTOS = ["Abriu email", "Clicou no link", "Visitou página", "Comprou produto"];
const DATAS = ["Hoje", "Ontem", "Últimos 7 dias", "Últimos 30 dias", "Qualquer data"];
const OPERADORES = ["Maior que", "Menor que", "Igual a", "Pelo menos"];

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
      <path d="M4 6L8 10L12 6" stroke="#6f7680" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  chevronUp: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M12 10L8 6L4 10" stroke="#6f7680" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  add: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 4v12M4 10h12" stroke="#343b44" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  addBlue: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 4v12M4 10h12" stroke="#2724ed" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  trash: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 5h14M8 5V3h4v2M6 5l1 11h6l1-11" stroke="#d92d20" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  xSmall: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M12 4L4 12M4 4l8 8" stroke="#6f7680" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  help: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="#9ca3af" strokeWidth="1.4" />
      <path d="M8 7v1.5M8 11h.01" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  nodeIcon: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
      <path d="M14 4l2.29 2.29-2.88 2.88 1.42 1.42 2.88-2.88L20 10V4zm-4 0H4v6l2.29-2.29 4.71 4.7V20h2v-8.41l-5.29-5.3z" />
    </svg>
  ),
};

const selectCls =
  "w-full rounded-[8px] border border-[#e8eaec] bg-white px-[12px] py-[8px] text-[14px] text-[#12171d] outline-none focus:border-[#2724ed] focus:ring-1 focus:ring-[#2724ed] transition-colors appearance-none cursor-pointer";

/* ── Segmented button: Todos(E) / Algum(OU) ── */
function SegmentedMode({ value, onChange }: { value: "todos" | "algum"; onChange: (v: "todos" | "algum") => void }) {
  return (
    <div className="flex items-center gap-[2px] border border-[#e8eaec] bg-white rounded-[8px] p-[6px] h-[38px] shrink-0">
      <button
        onClick={() => onChange("todos")}
        className={`flex items-center gap-[4px] px-[8px] py-[4px] rounded-[6px] text-[12px] transition-colors whitespace-nowrap ${
          value === "todos" ? "bg-[#f2f4ff] text-[#2724ed] font-semibold" : "text-[#6f7680] font-normal"
        }`}
      >
        Todos (E)
      </button>
      <button
        onClick={() => onChange("algum")}
        className={`flex items-center gap-[4px] px-[8px] py-[4px] rounded-[6px] text-[12px] transition-colors whitespace-nowrap ${
          value === "algum" ? "bg-[#f2f4ff] text-[#2724ed] font-semibold" : "text-[#6f7680] font-normal"
        }`}
      >
        Algum (OU)
      </button>
    </div>
  );
}

/* ── Badge "[E]" ── */
function EBadge() {
  return (
    <div className="bg-[#f2f4ff] rounded-[6px] px-[10px] py-[6px] flex items-center justify-center h-[26px] shrink-0">
      <span className="text-[12px] font-medium text-[#2724ed]">E</span>
    </div>
  );
}

/* ── Collapsible section card ── */
function FilterSection({
  label,
  suffix,
  showE = false,
  showMode = true,
  mode,
  onModeChange,
  open,
  onToggle,
  children,
}: {
  label: React.ReactNode;
  suffix: string;
  showE?: boolean;
  showMode?: boolean;
  mode?: "todos" | "algum";
  onModeChange?: (v: "todos" | "algum") => void;
  open: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="border border-[#e8eaec] rounded-[8px] overflow-hidden bg-[#f8f8f9] shrink-0">
      <button
        type="button"
        className="w-full flex items-center justify-between px-[12px] py-[8px] text-left"
        onClick={onToggle}
      >
        <div className="flex items-center gap-[12px] flex-wrap">
          {showE && <EBadge />}
          <span className="text-[14px] font-medium text-[#12171d]">{label}</span>
          {showMode && mode && onModeChange && <SegmentedMode value={mode} onChange={onModeChange} />}
          <span className="text-[14px] font-medium text-[#12171d]">{suffix}</span>
        </div>
        <span className="ml-[8px] shrink-0">{open ? icons.chevronUp : icons.chevronDown}</span>
      </button>
      {open && (
        <>
          <div className="h-px bg-[#e8eaec]" />
          <div className="bg-white px-[12px] py-[16px] flex flex-col gap-[12px]">
            {children}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Event row (Que fez / Que não fez) ── */
function EventRow({ onRemove }: { onRemove: () => void }) {
  const [evento, setEvento] = useState("");
  const [data, setData] = useState("Hoje");
  const [filters, setFilters] = useState<{ id: number; type: string }[]>([]);

  const FILTER_TYPES = ["Propriedade", "Primeira vez", "Última vez", "Hora do dia", "Dia da semana", "Dia do mês"];

  return (
    <div className="flex flex-col gap-[12px]">
      {/* Event + date row */}
      <div className="flex items-center justify-between gap-[8px]">
        <div className="flex items-center gap-[8px] flex-1 min-w-0">
          <div className="relative w-[146px] shrink-0">
            <select className={selectCls} value={evento} onChange={(e) => setEvento(e.target.value)}>
              <option value="" disabled>Selecione u...</option>
              {EVENTOS.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
            <span className="absolute right-[8px] top-1/2 -translate-y-1/2 pointer-events-none">{icons.chevronDown}</span>
          </div>
          <div className="relative w-[146px] shrink-0">
            <select className={selectCls} value={data} onChange={(e) => setData(e.target.value)}>
              {DATAS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <span className="absolute right-[8px] top-1/2 -translate-y-1/2 pointer-events-none">{icons.chevronDown}</span>
          </div>
          <button
            type="button"
            onClick={() => setFilters((f) => [...f, { id: Date.now(), type: "Propriedade" }])}
            className="flex items-center gap-[4px] px-[12px] py-[8px] rounded-[8px] text-[14px] font-semibold text-[#2724ed] hover:bg-[#f2f4ff] transition-colors whitespace-nowrap"
          >
            {icons.addBlue}
            Adicionar filtro
          </button>
        </div>
        <button type="button" onClick={onRemove} className="p-[8px] rounded-[8px] hover:bg-red-50 transition-colors shrink-0">
          {icons.trash}
        </button>
      </div>

      {/* Filter sub-rows */}
      {filters.map((f) => (
        <div key={f.id} className="flex items-center gap-[8px] pl-[16px]">
          <span className="shrink-0">{icons.help}</span>
          <div className="relative w-[146px] shrink-0">
            <select className={selectCls} defaultValue={f.type}>
              {FILTER_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
            <span className="absolute right-[8px] top-1/2 -translate-y-1/2 pointer-events-none">{icons.chevronDown}</span>
          </div>
          <div className="relative w-[146px] shrink-0">
            <select className={selectCls} defaultValue="">
              <option value="" disabled>Selecione...</option>
            </select>
            <span className="absolute right-[8px] top-1/2 -translate-y-1/2 pointer-events-none">{icons.chevronDown}</span>
          </div>
          <button
            type="button"
            onClick={() => setFilters((fs) => fs.filter((r) => r.id !== f.id))}
            className="flex items-center justify-center size-[36px] rounded-[8px] hover:bg-gray-100 transition-colors shrink-0"
          >
            {icons.xSmall}
          </button>
        </div>
      ))}
    </div>
  );
}

/* ── Toggle switch ── */
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={`relative flex items-center overflow-hidden rounded-full transition-colors shrink-0 ${value ? "bg-[#2724ed]" : "bg-[#e8eaec]"}`}
      style={{ width: 36, height: 20, padding: 2 }}
    >
      <div
        className="absolute rounded-full bg-white shadow transition-transform"
        style={{ width: 16, height: 16, transform: value ? "translateX(16px)" : "translateX(0)" }}
      />
    </button>
  );
}

/* ── Add button (secondary) ── */
function AddBtn({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-[4px] border border-[#e8eaec] bg-[#f8f8f9] px-[12px] py-[8px] rounded-[8px] text-[14px] font-semibold text-[#343b44] hover:bg-gray-100 transition-colors"
    >
      {icons.add}
      {label}
    </button>
  );
}

export default function SegmentacaoNoPanel({ onClose, onAdd, onRemove, initialData }: SegmentacaoNoPanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [segmentacao, setSegmentacao] = useState(initialData?.segmentacao ?? "");
  const [salvarParaReutilizar, setSalvarParaReutilizar] = useState(initialData?.salvarParaReutilizar ?? false);

  /* section open states */
  const [open, setOpen] = useState({ queFez: true, queNaoFez: true, possuiProp: true, possuiTags: true, naoPossuiTags: true, importou: true });
  const toggle = (k: keyof typeof open) => setOpen((o) => ({ ...o, [k]: !o[k] }));

  /* segmented mode per section */
  const [mode, setMode] = useState<Record<string, "todos" | "algum">>({
    queFez: "algum", queNaoFez: "algum", possuiProp: "algum", possuiTags: "algum", naoPossuiTags: "algum",
  });
  const setM = (k: string, v: "todos" | "algum") => setMode((m) => ({ ...m, [k]: v }));

  /* event lists */
  const [queFezEvents, setQueFezEvents] = useState([{ id: 1 }]);
  const [queNaoFezEvents, setQueNaoFezEvents] = useState<{ id: number }[]>([]);

  /* "Onde a quantidade é" */
  const [quantOp, setQuantOp] = useState("Maior que");
  const [quantVal, setQuantVal] = useState("0");

  if (collapsed) {
    return (
      <CollapsedPanelBar
        title="Segmentação"
        color={COLOR}
        icon={<NodeIconImg type="segmentacao" size={32} />}
        onExpand={() => setCollapsed(false)}
        onClose={onClose}
      />
    );
  }

  const canAdd = segmentacao.trim().length > 0;

  const handleAdd = () => {
    if (!canAdd) return;
    const resumo: SegmentacaoResumoRow[] = [];
    resumo.push({ label: "Segmentação selecionada", items: [segmentacao] });
    if (queFezEvents.length > 0)
      resumo.push({ label: "Usuários que fizeram", items: ["Evento configurado", "Período selecionado"] });
    if (queNaoFezEvents.length > 0)
      resumo.push({ label: "E não fez", items: ["Evento configurado"] });
    onAdd({ segmentacao, salvarParaReutilizar, resumo });
  };

  return (
    <div
      className="fixed z-50 flex flex-col rounded-[12px] overflow-hidden border border-[#e8eaec] bg-white shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(39,44,55,0.08)]"
      style={{ bottom: "24px", right: "24px", width: 660, maxHeight: "82vh" }}
      onWheel={(e) => e.nativeEvent.stopImmediatePropagation()}
    >
      {/* Header */}
      <div className="flex items-center gap-[12px] px-[16px] py-[14px] border-b border-[#e8eaec] shrink-0">
        <div
          className="flex items-center justify-center rounded-[10px] shrink-0"
          style={{ width: 52, height: 52, background: COLOR }}
        >
          {icons.nodeIcon}
        </div>
        <span className="flex-1 text-lg font-semibold text-[#12171d]">Segmentação</span>
        <button onClick={() => setCollapsed(true)} className="flex items-center justify-center size-[36px] rounded-[8px] hover:bg-gray-100 transition-colors">
          {icons.arrowRight}
        </button>
        <div className="w-px h-[24px] bg-[#e8eaec]" />
        <button onClick={onClose} className="flex items-center justify-center size-[36px] rounded-[8px] hover:bg-gray-100 transition-colors">
          {icons.close}
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-[20px] flex flex-col gap-[16px] min-h-0">

        {/* Select segmentação */}
        <div className="flex flex-col gap-[6px]">
          <label className="text-sm font-medium text-[#343b44]">Segmentação</label>
          <div className="relative">
            <select
              className={selectCls}
              value={segmentacao}
              onChange={(e) => setSegmentacao(e.target.value)}
            >
              <option value="" disabled>Selecione uma segmentação</option>
              {SEGMENTACOES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <span className="absolute right-[8px] top-1/2 -translate-y-1/2 pointer-events-none">{icons.chevronDown}</span>
          </div>
        </div>

        {/* Que fez os eventos */}
        <FilterSection
          label="Que fez"
          suffix="os eventos abaixo"
          showMode
          mode={mode.queFez}
          onModeChange={(v) => setM("queFez", v)}
          open={open.queFez}
          onToggle={() => toggle("queFez")}
        >
          {queFezEvents.map((ev) => (
            <EventRow key={ev.id} onRemove={() => setQueFezEvents((es) => es.filter((e) => e.id !== ev.id))} />
          ))}

          {/* Onde a quantidade é */}
          <div className="flex items-center gap-[8px] pt-[4px]">
            <span className="text-[14px] font-medium text-[#12171d] w-[146px] shrink-0">Onde a quantidade é</span>
            <div className="relative w-[146px] shrink-0">
              <select className={selectCls} value={quantOp} onChange={(e) => setQuantOp(e.target.value)}>
                {OPERADORES.map((o) => <option key={o}>{o}</option>)}
              </select>
              <span className="absolute right-[8px] top-1/2 -translate-y-1/2 pointer-events-none">{icons.chevronDown}</span>
            </div>
            <input
              type="number"
              value={quantVal}
              onChange={(e) => setQuantVal(e.target.value)}
              className="w-[146px] shrink-0 rounded-[8px] border border-[#e8eaec] bg-white px-[12px] py-[8px] text-[14px] text-[#12171d] outline-none focus:border-[#2724ed] transition-colors"
            />
          </div>

          <div className="h-px bg-[#e8eaec]" />
          <AddBtn label="Adicionar evento" onClick={() => setQueFezEvents((es) => [...es, { id: Date.now() }])} />
        </FilterSection>

        {/* Que NÃO fez */}
        <FilterSection
          label={<><span>Que </span><span className="font-bold text-[#d92d20]">não</span><span> fez</span></>}
          suffix="os eventos abaixo"
          showE
          showMode
          mode={mode.queNaoFez}
          onModeChange={(v) => setM("queNaoFez", v)}
          open={open.queNaoFez}
          onToggle={() => toggle("queNaoFez")}
        >
          {queNaoFezEvents.map((ev) => (
            <EventRow key={ev.id} onRemove={() => setQueNaoFezEvents((es) => es.filter((e) => e.id !== ev.id))} />
          ))}
          <AddBtn label="Adicionar evento" onClick={() => setQueNaoFezEvents((es) => [...es, { id: Date.now() }])} />
        </FilterSection>

        {/* Possui propriedades */}
        <FilterSection
          label="Possui"
          suffix="as propriedades abaixo"
          showE
          showMode
          mode={mode.possuiProp}
          onModeChange={(v) => setM("possuiProp", v)}
          open={open.possuiProp}
          onToggle={() => toggle("possuiProp")}
        >
          <AddBtn label="Adicionar propriedade" />
        </FilterSection>

        {/* Possui tags */}
        <FilterSection
          label="Possui"
          suffix="as tags abaixo"
          showE
          showMode
          mode={mode.possuiTags}
          onModeChange={(v) => setM("possuiTags", v)}
          open={open.possuiTags}
          onToggle={() => toggle("possuiTags")}
        >
          <AddBtn label="Adicionar tag" />
        </FilterSection>

        {/* Não possui tags */}
        <FilterSection
          label={<><span className="font-bold text-[#d92d20]">Não</span><span> possui</span></>}
          suffix="as tags abaixo"
          showE
          showMode
          mode={mode.naoPossuiTags}
          onModeChange={(v) => setM("naoPossuiTags", v)}
          open={open.naoPossuiTags}
          onToggle={() => toggle("naoPossuiTags")}
        >
          <AddBtn label="Adicionar tag" />
        </FilterSection>

        {/* Importou */}
        <FilterSection
          label="Importou"
          suffix="os arquivos abaixo"
          showE
          showMode={false}
          open={open.importou}
          onToggle={() => toggle("importou")}
        >
          <AddBtn label="Adicionar importação" />
        </FilterSection>

        {/* Salvar para reutilizar */}
        <div className="border border-[#e8eaec] rounded-[8px] bg-[#f8f8f9] shrink-0">
          <div className="flex items-center justify-between px-[12px] py-[14px]">
            <span className="text-[14px] font-medium text-[#12171d]">Salvar segmentação para reutilizar</span>
            <Toggle value={salvarParaReutilizar} onChange={setSalvarParaReutilizar} />
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
                ? "text-white hover:opacity-90 cursor-pointer"
                : "bg-[#f8f8f9] text-[#9ca3af] border border-[#e8eaec] cursor-not-allowed"
            }`}
            style={canAdd ? { background: COLOR } : undefined}
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}
