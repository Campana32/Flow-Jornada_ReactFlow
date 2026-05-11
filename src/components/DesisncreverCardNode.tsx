"use client";

const COLOR = "#ef4444";

const IcPersonRemove = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
    <path d="M14 8c0-2.21-1.79-4-4-4S6 5.79 6 8s1.79 4 4 4 4-1.79 4-4zm3 2v2h6v-2h-6zM2 18v2h16v-2c0-2.66-5.33-4-8-4s-8 1.34-8 4z" />
  </svg>
);

const IcDelete = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

interface DesisncreverCardNodeProps {
  style?: React.CSSProperties;
  onRemove: () => void;
}

export default function DesisncreverCardNode({ style, onRemove }: DesisncreverCardNodeProps) {
  const containerStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%) translateY(41px)",
    ...style,
  };

  return (
    <div style={containerStyle}>
      <div className="flex items-center isolate relative">
        <div
          className="flex items-center justify-center p-[8px] rounded-[8px] border-2 border-white shrink-0 z-[2] mr-[-16px]"
          style={{ background: COLOR }}
        >
          <IcPersonRemove />
        </div>
        <div
          className="flex items-center justify-between pl-[26px] pr-[8px] py-[10px] rounded-[8px] z-[1]"
          style={{ background: COLOR, width: 297 }}
        >
          <span className="text-base font-semibold text-white pl-[4px]">Remover</span>
          <button
            onClick={onRemove}
            className="flex items-center justify-center p-[8px] rounded-[8px] hover:bg-white/10 transition-colors"
          >
            <IcDelete />
          </button>
        </div>
      </div>
    </div>
  );
}
