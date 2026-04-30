"use client";
import { useState } from "react";

interface FilterSectionProps {
  badge?: string;
  label: string;
  negativeWord?: string;
  suffix: string;
  addLabel: string;
  defaultLogic?: "all" | "any";
  onlyAny?: boolean;
}

function ChevronUp() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 10L8 6L12 10" stroke="#343B44" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6L8 10L12 6" stroke="#343B44" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.8333 9.16667H15.8333V10.8333H10.8333V15.8333H9.16667V10.8333H4.16667V9.16667H9.16667V4.16667H10.8333V9.16667Z" fill="#343B44"/>
    </svg>
  );
}

export default function FilterSection({
  badge,
  label,
  negativeWord,
  suffix,
  addLabel,
  defaultLogic = "any",
  onlyAny = false,
}: FilterSectionProps) {
  const [expanded, setExpanded] = useState(true);
  const [logic, setLogic] = useState<"all" | "any">(defaultLogic);

  const renderLabel = () => {
    if (!negativeWord) return <span className="text-sm font-medium text-text-primary">{label}</span>;
    const parts = label.split(negativeWord);
    return (
      <span className="text-sm font-medium text-text-primary">
        {parts[0]}
        <span className="font-bold text-[#d92d20]">{negativeWord}</span>
        {parts[1]}
      </span>
    );
  };

  return (
    <div className="bg-surface-primary border border-border-secondary rounded-[8px] w-full overflow-hidden shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-[12px] py-[8px]">
        <div className="flex items-center gap-[12px] flex-wrap">
          {badge && (
            <span className="bg-brand-light text-brand text-xs font-medium px-[10px] h-[26px] flex items-center rounded-[6px] shrink-0">
              {badge}
            </span>
          )}
          {renderLabel()}
          {!onlyAny ? (
            <div className="flex items-center bg-white border border-border-secondary rounded-[8px] p-[6px] gap-[2px] shrink-0">
              <button
                onClick={() => setLogic("all")}
                className={`px-[8px] py-[4px] rounded-[6px] text-xs transition-colors ${
                  logic === "all" ? "bg-brand-light text-brand font-medium" : "text-[#6f7680]"
                }`}
              >
                Todos (E)
              </button>
              <button
                onClick={() => setLogic("any")}
                className={`px-[8px] py-[4px] rounded-[6px] text-xs transition-colors ${
                  logic === "any" ? "bg-brand-light text-brand font-medium" : "text-[#6f7680]"
                }`}
              >
                Algum (OU)
              </button>
            </div>
          ) : (
            <div className="flex items-center bg-white border border-border-secondary rounded-[8px] p-[6px]">
              <span className="px-[8px] py-[4px] rounded-[6px] text-xs bg-brand-light text-brand font-medium">
                Algum (OU)
              </span>
            </div>
          )}
          <span className="text-sm font-medium text-text-primary">{suffix}</span>
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
      <div className="h-px bg-border-secondary" />

      {/* Body */}
      {expanded && (
        <div className="bg-white px-[12px] py-[16px]">
          <button className="flex items-center gap-[4px] bg-surface-primary border border-border-secondary rounded-[8px] px-[12px] py-[8px] text-sm font-semibold text-text-secondary hover:bg-gray-50 transition-colors">
            <PlusIcon />
            {addLabel}
          </button>
        </div>
      )}
    </div>
  );
}
