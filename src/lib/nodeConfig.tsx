/**
 * Central source of truth for journey node colours, labels and icon assets.
 * Icons are stored locally in /public/icons/{type}.png — no expiry.
 * To refresh: use Figma MCP on node 1504:2682, file OImjZOw5sjd4DStdtSc3vQ,
 * download the assets and replace the files in public/icons/.
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

const ICON_URLS: Record<string, string> = {
  email:        "/icons/email.svg",
  segmentacao:  "/icons/segmentacao.svg",
  edicaoProp:   "/icons/edicaoProp.svg",
  webhooks:     "/icons/webhooks.svg",
  desisncrever: "/icons/desisncrever.svg",
  aguardar:     "/icons/aguardar.svg",
  jornadaOutra: "/icons/jornadaOutra.svg",
  testeAB:      "/icons/testeAB.svg",
  sms:          "/icons/sms.svg",
  whatsapp:     "/icons/whatsapp.svg",
  mobilePush:   "/icons/mobilePush.svg",
  webPush:      "/icons/webPush.svg",
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
