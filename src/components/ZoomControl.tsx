"use client";

interface ZoomControlProps {
  zoom: number;        // valor em %, ex: 100
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export default function ZoomControl({ zoom, onZoomIn, onZoomOut }: ZoomControlProps) {
  return (
    <div className="absolute bottom-[148px] right-[24px] flex items-center gap-[8px] bg-white rounded-[12px] p-[8px] shadow-sm z-10 pointer-events-auto">
      <button
        onClick={onZoomOut}
        className="flex items-center justify-center rounded-[8px] p-[8px] hover:bg-gray-100 transition-colors"
        aria-label="Diminuir zoom"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M4.167 10.833V9.167H15.833V10.833H4.167Z" fill="#12171d"/>
        </svg>
      </button>
      <div className="flex items-center justify-center px-[10px] py-[6px] min-w-[52px]">
        <span className="text-sm font-semibold text-[#12171d] whitespace-nowrap">{zoom}%</span>
      </div>
      <button
        onClick={onZoomIn}
        className="flex items-center justify-center rounded-[8px] p-[8px] hover:bg-gray-100 transition-colors"
        aria-label="Aumentar zoom"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10.833 9.167H15.833V10.833H10.833V15.833H9.167V10.833H4.167V9.167H9.167V4.167H10.833V9.167Z" fill="#12171d"/>
        </svg>
      </button>
    </div>
  );
}
