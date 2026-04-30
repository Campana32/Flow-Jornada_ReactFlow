"use client";

interface EntradaCardProps {
  onConfigure: () => void;
  savedSegmentacao?: string;
}

function IconEntrada() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.333 14H4.667M4.667 14L11.667 7M4.667 14L11.667 21" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
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

// icon: 48px outer (p-8 + 28 content + border-2), overlaps header 16px → protrudes 32px left
export default function EntradaCard({ onConfigure, savedSegmentacao }: EntradaCardProps) {
  const isSaved = Boolean(savedSegmentacao);

  return (
    <div
      className="absolute"
      style={{ left: '24px', top: '50%', transform: 'translateY(-50%) translateY(41px)' }}
    >
      <div className="relative" style={{ marginLeft: '32px' }}>
        {/* Icon */}
        <div
          className="absolute z-20 flex items-center bg-entrada-bg border-2 border-white rounded-[8px] p-[8px] shrink-0"
          style={{ left: '-48px', top: '0' }}
        >
          <div className="size-[28px] flex items-center justify-center">
            <IconEntrada />
          </div>
        </div>

        {/* Green header */}
        <div className="relative z-10 flex items-center justify-between bg-entrada-bg rounded-tl-[8px] rounded-tr-[8px] py-[10px] pl-[26px] pr-[16px] w-[324px]">
          <span className="text-base font-semibold text-white whitespace-nowrap">Entrada</span>
        </div>

        {/* Card body */}
        {isSaved ? (
          /* ── Saved state: filter summary ── */
          <button
            onClick={onConfigure}
            className="relative z-10 flex flex-col items-start justify-center bg-white rounded-bl-[8px] rounded-br-[8px] p-[16px] w-[324px] gap-[16px] text-left hover:bg-gray-50 transition-colors w-full"
          >
            <FilterRow
              label="Segmentação"
              values={[savedSegmentacao!]}
            />
            <FilterRow
              label="Usuários que fizeram"
              values={["Click", "Nos últimos", "7", "Dias"]}
            />
            <FilterRow
              label="E não fez"
              values={["open", "Depois do dia", "28/02/2026"]}
            />
            <FilterRow
              label="E possui as propriedades"
              values={["email_country", "não contém", "es"]}
            />
          </button>
        ) : (
          /* ── Initial state ── */
          <div className="relative z-10 flex flex-col gap-[10px] items-center justify-center bg-white rounded-bl-[8px] rounded-br-[8px] p-[16px] w-[324px]">
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
        )}
      </div>
    </div>
  );
}
