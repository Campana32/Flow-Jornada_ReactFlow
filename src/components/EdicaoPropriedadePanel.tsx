"use client";

import { useState } from "react";

export interface EdicaoPropriedadeNodeData {
  nome: string;
  rows: PropertyRow[];
}

interface EdicaoPropriedadePanelProps {
  onClose: () => void;
  onAdd: (data: EdicaoPropriedadeNodeData) => void;
  onRemove?: () => void;
}

type TipoProp = "Padrão" | "String" | "Booleano" | "Lista" | "Inteiro";

interface PropertyRow {
  id: number;
  propriedade: string;
  tipo: TipoProp;
  valor: string;
  listaInput: string;
}

const COLOR = "#9d174d";

/* ── SVGs ── */
function IconTune() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
      <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z" />
    </svg>
  );
}
function IconArrowRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 10h12M10 4l6 6-6 6" stroke="#12171d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconClose({ color = "#12171d" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M15 5L5 15M5 5L15 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconChevronDown({ color = "#6f7680" }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 6L8 10L12 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconChevronUp() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 10L8 6L12 10" stroke="#12171d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconAdd() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 3v10M3 8h10" stroke="#343b44" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function IconAsterisk() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
      <path d="M4 1v6M1.5 2.5l5 3M6.5 2.5l-5 3" stroke="#e11d48" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

const selectClass =
  "w-full rounded-[8px] border border-[#e8eaec] bg-[#fcfcfc] px-[12px] py-[8px] text-sm text-[#12171d] appearance-none outline-none focus:border-[#9d174d] transition-colors cursor-pointer";
const inputClass =
  "w-full rounded-[8px] border border-[#e8eaec] bg-[#fcfcfc] px-[12px] py-[8px] text-sm text-[#12171d] placeholder:text-[#6f7680] outline-none focus:border-[#9d174d] transition-colors";

let nextId = 1;
function makeRow(): PropertyRow {
  return { id: nextId++, propriedade: "", tipo: "Padrão", valor: "", listaInput: "" };
}

/* ── Property row component ── */
function PropRow({
  row,
  onChange,
  onRemove,
}: {
  row: PropertyRow;
  onChange: (updated: PropertyRow) => void;
  onRemove: () => void;
}) {
  const set = (patch: Partial<PropertyRow>) => onChange({ ...row, ...patch });

  return (
    <div className="flex items-center gap-[8px]">
      {/* Propriedade */}
      <div className="relative shrink-0" style={{ width: 155 }}>
        <select className={selectClass} value={row.propriedade} onChange={(e) => set({ propriedade: e.target.value })}>
          <option value="">Propriedade</option>
          <option value="nome">Nome</option>
          <option value="email">E-mail</option>
          <option value="telefone">Telefone</option>
          <option value="cidade">Cidade</option>
          <option value="estado">Estado</option>
        </select>
        <span className="absolute right-[8px] top-1/2 -translate-y-1/2 pointer-events-none">
          <IconChevronDown />
        </span>
      </div>

      {/* Tipo */}
      <div className="relative shrink-0" style={{ width: 125 }}>
        <select
          className={`${selectClass} ${row.tipo !== "Padrão" ? "bg-[#f8f8f9] text-[#1d242c]" : ""}`}
          value={row.tipo}
          onChange={(e) => set({ tipo: e.target.value as TipoProp, valor: "", listaInput: "" })}
        >
          <option value="Padrão">Tipo</option>
          <option value="String">String</option>
          <option value="Booleano">Booleano</option>
          <option value="Lista">Lista</option>
          <option value="Inteiro">Inteiro</option>
        </select>
        <span className="absolute right-[8px] top-1/2 -translate-y-1/2 pointer-events-none">
          <IconChevronDown />
        </span>
      </div>

      {/* Value field — varies by tipo */}
      {row.tipo === "String" && (
        <input
          className={inputClass}
          style={{ width: 264 }}
          placeholder="Texto"
          value={row.valor}
          onChange={(e) => set({ valor: e.target.value })}
        />
      )}

      {row.tipo === "Booleano" && (
        <div className="relative shrink-0" style={{ width: 125 }}>
          <select className={selectClass} value={row.valor} onChange={(e) => set({ valor: e.target.value })}>
            <option value="">Status</option>
            <option value="verdadeiro">Verdadeiro</option>
            <option value="falso">Falso</option>
          </select>
          <span className="absolute right-[8px] top-1/2 -translate-y-1/2 pointer-events-none">
            <IconChevronDown />
          </span>
        </div>
      )}

      {row.tipo === "Lista" && (
        <>
          <input
            className={inputClass}
            style={{ width: 228 }}
            placeholder="Digite o valor da lista"
            value={row.listaInput}
            onChange={(e) => set({ listaInput: e.target.value })}
          />
          <button
            type="button"
            className="shrink-0 rounded-[8px] border border-[#e8eaec] bg-[#fcfcfc] px-[12px] py-[8px] text-sm font-semibold text-[#343b44] hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            Adicionar
          </button>
        </>
      )}

      {row.tipo === "Inteiro" && (
        <input
          className={inputClass}
          style={{ width: 264 }}
          type="number"
          placeholder="Inteiro"
          value={row.valor}
          onChange={(e) => set({ valor: e.target.value })}
        />
      )}

      {/* Remove row */}
      <button
        type="button"
        onClick={onRemove}
        className="shrink-0 flex items-center justify-center size-[36px] rounded-[8px] hover:bg-gray-100 transition-colors"
      >
        <IconClose color="#6f7680" />
      </button>
    </div>
  );
}

/* ── Main component ── */
export default function EdicaoPropriedadePanel({ onClose, onAdd, onRemove }: EdicaoPropriedadePanelProps) {
  const [nome, setNome] = useState("");
  const [secaoAberta, setSecaoAberta] = useState(true);
  const [rows, setRows] = useState<PropertyRow[]>([makeRow()]);

  const canAdd = nome.trim().length > 0;

  const handleAdd = () => {
    if (!canAdd) return;
    onAdd({ nome, rows });
  };

  const updateRow = (id: number, updated: PropertyRow) =>
    setRows((prev) => prev.map((r) => (r.id === id ? updated : r)));

  const removeRow = (id: number) =>
    setRows((prev) => prev.filter((r) => r.id !== id));

  const addRow = () => setRows((prev) => [...prev, makeRow()]);

  return (
    <div
      className="fixed z-50 flex flex-col rounded-[12px] overflow-hidden border border-[#e8eaec] bg-white shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(39,44,55,0.08)]"
      style={{ bottom: "24px", right: "24px", width: 660, minHeight: "79vh" }}
    >
      {/* Header */}
      <div className="flex items-center gap-[12px] px-[16px] py-[14px] border-b border-[#e8eaec] bg-[#f8f8f9] shrink-0">
        <div
          className="flex items-center justify-center rounded-[8px] border-2 border-white shrink-0"
          style={{ width: 52, height: 52, background: COLOR }}
        >
          <IconTune />
        </div>
        <span className="flex-1 text-lg font-semibold text-[#12171d]">Edição de Propriedade</span>
        <button className="flex items-center justify-center size-[36px] rounded-[8px] hover:bg-gray-100 transition-colors">
          <IconArrowRight />
        </button>
        <div className="w-px h-[24px] bg-[#e8eaec]" />
        <button
          onClick={onClose}
          className="flex items-center justify-center size-[36px] rounded-[8px] hover:bg-gray-100 transition-colors"
        >
          <IconClose />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-[16px] flex flex-col gap-[16px] min-h-0">
        {/* Seção: Propriedade alterada */}
        <div className="flex flex-col rounded-[8px] border border-[#e8eaec] bg-[#fcfcfc] overflow-hidden">
          {/* Section header */}
          <button
            type="button"
            onClick={() => setSecaoAberta((v) => !v)}
            className="flex items-center justify-between px-[12px] py-[8px] h-[44px] w-full text-left"
          >
            <span className="text-sm font-medium text-[#12171d]">Propriedade alterada</span>
            {secaoAberta ? <IconChevronUp /> : <IconChevronDown color="#12171d" />}
          </button>

          {secaoAberta && (
            <>
              <div className="h-px bg-[#e8eaec]" />

              {/* Nome field */}
              <div className="px-[12px] py-[16px]">
                <div className="flex flex-col gap-[6px]" style={{ width: 264 }}>
                  <div className="flex items-center gap-[4px]">
                    <span className="text-sm font-medium text-[#343b44]">Nome</span>
                    <IconAsterisk />
                  </div>
                  <input
                    className={inputClass}
                    placeholder="Nome da alteração"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                </div>
              </div>

              <div className="h-px bg-[#e8eaec]" />

              {/* Property rows */}
              <div className="flex flex-col gap-[16px] px-[12px] py-[16px]">
                {rows.map((row) => (
                  <PropRow
                    key={row.id}
                    row={row}
                    onChange={(updated) => updateRow(row.id, updated)}
                    onRemove={() => removeRow(row.id)}
                  />
                ))}

                {/* Adicionar evento */}
                <button
                  type="button"
                  onClick={addRow}
                  className="flex items-center gap-[6px] rounded-[8px] border border-[#e8eaec] bg-[#fcfcfc] px-[12px] py-[8px] text-sm font-semibold text-[#343b44] hover:bg-gray-50 transition-colors self-start"
                >
                  <IconAdd />
                  Adicionar evento
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-[24px] py-[12px] border-t border-[#e8eaec] shrink-0 bg-white">
        {onRemove ? (
          <button type="button" onClick={onRemove} className="text-sm font-semibold text-[#d92d20] hover:opacity-80 transition-opacity">
            Remover nó
          </button>
        ) : <div />}
        <div className="flex items-center gap-[8px]">
          <button
            onClick={onClose}
            className="rounded-[8px] border border-[#e8eaec] bg-[#fcfcfc] px-[12px] py-[8px] text-sm font-semibold text-[#343b44] hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleAdd}
            disabled={!canAdd}
            className={`rounded-[8px] px-[12px] py-[8px] text-sm font-semibold text-white transition-colors ${
              canAdd ? "hover:opacity-90 cursor-pointer" : "opacity-50 cursor-not-allowed"
            }`}
            style={{ background: COLOR }}
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}
