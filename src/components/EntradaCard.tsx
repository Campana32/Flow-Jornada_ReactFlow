"use client";

interface EntradaCardProps {
  onConfigure: () => void;
  savedSegmentacao?: string;
  forceCollapsed?: boolean;
}

function IcEdit() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path
        d="M14.7 2.3a1 1 0 0 1 1.4 0l1.6 1.6a1 1 0 0 1 0 1.4l-10 10L4 16l.7-3.7 10-10z"
        stroke="white"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconEntrada() {
  return (
    <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.333 14H4.667M4.667 14L11.667 7M4.667 14L11.667 21" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Dot() {
  return <div className="shrink-0 size-[4px] rounded-full bg-[#343b44] opacity-40" />;
}

function FilterPill({ values }: { values: string[] }) {
  return (
    <div className="bg-[#f1f2f3] flex gap-[10px] items-center px-[8px] py-[4px] rounded-[4px] flex-wrap">
      {values.map((v, i) => (
        <span key={i} className="contents">
          {i > 0 && <Dot />}
          <span className="text-sm text-text-secondary whitespace-nowrap">{v}</span>
        </span>
      ))}
    </div>
  );
}

function FilterRow({ label, values }: { label: string; values: string[] }) {
  return (
    <div className="flex flex-col gap-[4px] items-start w-full">
      <p className="text-xs font-medium text-text-secondary whitespace-nowrap">{label}</p>
      <FilterPill values={values} />
    </div>
  );
}

export default function EntradaCard({ onConfigure, savedSegmentacao, forceCollapsed }: EntradaCardProps) {
  const isSaved = Boolean(savedSegmentacao);
  const bodyVisible = !forceCollapsed;

  return (
    <div
      className="absolute"
      style={{ left: "24px", top: "50%", transform: "translateY(-50%) translateY(41px)" }}
    >
      <div className="flex flex-col items-end isolate relative">

        {/* Badge + header row */}
        <div className="flex items-center isolate relative shrink-0 z-[2]">
          {/* Badge */}
          <div
            className="flex items-center justify-center p-[8px] rounded-[8px] border-2 border-white shrink-0 z-[2] mr-[-16px] bg-entrada-bg"
            style={{ width: 44, height: 44 }}
          >
            <IconEntrada />
          </div>
          {/* Green header bar */}
          <div
            className={`flex items-center pl-[26px] pr-[12px] py-[10px] w-[324px] z-[1] bg-entrada-bg ${bodyVisible ? "rounded-tl-[8px] rounded-tr-[8px]" : "rounded-[8px]"}`}
          >
            <span className="flex-1 text-base font-semibold text-white whitespace-nowrap">Entrada</span>
            {isSaved && (
              <button
                onClick={onConfigure}
                className="flex items-center justify-center p-[8px] rounded-[8px] hover:bg-white/10 transition-colors"
              >
                <IcEdit />
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        {bodyVisible && isSaved ? (
          <button
            onClick={onConfigure}
            className="flex flex-col items-start justify-center bg-white rounded-bl-[8px] rounded-br-[8px] p-[16px] w-[324px] gap-[16px] text-left hover:bg-gray-50 transition-colors z-[1]"
          >
            <FilterRow label="Segmentação" values={[savedSegmentacao!]} />
            <FilterRow label="Usuários que fizeram" values={["Click", "Nos últimos", "7", "Dias"]} />
            <FilterRow label="E não fez" values={["open", "Depois do dia", "28/02/2026"]} />
            <FilterRow label="E possui as propriedades" values={["email_country", "não contém", "es"]} />
          </button>
        ) : bodyVisible ? (
          <div className="flex flex-col gap-[10px] items-center justify-center bg-white rounded-bl-[8px] rounded-br-[8px] p-[16px] w-[324px] z-[1]">
            <p className="text-sm text-text-secondary text-center w-full leading-[20px]">
              Selecione uma ou mais segmentações, e defina de onde virão seus usuários.
            </p>
            <button
              onClick={onConfigure}
              className="flex items-center justify-center bg-entrada-bg rounded-[8px] px-[12px] py-[8px] w-full hover:opacity-90 transition-opacity"
            >
              <span className="text-sm font-semibold text-white">Configurar entrada</span>
            </button>
          </div>
        ) : null}

      </div>
    </div>
  );
}
