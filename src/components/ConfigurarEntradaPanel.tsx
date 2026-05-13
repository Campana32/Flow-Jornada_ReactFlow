"use client";
import { useState } from "react";
import FilterSection from "./FilterSection";
import CollapsedPanelBar from "./CollapsedPanelBar";

const SEGMENTACOES = [
  "Segmentação A",
  "Segmentação B",
  "Segmentação C",
  "Clientes ativos",
  "Leads qualificados",
  "Usuários premium",
];

type PresetEvent = { event: string; period: string };

const SEGMENTACAO_PRESETS: Record<string, { queFez: PresetEvent[]; queNaoFez: PresetEvent[] }> = {
  "Clientes ativos": {
    queFez: [{ event: "Comprou", period: "Últimos 30 dias" }],
    queNaoFez: [],
  },
  "Leads qualificados": {
    queFez: [{ event: "Visitou página", period: "Últimos 7 dias" }],
    queNaoFez: [{ event: "Comprou", period: "Sempre" }],
  },
  "Usuários premium": {
    queFez: [{ event: "Comprou", period: "Sempre" }, { event: "Abriu email", period: "Últimos 30 dias" }],
    queNaoFez: [{ event: "Cancelou", period: "Últimos 30 dias" }],
  },
  "Segmentação A": {
    queFez: [{ event: "Clicou", period: "Hoje" }],
    queNaoFez: [],
  },
  "Segmentação B": {
    queFez: [{ event: "Abriu email", period: "Últimos 7 dias" }],
    queNaoFez: [{ event: "Clicou", period: "Hoje" }],
  },
  "Segmentação C": {
    queFez: [{ event: "Visitou página", period: "Ontem" }],
    queNaoFez: [],
  },
};

interface ConfigurarEntradaPanelProps {
  initialSegmentacao?: string;
  onClose: () => void;
  onAdd: (segmentacao: string) => void;
}

/* ── SVG Icons ── */
function IconEntradaMd() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M26.667 16H5.333M5.333 16L13.333 8M5.333 16L13.333 24" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconArrowForward() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3.333 10H16.667M16.667 10L10 3.333M16.667 10L10 16.667" stroke="#343B44" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconClose() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M15 5L5 15M5 5L15 15" stroke="#12171d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconSync() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M15.833 4.167A8.333 8.333 0 1 1 4.167 15.833M15.833 4.167V8.333M15.833 4.167H11.667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 6L8 10L12 6" stroke="#6f7680" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconCalc() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.99998 3.33337V0.833374L6.66665 4.16671L9.99998 7.50004V5.00004C12.7583 5.00004 15 7.24171 15 10C15 10.8417 14.7916 11.6417 14.4166 12.3334L15.6333 13.55C16.2833 12.525 16.6666 11.3084 16.6666 10C16.6666 6.31671 13.6833 3.33337 9.99998 3.33337ZM9.99998 15C7.24165 15 4.99998 12.7584 4.99998 10C4.99998 9.15837 5.20831 8.35837 5.58331 7.66671L4.36665 6.45004C3.71665 7.47504 3.33331 8.69171 3.33331 10C3.33331 13.6834 6.31665 16.6667 9.99998 16.6667V19.1667L13.3333 15.8334L9.99998 12.5V15Z" fill="#343B44"/>
    </svg>
  );
}
function IconSwitch({ checked }: { checked: boolean }) {
  return (
    <div className={`relative flex items-center h-[20px] w-[36px] rounded-full p-[2px] transition-colors ${checked ? "bg-brand" : "bg-[#e8eaec]"}`}>
      <div className={`size-[16px] rounded-full bg-white shadow transition-transform ${checked ? "translate-x-[16px]" : "translate-x-0"}`} />
    </div>
  );
}

/* ── Venn Diagram Drop Content ── */
function VennIconA() {
  return (
    <svg width="30" height="19" viewBox="0 0 30 18.854" fill="none">
      <path
        d="M20.506 0.0732C25.713 0.0732 29.933 4.2937 29.933 9.5C29.933 14.7063 25.713 18.927 20.506 18.927C18.45 18.927 16.549 18.266 15 17.1484C13.45 18.2657 11.55 18.927 9.494 18.927C4.287 18.927 0.067 14.7063 0.067 9.5C0.067 4.2937 4.287 0.0732 9.494 0.0732C11.55 0.0732 13.45 0.7335 15 1.8506C16.549 0.7332 18.45 0.0732 20.506 0.0732ZM9.494 0.5732C4.564 0.5732 0.567 4.5699 0.567 9.5C0.567 14.4301 4.564 18.4268 9.494 18.4268C11.386 18.4268 13.139 17.8356 14.583 16.8311C12.447 15.1029 11.08 12.4619 11.08 9.5C11.08 6.5379 12.447 3.8961 14.583 2.168C13.139 1.1637 11.386 0.5732 9.494 0.5732ZM20.506 0.5732C18.614 0.5732 16.86 1.1634 15.416 2.168C17.553 3.8961 18.92 6.5376 18.92 9.5C18.92 12.4622 17.552 15.1029 15.416 16.8311C16.86 17.836 18.614 18.4268 20.506 18.4268C25.436 18.4268 29.433 14.4301 29.433 9.5C29.433 4.5699 25.436 0.5732 20.506 0.5732ZM15 2.4756C12.918 4.1098 11.58 6.6482 11.58 9.5C11.58 12.3516 12.918 14.8892 15 16.5234C17.081 14.8892 18.42 12.3519 18.42 9.5C18.42 6.6479 17.082 4.1098 15 2.4756Z"
        fill="#2724ED"
      />
      <path
        d="M18.6 9.4453C18.6 13.3447 16.771 15.2711 14.986 16.5059C13.782 15.7589 11.372 13.3447 11.372 9.4453C11.372 6.154 13.338 3.1338 14.986 2.3848C16.482 3.4339 18.6 5.5459 18.6 9.4453Z"
        fill="#2724ED"
      />
    </svg>
  );
}

function VennIconB() {
  return (
    <svg width="30" height="19" viewBox="0 0 30 18.854" fill="none">
      <path
        d="M20.506 0.0732C25.713 0.0732 29.933 4.2937 29.933 9.5C29.933 14.7063 25.713 18.927 20.506 18.927C18.45 18.927 16.549 18.266 15 17.1484C13.45 18.2657 11.55 18.927 9.494 18.927C4.287 18.927 0.067 14.7063 0.067 9.5C0.067 4.2937 4.287 0.0732 9.494 0.0732C11.55 0.0732 13.45 0.7335 15 1.8506C16.549 0.7332 18.45 0.0732 20.506 0.0732Z"
        fill="#2724ED"
      />
      <path
        d="M18.6 9.4453C18.6 13.3447 16.771 15.2711 14.986 16.5059C13.782 15.7589 11.372 13.3447 11.372 9.4453C11.372 6.154 13.338 3.1338 14.986 2.3848C16.482 3.4339 18.6 5.5459 18.6 9.4453Z"
        fill="#FCFCFC"
      />
    </svg>
  );
}

const VENN_ROWS = [
  { key: "fez",           parts: ["Que ",  "fez",       "\nos eventos"]        as const, icon: "A" },
  { key: "naoFez",        parts: ["Que ",  "não fez",   "\nos eventos"]        as const, icon: "B" },
  { key: "possuiProps",   parts: ["Que",   " possui",   "\nas propriedades"]   as const, icon: "A" },
  { key: "possuiTags",    parts: ["Que ",  "possui",    "\nas tags"]           as const, icon: "A" },
  { key: "naoPossuiTags", parts: ["Que ",  "não possui","\nas tags"]           as const, icon: "B" },
] as const;

function VennDiagramContent() {
  return (
    <div className="flex flex-col gap-[16px] w-[245px]">
      <div className="relative border-y border-[#E8EAEC] divide-y divide-[#E8EAEC]">
        <div className="absolute top-0 bottom-0 w-px bg-[#E8EAEC]" style={{ left: "100px" }} />
        {VENN_ROWS.map(({ key, parts, icon }) => (
          <div key={key} className="flex items-center py-[12px]">
            <p className="w-[100px] text-[12px] leading-[18px] text-[#12171D] whitespace-pre-wrap shrink-0">
              {parts[0]}<strong>{parts[1]}</strong>{parts[2]}
            </p>
            <div className="flex items-center pl-[12px] flex-1 min-w-0">
              <span className="text-[12px] leading-[18px] text-[#12171D] shrink-0">
                Todos <strong>(E)</strong>
              </span>
            </div>
            <div className="flex items-center justify-center w-[40px] shrink-0">
              {icon === "A" ? <VennIconA /> : <VennIconB />}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-[4px] items-center">
        <div className="flex gap-[6px] items-center shrink-0">
          <div className="bg-[#2724ED] rounded-[2px] size-[12px] shrink-0" />
          <span className="text-[12px] leading-[18px] text-[#12171D]">Dentro da segmentação</span>
        </div>
        <div className="flex gap-[6px] items-center shrink-0">
          <div className="border border-[#97ABFF] rounded-[2px] size-[12px] shrink-0" />
          <span className="text-[12px] leading-[18px] text-[#12171D] whitespace-nowrap">Fora da segmentação</span>
        </div>
      </div>
    </div>
  );
}

/* ── Left floating cards (Venn + Alcance) ── */
function LeftCards() {
  const [vennOpen, setVennOpen] = useState(true);

  return (
    <div className="flex flex-col gap-[8px] w-[277px] shrink-0">
      {/* Diagrama de Venn */}
      <div className="bg-bg-primary border border-border-secondary rounded-[8px] p-[16px] shadow-sm">
        <button
          onClick={() => setVennOpen(!vennOpen)}
          className="flex items-center justify-between w-full"
        >
          <span className="text-base font-semibold text-text-secondary">Diagrama de Venn</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d={vennOpen ? "M4 12L8 8L12 12" : "M4 8L8 12L12 8"} stroke="#343B44" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {vennOpen && (
          <div className="mt-[12px]">
            <VennDiagramContent />
          </div>
        )}
      </div>

      {/* Alcance estimado */}
      <div className="bg-bg-primary border border-border-secondary rounded-[8px] p-[16px] flex flex-col gap-[16px] shadow-sm">
        <span className="text-base font-semibold text-text-secondary">Alcance estimado</span>
        <button className="flex items-center gap-[4px] justify-center bg-surface-primary border border-border-secondary rounded-[8px] px-[12px] py-[8px] w-full hover:bg-gray-50 transition-colors">
          <IconCalc />
          <span className="text-sm font-semibold text-text-secondary whitespace-nowrap">Calcular alcance</span>
        </button>
      </div>
    </div>
  );
}

/* ── Segmentação Select ── */
function SegmentacaoSelect({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-[6px] w-full">
      <span className="text-sm font-medium text-text-secondary">Segmentação</span>
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className={`flex items-center gap-[8px] h-[40px] px-[12px] py-[8px] rounded-[8px] border w-full text-left transition-colors ${
            error
              ? "border-red-500 bg-red-50"
              : "bg-surface-primary border-border-secondary hover:border-border-primary"
          }`}
        >
          <span className={`flex-1 text-sm truncate ${value ? "text-text-primary" : "text-[#6f7680]"}`}>
            {value || "Selecione uma segmentação"}
          </span>
          <IconChevronDown />
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-[60]" onClick={() => setOpen(false)} />
            <div className="absolute top-[44px] left-0 right-0 bg-white border border-border-secondary rounded-[8px] shadow-lg z-[70] overflow-hidden">
              {SEGMENTACOES.map((seg) => (
                <button
                  key={seg}
                  onClick={() => { onChange(seg); setOpen(false); }}
                  className={`w-full text-left px-[12px] py-[10px] text-sm hover:bg-surface-primary transition-colors ${
                    value === seg ? "text-brand font-medium bg-brand-light" : "text-text-primary"
                  }`}
                >
                  {seg}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      {error && (
        <span className="text-xs text-red-500">Selecione uma segmentação para continuar</span>
      )}
    </div>
  );
}

/* ── Main Component ── */
export default function ConfigurarEntradaPanel({
  initialSegmentacao = "",
  onClose,
  onAdd,
}: ConfigurarEntradaPanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [segmentacao, setSegmentacao] = useState(initialSegmentacao);
  const [isDirty, setIsDirty] = useState(false);
  const [saveToggle, setSaveToggle] = useState(false);
  const [showError, setShowError] = useState(false);

  if (collapsed) {
    return (
      <CollapsedPanelBar
        title="Configurar entrada"
        color="#10b681"
        icon={
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M26.667 16H5.333M5.333 16L13.333 8M5.333 16L13.333 24" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        }
        onExpand={() => setCollapsed(false)}
        onClose={onClose}
      />
    );
  }

  const handleSegmentacaoChange = (value: string) => {
    setSegmentacao(value);
    setIsDirty(true);
    setShowError(false);
  };

  const handleUndo = () => {
    setSegmentacao(initialSegmentacao);
    setIsDirty(false);
  };

  const handleAdd = () => {
    if (!segmentacao) { setShowError(true); return; }
    onAdd(segmentacao);
  };

  const maxH = 'calc(100vh - 72px - 48px)';

  return (
    /*
     * Wrapper fixed bottom-right.
     * Os cards de Venn/Alcance flutuam SEPARADOS à esquerda do painel principal,
     * alinhados pela base (items-end), com gap de 8px.
     */
    <div
      className="fixed z-50 flex items-start gap-[8px]"
      style={{ bottom: '24px', right: '24px' }}
      onWheel={(e) => e.nativeEvent.stopImmediatePropagation()}
    >
      {/* Cards flutuantes: marginTop = altura do header do painel para alinhar com o conteúdo */}
      <div style={{ marginTop: '60px' }}>
        <LeftCards />
      </div>

      {/* ── Painel principal: Configurar entrada ── */}
      <div
        className="flex flex-col rounded-[12px] overflow-hidden border border-border-secondary bg-white shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(39,44,55,0.08)]"
        style={{ width: '660px', maxHeight: maxH }}
      >
        {/* Header */}
        <div className="flex items-center shrink-0 bg-[#f8f8f9] border-b border-border-secondary" style={{ minHeight: '60px' }}>
          {/* Green icon badge */}
          <div
            className="flex items-center justify-center bg-entrada-bg border-2 border-white rounded-[8px] shrink-0"
            style={{ width: '52px', height: '52px', margin: '0 0 0 16px' }}
          >
            <IconEntradaMd />
          </div>

          {/* Title + actions */}
          <div className="flex flex-1 items-center justify-between pl-[16px] pr-[16px] py-[12px]">
            <span className="text-lg font-semibold text-text-primary whitespace-nowrap">Configurar entrada</span>
            <div className="flex items-center gap-[8px]">
              <button onClick={() => setCollapsed(true)} className="flex items-center justify-center p-[8px] rounded-[8px] hover:bg-gray-100 transition-colors">
                <IconArrowForward />
              </button>
              <div className="w-px h-[20px] bg-border-secondary" />
              <button
                onClick={onClose}
                className="flex items-center justify-center size-[36px] rounded-[8px] hover:bg-gray-100 transition-colors"
              >
                <IconClose />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-[20px] flex flex-col gap-[20px] min-h-0">
          {/* Segmentação */}
          <SegmentacaoSelect
            value={segmentacao}
            onChange={handleSegmentacaoChange}
            error={showError}
          />

          {/* Filter sections — sempre visíveis; pré-preenchidas ao selecionar segmentação */}
          {(() => {
            const preset = segmentacao ? (SEGMENTACAO_PRESETS[segmentacao] ?? { queFez: [], queNaoFez: [] }) : { queFez: [], queNaoFez: [] };
            return (
              <div className="flex flex-col gap-[12px]">
                <FilterSection
                  key={`queFez-${segmentacao}`}
                  label="Que fez"
                  suffix="os eventos abaixo"
                  addLabel="Adicionar evento"
                  eventBased
                  presetEvents={preset.queFez}
                />
                <FilterSection
                  key={`queNaoFez-${segmentacao}`}
                  badge="E"
                  label="Que não fez"
                  negativeWord="não"
                  suffix="os eventos abaixo"
                  addLabel="Adicionar evento"
                  eventBased
                  presetEvents={preset.queNaoFez}
                />
                <FilterSection badge="E" label="Possui" suffix="as propriedades abaixo" addLabel="Adicionar propriedade" />
                <FilterSection badge="E" label="Possui" suffix="as tags abaixo" addLabel="Adicionar tag" />
                <FilterSection badge="E" label="Não possui" negativeWord="Não" suffix="as tags abaixo" addLabel="Adicionar tag" />
                <FilterSection badge="E" label="Importou" suffix="os arquivos abaixo" addLabel="Adicionar importação" onlyAny />
              </div>
            );
          })()}

          <div className="h-px bg-border-secondary shrink-0" />

          {/* Toggle */}
          <div className="bg-surface-primary border border-border-secondary rounded-[8px] shrink-0">
            <div className="flex items-center justify-between px-[12px] py-[8px] h-[54px]">
              <span className="text-sm font-medium text-text-primary">Salvar segmentação para reutilizar</span>
              <button onClick={() => setSaveToggle(!saveToggle)}>
                <IconSwitch checked={saveToggle} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 bg-white border-t border-border-secondary px-[20px] py-[12px] flex items-center justify-end gap-[8px]">
          <div className="flex-1" />
          <button
            onClick={onClose}
            className="flex items-center justify-center bg-white border border-border-secondary rounded-[8px] px-[12px] py-[8px] text-sm font-semibold text-text-secondary hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleAdd}
            disabled={!segmentacao}
            className={`flex items-center justify-center rounded-[8px] px-[12px] py-[8px] text-sm font-semibold transition-colors ${
              segmentacao
                ? "bg-brand text-white hover:opacity-90"
                : "bg-surface-disabled border border-border-disabled text-text-disabled cursor-not-allowed"
            }`}
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}
