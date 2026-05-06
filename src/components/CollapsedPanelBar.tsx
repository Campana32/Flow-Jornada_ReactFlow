"use client";

/** Arrow left (expand back) */
const IcArrowLeft = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M16 10H4M10 16l-6-6 6-6" stroke="#12171d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** X close */
const IcClose = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M15 5L5 15M5 5L15 15" stroke="#12171d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface CollapsedPanelBarProps {
  /** Panel title */
  title: string;
  /** Badge background colour */
  color: string;
  /** 32×32 icon element rendered inside the badge */
  icon: React.ReactNode;
  /** Called when the ← button is clicked (expand panel) */
  onExpand: () => void;
  /** Called when the × button is clicked (close panel) */
  onClose: () => void;
}

/**
 * The mini floating bar shown when a panel is collapsed.
 * Matches the Figma "Colapsado" state: icon badge protruding left + header row.
 */
export default function CollapsedPanelBar({
  title,
  color,
  icon,
  onExpand,
  onClose,
}: CollapsedPanelBarProps) {
  return (
    <div
      className="fixed z-50"
      style={{ top: 164, right: 24, width: 372 }}
    >
      <div className="flex isolate items-center w-full">
        {/* Coloured icon badge — overlaps the card */}
        <div
          className="shrink-0 flex items-center justify-center rounded-[8px] border-2 border-white z-[2]"
          style={{
            width: 52,
            height: 52,
            padding: 8,
            background: color,
            marginRight: -16,
          }}
        >
          {icon}
        </div>

        {/* Card */}
        <div
          className="flex-1 min-w-0 flex items-center justify-between z-[1] border border-[#e8eaec] bg-[#f8f8f9]"
          style={{
            paddingLeft: 24,
            paddingRight: 16,
            paddingTop: 16,
            paddingBottom: 16,
            borderRadius: "12px 12px 16px 16px",
          }}
        >
          <span className="text-lg font-semibold text-[#12171d] whitespace-nowrap leading-[28px] truncate">
            {title}
          </span>

          <div className="flex items-center gap-[8px] shrink-0 ml-[8px]">
            {/* Expand */}
            <button
              onClick={onExpand}
              className="flex items-center justify-center bg-[#fcfcfc] border border-[#d2d6db] rounded-[8px] p-[8px] hover:bg-gray-50 transition-colors"
            >
              <IcArrowLeft />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="flex items-center justify-center size-[36px] rounded-[8px] hover:bg-gray-100 transition-colors"
            >
              <IcClose />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
