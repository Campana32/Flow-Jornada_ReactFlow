"use client";

import { useState } from "react";
import type { SegmentacaoNoNodeData, SegmentacaoResumoRow } from "./SegmentacaoNoPanel";

interface Props {
  initialData?: SegmentacaoNoNodeData;
  style?: React.CSSProperties;
  forceCollapsed?: boolean;
  onEdit?: () => void;
  onRemove?: () => void;
}

const COLOR = "#f79f28";
const BADGE_W = 44;
const BAR_W = 324;
const OVERLAP = 16;

export const SEGMENTACAO_CARD_WIDTH = BADGE_W - OVERLAP + BAR_W; // 352

const IcCallSplit = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
    <path d="M14 4l2.29 2.29-2.88 2.88 1.42 1.42 2.88-2.88L20 10V4zm-4 0H4v6l2.29-2.29 4.71 4.7V20h2v-8.41l-5.29-5.3z" />
  </svg>
);

const IcEdit = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const IcChevronDown = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M5 7.5L10 12.5L15 7.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IcChevronUp = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M15 12.5L10 7.5L5 12.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* Gray dot separator */
function Dot() {
  return (
    <div className="shrink-0 rounded-full bg-[#9ca3af]" style={{ width: 4, height: 4 }} />
  );
}

/* Summary pill: items separated by dots */
function SummaryPill({ items }: { items: string[] }) {
  return (
    <div className="flex items-center gap-[10px] bg-[#f1f2f3] px-[8px] py-[4px] rounded-[4px]">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-[10px]">
          {i > 0 && <Dot />}
          <span className="text-[14px] text-[#343b44] whitespace-nowrap">{item}</span>
        </div>
      ))}
    </div>
  );
}

/* Summary row: label + pill */
function SummaryRow({ row }: { row: SegmentacaoResumoRow }) {
  return (
    <div className="flex flex-col gap-[4px] w-full">
      <span className="text-[12px] font-medium text-[#343b44] whitespace-nowrap">{row.label}</span>
      <SummaryPill items={row.items} />
    </div>
  );
}

/* Orange badge icon */
function Badge({ z2 }: { z2?: boolean }) {
  return (
    <div
      className={`flex items-center justify-center rounded-[8px] shrink-0 border-2 border-white ${z2 ? "z-[2]" : "z-[1]"}`}
      style={{ width: BADGE_W, height: BADGE_W, background: COLOR, marginRight: -OVERLAP }}
    >
      <IcCallSplit />
    </div>
  );
}

export default function SegmentacaoCardNode({ initialData, style, forceCollapsed, onEdit, onRemove }: Props) {
  const [isOpen, setIsOpen] = useState(true);

  const showCollapsed = forceCollapsed || !isOpen;

  const baseStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(calc(-50% + 41px))",
    ...style,
  };

  /* ── Collapsed ── */
  if (showCollapsed) {
    return (
      <div style={baseStyle}>
        <div className="flex items-center">
          <Badge />
          <div
            className="flex items-center justify-between rounded-[8px] z-0 shrink-0 px-[16px] py-[10px]"
            style={{ width: BAR_W, background: COLOR, paddingLeft: 26 }}
          >
            <span className="text-[16px] font-semibold text-white whitespace-nowrap">Segmentação</span>
            <button
              onClick={() => !forceCollapsed && setIsOpen(true)}
              className="flex items-center justify-center size-[36px] rounded-[8px] hover:bg-white/20 transition-colors shrink-0"
            >
              <IcChevronDown />
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Expanded ── */
  const rows: SegmentacaoResumoRow[] = initialData?.resumo?.length
    ? initialData.resumo
    : [{ label: "Segmentação selecionada", items: [initialData?.segmentacao || "—"] }];

  return (
    <div style={baseStyle}>
      <div className="flex flex-col items-end">

        {/* Header row */}
        <div className="flex items-center isolate z-[2] relative">
          <Badge z2 />
          <div
            className="flex items-center justify-between rounded-tl-[8px] rounded-tr-[8px] z-[1] shrink-0"
            style={{ width: BAR_W, background: COLOR, paddingLeft: 26, paddingRight: 8, paddingTop: 10, paddingBottom: 10 }}
          >
            <span className="text-[16px] font-semibold text-white whitespace-nowrap">Segmentação</span>
            <div className="flex items-center gap-[8px]">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="flex items-center justify-center size-[36px] rounded-[8px] hover:bg-white/20 transition-colors"
                >
                  <IcEdit />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center size-[36px] rounded-[8px] hover:bg-white/20 transition-colors"
              >
                <IcChevronUp />
              </button>
            </div>
          </div>
        </div>

        {/* White body */}
        <div
          className="bg-white rounded-bl-[8px] rounded-br-[8px] z-[1] relative shrink-0"
          style={{ width: BAR_W, padding: 16 }}
        >
          <div className="flex flex-col gap-[16px] w-full">
            {rows.map((row, i) => (
              <SummaryRow key={i} row={row} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
