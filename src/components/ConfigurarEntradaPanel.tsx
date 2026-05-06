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
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M15.833 4.167A8.333 8.333 0 1 1 4.167 15.833M15.833 4.167V8.333M15.833 4.167H11.667" stroke="#343B44" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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

/* ── Left floating cards (Venn + Alcance) ── */
function LeftCards() {
  const [vennOpen, setVennOpen] = useState(false);

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
          <div className="mt-[12px] h-[120px] flex items-center justify-center bg-gray-50 rounded-[8px]">
            <span className="text-xs text-text-tertiary">Diagrama de Venn</span>
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
              {segmentacao && (
                <button
                  onClick={handleUndo}
                  disabled={!isDirty}
                  title={isDirty ? "Desfazer alterações" : "Sem alterações"}
                  className={`flex items-center justify-center border rounded-[8px] p-[8px] transition-colors ${
                    isDirty
                      ? "bg-white border-border-primary text-text-secondary hover:bg-gray-50"
                      : "bg-surface-disabled border-border-disabled text-text-disabled cursor-not-allowed"
                  }`}
                >
                  <IconSync />
                </button>
              )}
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
          <div className="flex items-start gap-[8px]">
            <div className="flex-1">
              <SegmentacaoSelect
                value={segmentacao}
                onChange={handleSegmentacaoChange}
                error={showError}
              />
            </div>
            {segmentacao && (
              <button
                onClick={handleUndo}
                disabled={!isDirty}
                title="Desfazer alterações desta segmentação"
                className={`mt-[26px] flex items-center justify-center border rounded-[8px] p-[9px] transition-colors shrink-0 ${
                  isDirty
                    ? "bg-white border-border-secondary text-text-secondary hover:bg-gray-50"
                    : "bg-surface-disabled border-border-disabled text-text-disabled cursor-not-allowed"
                }`}
              >
                <IconSync />
              </button>
            )}
          </div>

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
