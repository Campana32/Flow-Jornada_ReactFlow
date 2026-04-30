"use client";

function IconArrowBack() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.6667 9.16667H6.52501L11.1833 4.50833L10 3.33333L3.33334 10L10 16.6667L11.175 15.4917L6.52501 10.8333H16.6667V9.16667Z" fill="#12171d"/>
    </svg>
  );
}

export default function JourneyNameCard() {
  return (
    <div className="flex items-center gap-[10px] bg-bg-white border border-border-secondary rounded-[12px] px-[10px] py-[12px] w-[424px]">
      <button className="flex items-center justify-center bg-surface-primary border border-border-primary rounded-[8px] p-[8px] shrink-0 hover:bg-gray-50 transition-colors">
        <IconArrowBack />
      </button>
      <span className="text-lg font-semibold text-text-primary whitespace-nowrap">Nome da jornada</span>
    </div>
  );
}
