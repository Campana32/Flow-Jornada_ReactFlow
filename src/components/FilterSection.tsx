"use client";
import { useState } from "react";

type FilterType = "Propriedade" | "Primeira vez" | "Última vez" | "Hora do dia" | "Dia da semana" | "Dia do mês";

const FILTER_TYPES: FilterType[] = [
  "Propriedade",
  "Primeira vez",
  "Última vez",
  "Hora do dia",
  "Dia da semana",
  "Dia do mês",
];

const WEEKDAYS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
const MONTH_DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1));
const PERIOD_OPTIONS = ["Hoje", "Ontem", "Últimos 7 dias", "Últimos 30 dias", "Este mês", "Sempre"];

interface FilterCondition {
  id: number;
  type: FilterType;
  propOp: string;
  propVal: string;
  timeFrom: string;
  timeTo: string;
  dayVal: string;
}

interface EventEntry {
  id: number;
  event: string;
  period: string;
  conditions: FilterCondition[];
  quantityOp: string;
  quantityVal: string;
}

let _id = 1;
const uid = () => _id++;

/* ── Icons ── */
function ChevronUp() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 10L8 6L12 10" stroke="#343B44" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 6L8 10L12 6" stroke="#343B44" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChevronDownSm() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <path d="M4 6L8 10L12 6" stroke="#6f7680" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function PlusIcon({ color = "#343B44" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10.8333 9.16667H15.8333V10.8333H10.8333V15.8333H9.16667V10.8333H4.16667V9.16667H9.16667V4.16667H10.8333V9.16667Z" fill={color} />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M12 4L4 12M4 4L12 12" stroke="#6f7680" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M8.333 9.167v5M11.667 9.167v5M3.333 5.833h13.334M7.5 5.833V4.167a.833.833 0 0 1 .833-.834h3.334a.833.833 0 0 1 .833.834v1.666M15 5.833l-.833 10a.833.833 0 0 1-.834.834H6.667a.833.833 0 0 1-.834-.834L5 5.833" stroke="#d92d20" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function HelpIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <path d="M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12ZM6.06 6a2 2 0 0 1 3.887.667c0 1.333-2 2-2 2M8 10.667h.007" stroke="#6f7680" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <path d="M8 4.667V8l2.667 1.333M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12Z" stroke="#6f7680" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Mini select ── */
function MiniSelect({
  value,
  onChange,
  options,
  placeholder,
  width = 146,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  width?: number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative shrink-0" style={{ width }}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-[8px] bg-[#fcfcfc] border border-[#e8eaec] rounded-[8px] px-[12px] py-[8px] w-full text-left"
      >
        <span className={`flex-1 text-sm truncate min-w-0 ${value ? "text-[#12171d]" : "text-[#6f7680]"}`}>
          {value || placeholder}
        </span>
        <ChevronDownSm />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-[80]" onClick={() => setOpen(false)} />
          <div className="absolute top-[calc(100%+4px)] left-0 bg-white border border-[#e8eaec] rounded-[8px] shadow-lg z-[90] overflow-hidden min-w-full max-h-[200px] overflow-y-auto">
            {options.length === 0 ? (
              <div className="px-[12px] py-[8px] text-sm text-[#6f7680]">Nenhuma opção</div>
            ) : (
              options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => { onChange(opt); setOpen(false); }}
                  className={`w-full text-left px-[12px] py-[8px] text-sm hover:bg-[#f8f9fa] transition-colors ${value === opt ? "text-[#2724ed] font-medium" : "text-[#12171d]"}`}
                >
                  {opt}
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Filter condition row ── */
function FilterConditionRow({
  condition,
  onRemove,
  onUpdate,
}: {
  condition: FilterCondition;
  onRemove: () => void;
  onUpdate: (updates: Partial<FilterCondition>) => void;
}) {
  const [typeOpen, setTypeOpen] = useState(false);

  return (
    <div className="flex items-center gap-[8px] flex-wrap">
      <HelpIcon />

      {/* Type select */}
      <div className="relative w-[146px] shrink-0">
        <button
          onClick={() => setTypeOpen(!typeOpen)}
          className="flex items-center gap-[8px] bg-[#fcfcfc] border border-[#e8eaec] rounded-[8px] px-[12px] py-[8px] w-full text-left"
        >
          <span className="flex-1 text-sm text-[#12171d] truncate">{condition.type}</span>
          <ChevronDownSm />
        </button>
        {typeOpen && (
          <>
            <div className="fixed inset-0 z-[80]" onClick={() => setTypeOpen(false)} />
            <div className="absolute top-[calc(100%+4px)] left-0 bg-white border border-[#e8eaec] rounded-[8px] shadow-lg z-[90] overflow-hidden min-w-full">
              {FILTER_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => { onUpdate({ type }); setTypeOpen(false); }}
                  className={`w-full text-left px-[12px] py-[8px] text-sm hover:bg-[#f8f9fa] transition-colors ${condition.type === type ? "text-[#2724ed] font-medium" : "text-[#12171d]"}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Type-specific inputs */}
      {condition.type === "Propriedade" && (
        <>
          <MiniSelect value="" onChange={() => {}} options={[]} placeholder="Nao há opções" />
          <MiniSelect
            value={condition.propOp}
            onChange={(v) => onUpdate({ propOp: v })}
            options={["=", "≠", ">", "<", "contém", "não contém"]}
            placeholder="Selecione..."
          />
          <MiniSelect
            value={condition.propVal}
            onChange={(v) => onUpdate({ propVal: v })}
            options={[]}
            placeholder="Valor"
          />
        </>
      )}

      {condition.type === "Hora do dia" && (
        <>
          <div className="flex items-center gap-[8px] bg-[#fcfcfc] border border-[#e8eaec] rounded-[8px] px-[12px] py-[8px] w-[146px] shrink-0">
            <input
              type="time"
              value={condition.timeFrom}
              onChange={(e) => onUpdate({ timeFrom: e.target.value })}
              className="flex-1 text-sm text-[#12171d] bg-transparent outline-none min-w-0"
            />
            <ClockIcon />
          </div>
          <div className="flex items-center gap-[8px] bg-[#fcfcfc] border border-[#e8eaec] rounded-[8px] px-[12px] py-[8px] w-[146px] shrink-0">
            <input
              type="time"
              value={condition.timeTo}
              onChange={(e) => onUpdate({ timeTo: e.target.value })}
              className="flex-1 text-sm text-[#12171d] bg-transparent outline-none min-w-0"
            />
            <ClockIcon />
          </div>
        </>
      )}

      {condition.type === "Dia da semana" && (
        <MiniSelect
          value={condition.dayVal}
          onChange={(v) => onUpdate({ dayVal: v })}
          options={WEEKDAYS}
          placeholder="Selecione..."
        />
      )}

      {condition.type === "Dia do mês" && (
        <MiniSelect
          value={condition.dayVal}
          onChange={(v) => onUpdate({ dayVal: v })}
          options={MONTH_DAYS}
          placeholder="Dia"
        />
      )}

      {/* X button */}
      <button
        onClick={onRemove}
        className="shrink-0 flex items-center justify-center size-[36px] rounded-[8px] hover:bg-gray-100 transition-colors"
      >
        <CloseIcon />
      </button>
    </div>
  );
}

/* ── Add filter dropdown button ── */
function AddFilterButton({ onAdd }: { onAdd: (type: FilterType) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-[4px] px-[12px] py-[8px] rounded-[8px] text-sm font-semibold text-[#2724ed] hover:bg-[#f2f4ff] transition-colors"
      >
        <PlusIcon color="#2724ed" />
        Adicionar filtro
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-[80]" onClick={() => setOpen(false)} />
          <div className="absolute top-[calc(100%+4px)] left-0 bg-white border border-[#e8eaec] rounded-[8px] shadow-lg z-[90] overflow-hidden min-w-[180px]">
            {FILTER_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => { onAdd(type); setOpen(false); }}
                className="w-full text-left px-[12px] py-[8px] text-sm text-[#12171d] hover:bg-[#f8f9fa] transition-colors"
              >
                {type}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Event entry row (for "Que fez" / "Que não fez") ── */
function EventEntryRow({
  entry,
  onRemove,
  onUpdate,
}: {
  entry: EventEntry;
  onRemove: () => void;
  onUpdate: (updates: Partial<EventEntry>) => void;
}) {
  const addCondition = (type: FilterType) => {
    onUpdate({
      conditions: [
        ...entry.conditions,
        { id: uid(), type, propOp: "", propVal: "", timeFrom: "", timeTo: "", dayVal: "" },
      ],
    });
  };

  const removeCondition = (id: number) => {
    onUpdate({ conditions: entry.conditions.filter((c) => c.id !== id) });
  };

  const updateCondition = (id: number, updates: Partial<FilterCondition>) => {
    onUpdate({
      conditions: entry.conditions.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    });
  };

  return (
    <div className="flex flex-col gap-[12px]">
      {/* Event row */}
      <div className="flex items-center justify-between gap-[8px]">
        <div className="flex items-center gap-[8px] flex-wrap">
          <MiniSelect
            value={entry.event}
            onChange={(v) => onUpdate({ event: v })}
            options={["Clicou", "Abriu email", "Visitou página", "Comprou", "Cancelou"]}
            placeholder="Selecione um evento"
          />
          <MiniSelect
            value={entry.period}
            onChange={(v) => onUpdate({ period: v })}
            options={PERIOD_OPTIONS}
            placeholder="Período"
          />
          <AddFilterButton onAdd={addCondition} />
        </div>
        <button
          onClick={onRemove}
          className="shrink-0 flex items-center justify-center size-[36px] rounded-[8px] hover:bg-red-50 transition-colors"
        >
          <TrashIcon />
        </button>
      </div>

      {/* Condition rows (indented) */}
      {entry.conditions.length > 0 && (
        <div className="pl-[16px] flex flex-col gap-[12px]">
          {entry.conditions.map((cond) => (
            <FilterConditionRow
              key={cond.id}
              condition={cond}
              onRemove={() => removeCondition(cond.id)}
              onUpdate={(updates) => updateCondition(cond.id, updates)}
            />
          ))}
        </div>
      )}

      {/* Onde a quantidade é */}
      <div className="flex items-center gap-[8px] flex-wrap">
        <span className="text-sm font-medium text-[#12171d] w-[146px] shrink-0">Onde a quantidade é</span>
        <MiniSelect
          value={entry.quantityOp}
          onChange={(v) => onUpdate({ quantityOp: v })}
          options={["Maior que", "Menor que", "Igual a", "Entre"]}
          placeholder="Selecione..."
        />
        <div className="flex items-center bg-[#fcfcfc] border border-[#e8eaec] rounded-[8px] px-[12px] py-[8px] w-[146px] shrink-0">
          <input
            type="number"
            value={entry.quantityVal}
            onChange={(e) => onUpdate({ quantityVal: e.target.value })}
            placeholder="0"
            className="flex-1 text-sm text-[#12171d] bg-transparent outline-none min-w-0"
          />
        </div>
      </div>
    </div>
  );
}

/* ── Main FilterSection ── */
interface FilterSectionProps {
  badge?: string;
  label: string;
  negativeWord?: string;
  suffix: string;
  addLabel: string;
  defaultLogic?: "all" | "any";
  onlyAny?: boolean;
  eventBased?: boolean;
  presetEvents?: { event: string; period: string }[];
}

export default function FilterSection({
  badge,
  label,
  negativeWord,
  suffix,
  addLabel,
  defaultLogic = "any",
  onlyAny = false,
  eventBased = false,
  presetEvents = [],
}: FilterSectionProps) {
  const [expanded, setExpanded] = useState(true);
  const [logic, setLogic] = useState<"all" | "any">(defaultLogic);
  const [events, setEvents] = useState<EventEntry[]>(() =>
    presetEvents.map((p) => ({
      id: uid(),
      event: p.event,
      period: p.period,
      conditions: [],
      quantityOp: "Maior que",
      quantityVal: "0",
    }))
  );

  const addEvent = () => {
    setEvents((prev) => [
      ...prev,
      { id: uid(), event: "", period: "", conditions: [], quantityOp: "Maior que", quantityVal: "0" },
    ]);
  };

  const removeEvent = (id: number) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const updateEvent = (id: number, updates: Partial<EventEntry>) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const renderLabel = () => {
    if (!negativeWord) return <span className="text-sm font-medium text-[#12171d]">{label}</span>;
    const parts = label.split(negativeWord);
    return (
      <span className="text-sm font-medium text-[#12171d]">
        {parts[0]}
        <span className="font-bold text-[#d92d20]">{negativeWord}</span>
        {parts[1]}
      </span>
    );
  };

  return (
    <div className="bg-[#fcfcfc] border border-[#e8eaec] rounded-[8px] w-full overflow-hidden shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-[12px] py-[8px]">
        <div className="flex items-center gap-[12px] flex-wrap">
          {badge && (
            <span className="bg-[#f2f4ff] text-[#2724ed] text-xs font-medium px-[10px] h-[26px] flex items-center rounded-[6px] shrink-0">
              {badge}
            </span>
          )}
          {renderLabel()}
          {!onlyAny ? (
            <div className="flex items-center bg-white border border-[#e8eaec] rounded-[8px] p-[6px] gap-[2px] shrink-0">
              <button
                onClick={() => setLogic("all")}
                className={`px-[8px] py-[4px] rounded-[6px] text-xs transition-colors ${logic === "all" ? "bg-[#f2f4ff] text-[#2724ed] font-medium" : "text-[#6f7680]"}`}
              >
                Todos (E)
              </button>
              <button
                onClick={() => setLogic("any")}
                className={`px-[8px] py-[4px] rounded-[6px] text-xs transition-colors ${logic === "any" ? "bg-[#f2f4ff] text-[#2724ed] font-medium" : "text-[#6f7680]"}`}
              >
                Algum (OU)
              </button>
            </div>
          ) : (
            <div className="flex items-center bg-white border border-[#e8eaec] rounded-[8px] p-[6px]">
              <span className="px-[8px] py-[4px] rounded-[6px] text-xs bg-[#f2f4ff] text-[#2724ed] font-medium">
                Algum (OU)
              </span>
            </div>
          )}
          <span className="text-sm font-medium text-[#12171d]">{suffix}</span>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="shrink-0 flex items-center justify-center"
          aria-label={expanded ? "Recolher" : "Expandir"}
        >
          {expanded ? <ChevronUp /> : <ChevronDown />}
        </button>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#e8eaec]" />

      {/* Body */}
      {expanded && (
        <div className="bg-white px-[12px] py-[16px] flex flex-col gap-[16px]">
          {/* Event entries */}
          {eventBased && events.map((entry, index) => (
            <div key={entry.id} className="flex flex-col gap-[12px]">
              {index > 0 && <div className="h-px bg-[#e8eaec]" />}
              <EventEntryRow
                entry={entry}
                onRemove={() => removeEvent(entry.id)}
                onUpdate={(updates) => updateEvent(entry.id, updates)}
              />
            </div>
          ))}

          {/* Add button */}
          <button
            onClick={eventBased ? addEvent : undefined}
            className="flex items-center gap-[4px] bg-[#fcfcfc] border border-[#e8eaec] rounded-[8px] px-[12px] py-[8px] text-sm font-semibold text-[#343b44] hover:bg-gray-50 transition-colors self-start"
          >
            <PlusIcon />
            {addLabel}
          </button>
        </div>
      )}
    </div>
  );
}
