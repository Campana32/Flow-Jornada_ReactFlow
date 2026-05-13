"use client";

import { NodeIconBadge } from "@/lib/nodeConfig";

interface AdicionarNoPanelProps {
  onClose: () => void;
  onNodeSelect?: (type: string) => void;
}

const chevronDown = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 6L8 10L12 6" stroke="#343B44" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const closeIcon = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M15 5L5 15M5 5L15 15" stroke="#12171d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* -- Node Card -- */
function NodeCard({
  type,
  label,
  hasExpand = false,
  onClick,
}: {
  type: string;
  label: string;
  hasExpand?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      className="flex items-stretch overflow-hidden rounded-[8px] w-full cursor-pointer hover:opacity-90 transition-opacity"
      onClick={onClick}
    >
      <NodeIconBadge type={type} />
      <div className="bg-[#f8f8f9] flex flex-1 items-center gap-[10px] px-[12px] py-[12px] min-w-0">
        <span className="flex-1 text-sm text-[#343b44] text-left leading-[20px]">{label}</span>
        {hasExpand && chevronDown}
      </div>
    </div>
  );
}

/* -- Section -- */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[16px]">
      <p className="text-sm font-medium text-[#6f7680]">{title}</p>
      <div className="grid grid-cols-2 gap-[12px]">{children}</div>
    </div>
  );
}

/* -- Main -- */
export default function AdicionarNoPanel({ onClose, onNodeSelect }: AdicionarNoPanelProps) {
  return (
    <div
      className="fixed z-50 flex flex-col rounded-[12px] overflow-hidden border border-border-secondary bg-white shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(39,44,55,0.08)]"
      style={{ bottom: "24px", right: "24px", width: 640, maxHeight: "calc(100vh - 72px - 48px)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-[#f8f8f9] border-b border-border-secondary px-[16px] py-[12px] shrink-0">
        <span className="text-lg font-semibold text-text-primary">Adicionar nó de jornada</span>
        <button
          onClick={onClose}
          className="flex items-center justify-center size-[36px] rounded-[8px] hover:bg-gray-100 transition-colors"
        >
          {closeIcon}
        </button>
      </div>

      {/* Content */}
      <div className="bg-white p-[16px] flex flex-col gap-[24px] overflow-y-auto flex-1 min-h-0">
        <Section title="AÇÕES">
          <NodeCard type="edicaoProp"   label="Edição de prop."       hasExpand onClick={() => onNodeSelect?.("edicaoProp")} />
          <NodeCard type="webhooks"     label="Webhooks"               hasExpand onClick={() => onNodeSelect?.("webhooks")} />
          <NodeCard type="desisncrever" label="Desisncrever"                     onClick={() => onNodeSelect?.("desisncrever")} />
          <NodeCard type="aguardar"     label="Aguardar"                          onClick={() => onNodeSelect?.("aguardar")} />
          <NodeCard type="jornadaOutra" label="Adic. a outra jornada"             onClick={() => onNodeSelect?.("jornadaOutra")} />
        </Section>

        <Section title="CONEXÕES">
          <NodeCard type="segmentacao" label="Segmentação" onClick={() => onNodeSelect?.("segmentacao")} />
          <NodeCard type="testeAB"     label="Teste A/B"   onClick={() => onNodeSelect?.("testeAB")} />
        </Section>

        <Section title="ENVIOS">
          <NodeCard type="email"      label="Email"        onClick={() => onNodeSelect?.("email")} />
          <NodeCard type="sms"        label="SMS"          onClick={() => onNodeSelect?.("sms")} />
          <NodeCard type="whatsapp"   label="WhatsApp"     onClick={() => onNodeSelect?.("whatsapp")} />
          <NodeCard type="mobilePush" label="Mobile Push"  onClick={() => onNodeSelect?.("mobilePush")} />
          <NodeCard type="webPush"    label="Web Push"     onClick={() => onNodeSelect?.("webPush")} />
        </Section>
      </div>
    </div>
  );
}


