"use client";

interface AdicionarNoPanelProps {
  onClose: () => void;
  onNodeSelect?: (type: string) => void;
}

/* ── Inline SVG icons (Material Design) ── */
const icons = {
  close: (
    <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
      <path d="M15 5L5 15M5 5L15 15" stroke="#12171d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  chevronDown: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 6L8 10L12 6" stroke="#343B44" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  tune: (
    <svg width="24" height="24" viewBox="0 0 20 20" fill="white">
      <path d="M3 14.5v-1.67h4.5v1.67H3zm0-4.17V8.67h8.33v1.66H3zm0-4.16V4.5h13.33v1.67H3zm9.17 9.16v-3.12h1.66v1.04H20v1.67h-6.17v1.04h-1.66zm-4.17-4.16V9.54H6.33V8.5H3V6.83h3.33V5.79H8V11.17H8zm4.17-4.17V3.46h1.66v1.04H20V6.17h-6.17v1.04h-1.66z"/>
    </svg>
  ),
  webhook: (
    <svg width="24" height="24" viewBox="0 0 20 20" fill="white">
      <path d="M7.5 15.83H5.83A3.33 3.33 0 0 1 5.83 9.17H7.5V7.5H5.83a5 5 0 0 0 0 10H7.5v-1.67zm5-10H10.83V7.5h1.67a3.33 3.33 0 0 1 0 6.66H10.83v1.67h1.67a5 5 0 0 0 0-10zM7.5 10.83h5v-1.66h-5v1.66z"/>
    </svg>
  ),
  personRemove: (
    <svg width="24" height="24" viewBox="0 0 20 20" fill="white">
      <path d="M8.33 9.17A3.33 3.33 0 1 0 8.33 2.5a3.33 3.33 0 0 0 0 6.67zm0 1.66C5.55 10.83 0 12.22 0 15v1.67h16.67V15c0-2.78-5.56-4.17-8.34-4.17zm8.34-.66h-3.34v1.66h3.34v-1.66z"/>
    </svg>
  ),
  watchLater: (
    <svg width="24" height="24" viewBox="0 0 20 20" fill="white">
      <path d="M10 1.67A8.33 8.33 0 1 0 10 18.33 8.33 8.33 0 0 0 10 1.67zm.83 9.16H9.17V5.83h1.66v5zM10 12.5a.83.83 0 1 1 0 1.67.83.83 0 0 1 0-1.67z"/>
      <path d="M10.83 5.83H9.17v4.58l3.22 3.23 1.18-1.18-2.74-2.74V5.83z"/>
    </svg>
  ),
  swapHoriz: (
    <svg width="24" height="24" viewBox="0 0 20 20" fill="white">
      <path d="M6.67 5.83L3.33 9.17h13.34v1.66H3.33l3.34 3.34-1.17 1.16L0.83 10l4.67-4.67 1.17 1.17zm6.66 8.34l4.67-4.67-4.67-4.67-1.17 1.17 3.34 3.33H2.5v1.67h12.83l-3.34 3.34 1.17 1.16z"/>
    </svg>
  ),
  callSplit: (
    <svg width="24" height="24" viewBox="0 0 20 20" fill="white">
      <path d="M7.5 4.17H10l-2.5 2.5 1.17 1.16 2.5-2.5v2.5h1.66V2.5H7.5v1.67zm5 11.66H10l2.5-2.5-1.17-1.16-2.5 2.5v-2.5H7.17v4.16h5.33v-1.5zM5 4.17H2.5v11.66h2.5L10 10 5 4.17z"/>
    </svg>
  ),
  science: (
    <svg width="24" height="24" viewBox="0 0 20 20" fill="white">
      <path d="M14.33 15.83H5.67L3.33 10V8.33H7.5V2.5h5v5.83h4.17V10l-2.34 5.83zM8.33 3.33v5H6.67v.84l2.08 5h2.5l2.08-5v-.84H11.67v-5H8.33z"/>
    </svg>
  ),
  email: (
    <svg width="24" height="24" viewBox="0 0 20 20" fill="white">
      <path d="M16.67 3.33H3.33C2.42 3.33 1.67 4.08 1.67 5v10c0 .92.75 1.67 1.66 1.67h13.34c.91 0 1.66-.75 1.66-1.67V5c0-.92-.75-1.67-1.66-1.67zM16.67 6.67L10 10.83 3.33 6.67V5L10 9.17 16.67 5v1.67z"/>
    </svg>
  ),
  sms: (
    <svg width="24" height="24" viewBox="0 0 20 20" fill="white">
      <path d="M16.67 1.67H3.33c-.92 0-1.66.75-1.66 1.66v15l3.33-3.33h11.67c.92 0 1.66-.75 1.66-1.67V3.33c0-.91-.74-1.66-1.66-1.66zM5 8.33h10v1.67H5V8.33zm6.67 4.17H5V10.83h6.67V12.5zM15 6.67H5V5h10v1.67z"/>
    </svg>
  ),
  whatsapp: (
    <svg width="24" height="24" viewBox="0 0 20 20" fill="white">
      <path d="M10 1.67A8.33 8.33 0 0 0 1.67 10c0 1.46.38 2.83 1.04 4.02L1.67 18.33l4.4-1.03A8.33 8.33 0 1 0 10 1.67zm4.58 11.67c-.19.53-1.1 1-1.53 1.06-.38.05-.87.07-1.4-.09-.32-.1-.74-.23-1.27-.46-2.23-.96-3.68-3.2-3.79-3.35-.12-.15-.95-1.27-.95-2.42 0-1.15.6-1.71.82-1.94.21-.23.46-.29.62-.29h.43c.14 0 .33-.05.52.4l.74 1.85c.07.16.04.35-.08.5l-.37.45c-.13.15-.27.32-.12.62.16.3.7 1.15 1.5 1.87.91.81 1.68 1.06 1.92 1.18.23.11.37.09.51-.06l.4-.47c.16-.2.32-.13.54-.05l1.72.81c.23.11.38.16.43.25.06.1.06.57-.13 1.1z"/>
    </svg>
  ),
  bell: (
    <svg width="24" height="24" viewBox="0 0 20 20" fill="white">
      <path d="M10 18.33c.92 0 1.67-.75 1.67-1.66H8.33c0 .91.75 1.66 1.67 1.66zm5.83-5V9.17c0-2.98-1.59-5.48-4.37-6.14V2.5a1.46 1.46 0 0 0-2.92 0v.53c-2.79.66-4.37 3.15-4.37 6.14v4.16L2.5 14.5v.83h15v-.83l-1.67-1.67z"/>
    </svg>
  ),
  language: (
    <svg width="24" height="24" viewBox="0 0 20 20" fill="white">
      <path d="M10 1.67A8.33 8.33 0 1 0 10 18.33 8.33 8.33 0 0 0 10 1.67zm-1.67 15A6.69 6.69 0 0 1 3.4 11.67H6.7c.1 1.76.57 3.38 1.63 5zm0-6.67H3.4A6.69 6.69 0 0 1 8.33 4.33v5.67zm1.67 6.67c-1.1-1.6-1.59-3.25-1.67-5h3.34c-.08 1.75-.57 3.4-1.67 5zm1.67-6.67H8.33V4.33A6.69 6.69 0 0 1 13.27 10h-1.6zm.66 6.67c1.06-1.62 1.53-3.24 1.63-5h3.31a6.69 6.69 0 0 1-4.94 5zm1.67-6.67c-.09-1.76-.56-3.41-1.67-5.34a6.69 6.69 0 0 1 4.94 5.34h-3.27z"/>
    </svg>
  ),
};

/* ── Icon badge ── */
function IconBadge({ color, icon }: { color: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center p-[10px] shrink-0" style={{ background: color }}>
      <div
        className="flex items-center justify-center rounded-[6px] shrink-0 overflow-hidden"
        style={{ width: 36, height: 36, background: "rgba(255,255,255,0.22)" }}
      >
        {icon}
      </div>
    </div>
  );
}

/* ── Node Card ── */
function NodeCard({
  color,
  icon,
  label,
  hasExpand = false,
  onClick,
}: {
  color: string;
  icon: React.ReactNode;
  label: string;
  hasExpand?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      className="flex items-stretch overflow-hidden rounded-[8px] w-full cursor-pointer hover:opacity-90 transition-opacity"
      onClick={onClick}
    >
      <IconBadge color={color} icon={icon} />
      <div className="bg-[#f8f8f9] flex flex-1 items-center gap-[10px] px-[12px] py-[12px] min-w-0">
        <span className="flex-1 text-[15px] text-[#343b44] text-left leading-[20px]">{label}</span>
        {hasExpand && icons.chevronDown}
      </div>
    </div>
  );
}

/* ── Section ── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[16px]">
      <p className="text-sm font-medium text-[#6f7680]">{title}</p>
      <div className="grid grid-cols-2 gap-[12px]">
        {children}
      </div>
    </div>
  );
}

/* ── Main ── */
export default function AdicionarNoPanel({ onClose, onNodeSelect }: AdicionarNoPanelProps) {
  return (
    <div
      className="fixed z-50 flex flex-col rounded-[12px] overflow-hidden border border-border-secondary bg-white shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(39,44,55,0.08)]"
      style={{ bottom: "24px", right: "24px", width: 640 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-[#f8f8f9] border-b border-border-secondary px-[16px] py-[12px] shrink-0">
        <span className="text-lg font-semibold text-text-primary">Adicionar nó de jornada</span>
        <button
          onClick={onClose}
          className="flex items-center justify-center size-[36px] rounded-[8px] hover:bg-gray-100 transition-colors"
        >
          {icons.close}
        </button>
      </div>

      {/* Content */}
      <div className="bg-white p-[16px] flex flex-col gap-[24px] overflow-y-auto">
        <Section title="AÇÕES">
          <NodeCard color="#9d174d" icon={icons.tune}        label="Edição de prop."      hasExpand onClick={() => onNodeSelect?.("edicaoProp")} />
          <NodeCard color="#75ab21" icon={icons.webhook}     label="Webhooks"              hasExpand onClick={() => onNodeSelect?.("webhooks")} />
          <NodeCard color="#ef4444" icon={icons.personRemove}label="Desisncrever" onClick={() => onNodeSelect?.("desisncrever")} />
          <NodeCard color="#64748b" icon={icons.watchLater}  label="Aguardar" onClick={() => onNodeSelect?.("aguardar")} />
          <NodeCard color="#10b8a9" icon={icons.swapHoriz}   label="Adic. a outra jornada" onClick={() => onNodeSelect?.("jornadaOutra")} />
        </Section>

        <Section title="CONEXÕES">
          <NodeCard color="#f79f28" icon={icons.callSplit} label="Segmentação" onClick={() => onNodeSelect?.("segmentacao")} />
          <NodeCard color="#fb7185" icon={icons.science}   label="Teste A/B" onClick={() => onNodeSelect?.("testeAB")} />
        </Section>

        <Section title="ENVIOS">
          <NodeCard color="#2724ed" icon={icons.email}    label="Email"        onClick={() => onNodeSelect?.("email")} />
          <NodeCard color="#0ea5e9" icon={icons.sms}      label="SMS"          onClick={() => onNodeSelect?.("sms")} />
          <NodeCard color="#16a34a" icon={icons.whatsapp} label="WhatsApp"     onClick={() => onNodeSelect?.("whatsapp")} />
          <NodeCard color="#f77316" icon={icons.bell}     label="Mobile Push"  onClick={() => onNodeSelect?.("mobilePush")} />
          <NodeCard color="#7c3aed" icon={icons.language} label="Web Push"     onClick={() => onNodeSelect?.("webPush")} />
        </Section>
      </div>
    </div>
  );
}
