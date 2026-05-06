/**
 * Central source of truth for journey node colours, labels and icon assets.
 * Icon URLs come from the Figma MCP server (node 1504-2682, file OImjZOw5sjd4DStdtSc3vQ).
 * They are served for 7 days; re-fetch from Figma if they expire.
 */

export const NODE_COLORS: Record<string, string> = {
  email:       "#2724ed",
  sms:         "#0ea5e9",
  whatsapp:    "#16a34a",
  mobilePush:  "#f77316",
  webPush:     "#7c3aed",
  edicaoProp:  "#9d174d",
  webhooks:    "#75ab21",
  desisncrever:"#ef4444",
  aguardar:    "#64748b",
  jornadaOutra:"#10b8a9",
  segmentacao: "#f79f28",
  testeAB:     "#fb7185",
};

export const NODE_LABELS: Record<string, string> = {
  email:        "Envio de E-mail",
  sms:          "Envio de SMS",
  whatsapp:     "Envio de WhatsApp",
  mobilePush:   "Envio de Mobile Push",
  webPush:      "Envio de Web Push",
  edicaoProp:   "Edição de Propriedade",
  webhooks:     "Webhooks",
  desisncrever: "Desisncrever",
  aguardar:     "Aguardar",
  jornadaOutra: "Adicionar a outra jornada",
  segmentacao:  "Segmentação",
  testeAB:      "Teste A/B",
};

/** Figma MCP asset URLs (expire ~7 days after fetch). */
const ICON_URLS: Record<string, string> = {
  email:        "https://www.figma.com/api/mcp/asset/116e8997-43d7-4033-8a61-4a168c042efe",
  segmentacao:  "https://www.figma.com/api/mcp/asset/c8e435ad-c352-4ced-9feb-ed2dc62e0a3f",
  edicaoProp:   "https://www.figma.com/api/mcp/asset/b3688361-abf9-4370-9480-430f27d03d40",
  webhooks:     "https://www.figma.com/api/mcp/asset/5d64a00e-e600-42c7-938d-2886c52303be",
  desisncrever: "https://www.figma.com/api/mcp/asset/a517d0df-c13f-4e6e-a038-674a6ae9a35f",
  aguardar:     "https://www.figma.com/api/mcp/asset/b50a6e25-5474-4fac-830e-51791babf5d1",
  jornadaOutra: "https://www.figma.com/api/mcp/asset/edd01b17-a50b-4862-af2d-5a1491d20294",
  testeAB:      "https://www.figma.com/api/mcp/asset/44454f3b-c5cb-4677-b62c-86e6be0df0a1",
  sms:          "https://www.figma.com/api/mcp/asset/997f3290-0a18-4fde-8c34-28a289dabbfe",
  whatsapp:     "https://www.figma.com/api/mcp/asset/48df54e3-e837-4db1-95c2-3330a43f66b3",
  mobilePush:   "https://www.figma.com/api/mcp/asset/0cc99c36-2548-40b2-90e0-d43b248e6961",
  webPush:      "https://www.figma.com/api/mcp/asset/057554b7-32d7-48d0-8327-40aee4c4ca97",
};

/**
 * Returns a React element for the icon badge that matches the Figma design:
 * - outer div: colored bg + p-[10px]
 * - inner div: 36×36, rounded-[6px], rgba(255,255,255,0.22)
 * - icon: 24×24 img from Figma asset (centred)
 */
export function NodeIconBadge({ type }: { type: string }) {
  const color = NODE_COLORS[type] ?? "#6b7280";
  const url   = ICON_URLS[type];

  return (
    <div style={{ background: color, padding: 10, flexShrink: 0, display: "flex", alignItems: "center" }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 6,
          background: "rgba(255,255,255,0.22)",
          overflow: "hidden",
          position: "relative",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {url ? (
          <img alt="" src={url} width={24} height={24} style={{ display: "block" }} />
        ) : (
          <div style={{ width: 24, height: 24, borderRadius: "50%", background: "white", opacity: 0.6 }} />
        )}
      </div>
    </div>
  );
}

/** Small img element for use inside GenericNode header (already has its own badge wrapper). */
export function NodeIconImg({ type, size = 20 }: { type: string; size?: number }) {
  const url = ICON_URLS[type];
  return url ? (
    <img alt="" src={url} width={size} height={size} style={{ display: "block" }} />
  ) : null;
}
