"use client";

export interface TesteABVariante {
  id: string;
  label: string;
  color: string;
  percentual: number;
}

export interface TesteABCardNodeData {
  variantes: TesteABVariante[];
}

interface TesteABCardNodeProps {
  initialData?: TesteABCardNodeData;
  style?: React.CSSProperties;
  forceCollapsed?: boolean;
  onEdit: () => void;
  onRemove: () => void;
}

const COLOR = "#fb7185";
const CARD_WIDTH = 324;

const IcBeaker = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
    <path d="M9 2v8.5L5.5 17c-.91 1.37-.06 3 1.5 3h11c1.56 0 2.41-1.63 1.5-3L16 10.5V2H9zm1 2h4v5h-4V4zm2 11c-.83 0-1.5-.67-1.5-1.5S11.17 12 12 12s1.5.67 1.5 1.5S12.83 15 12 15z" />
  </svg>
);

const IcEdit = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path d="M14.7 2.3a1 1 0 0 1 1.4 0l1.6 1.6a1 1 0 0 1 0 1.4l-10 10L4 16l.7-3.7 10-10z" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IcChevronUp = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 10L8 6L12 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function TesteABCardNode({
  initialData,
  style,
  forceCollapsed = false,
  onEdit,
  onRemove,
}: TesteABCardNodeProps) {
  const containerStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%) translateY(41px)",
    ...style,
  };

  const variantes = initialData?.variantes ?? [];

  /* ── Collapsed ── */
  if (forceCollapsed) {
    return (
      <div style={containerStyle}>
        <div className="flex items-center isolate relative">
          <div className="flex items-center justify-center p-[8px] rounded-[8px] border-2 border-white shrink-0 z-[2] mr-[-16px]" style={{ background: COLOR }}>
            <IcBeaker />
          </div>
          <div className="flex items-center justify-between pl-[26px] pr-[8px] py-[10px] rounded-[8px] z-[1]" style={{ background: COLOR, width: CARD_WIDTH }}>
            <span className="text-base font-semibold text-white pl-[4px]">Teste A/B</span>
          </div>
        </div>
      </div>
    );
  }

  /* ── Saved ── */
  return (
    <div style={containerStyle}>
      <div className="flex flex-col items-end isolate relative">
        <div className="flex items-center isolate relative shrink-0 z-[2]">
          <div className="flex items-center justify-center p-[8px] rounded-[8px] border-2 border-white shrink-0 z-[2] mr-[-16px]" style={{ background: COLOR }}>
            <IcBeaker />
          </div>
          <div className="flex items-center justify-between pl-[26px] pr-[8px] py-[10px] rounded-tl-[8px] rounded-tr-[8px] z-[1]" style={{ background: COLOR, width: CARD_WIDTH }}>
            <span className="text-base font-semibold text-white pl-[4px]">Teste A/B</span>
            <div className="flex items-center">
              <button className="flex items-center justify-center p-[8px] rounded-[8px] hover:bg-white/10" onClick={onEdit}>
                <IcEdit />
              </button>
              <button className="flex items-center justify-center p-[8px] rounded-[8px] hover:bg-white/10">
                <IcChevronUp />
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#e8eaec] rounded-bl-[8px] rounded-br-[8px] p-[12px]" style={{ width: CARD_WIDTH }}>
          <div className="flex flex-wrap gap-x-[20px] gap-y-[4px]">
            {variantes.map((v) => (
              <div key={v.id} className="flex items-center gap-[6px]">
                <div className="rounded-full shrink-0" style={{ width: 10, height: 10, background: v.color }} />
                <span className="text-sm text-[#343b44]">{v.label}</span>
                <span className="text-sm font-semibold text-[#343b44]">{v.percentual}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
