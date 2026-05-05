"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import EntradaCard from "./EntradaCard";
import JourneyNameCard from "./JourneyNameCard";
import ActionButtons from "./ActionButtons";
import ZoomControl from "./ZoomControl";
import ConfigurarEntradaPanel from "./ConfigurarEntradaPanel";
import AdicionarNoPanel from "./AdicionarNoPanel";

// Panels
import EnvioEmailPanel from "./EnvioEmailPanel";
import type { EmailNodeData } from "./EnvioEmailPanel";
import GenericNodePanel from "./GenericNodePanel";
import type { GenericNodeData as GenericPanelData } from "./GenericNodePanel";
import EdicaoPropriedadePanel from "./EdicaoPropriedadePanel";
import type { EdicaoPropriedadeNodeData } from "./EdicaoPropriedadePanel";
import WebhooksPanel from "./WebhooksPanel";
import type { WebhooksNodeData } from "./WebhooksPanel";
import DesisncreverPanel from "./DesisncreverPanel";
import type { DesisncreverNodeData } from "./DesisncreverPanel";
import AguardarCardNode from "./AguardarCardNode";
import type { AguardarNodeData } from "./AguardarCardNode";
import AdicionarJornadaPanel from "./AdicionarJornadaPanel";
import type { AdicionarJornadaNodeData } from "./AdicionarJornadaPanel";
import SegmentacaoNoPanel from "./SegmentacaoNoPanel";
import type { SegmentacaoNoNodeData } from "./SegmentacaoNoPanel";
import TesteABPanel from "./TesteABPanel";
import type { TesteABNodeData } from "./TesteABPanel";

// Canvas nodes
import GenericNode from "./GenericNode";
import type { GenericNodeData } from "./GenericNode";

/* ── Types ── */
type ActivePanel =
  | "none"
  | "configurar"
  | "adicionarNo"
  | "emailConfig"
  | "smsConfig"
  | "whatsappConfig"
  | "mobilePushConfig"
  | "webPushConfig"
  | "edicaoConfig"
  | "webhooksConfig"
  | "desisncreverConfig"
  | "jornadaConfig"
  | "segmentacaoConfig"
  | "testeABConfig";

interface SavedNode {
  id: string;
  data: GenericNodeData;
  panelType: string;
}

let _idCounter = 0;
function uid(): string {
  _idCounter++;
  return `node-${Date.now()}-${_idCounter}`;
}

/* ── Viewport constants ── */
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.1;
const GRID_SIZE = 24;

/* ── SVG icons for node cards ── */
const nodeIcons: Record<string, React.ReactNode> = {
  email: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  ),
  sms: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
    </svg>
  ),
  whatsapp: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M11.99 0C5.373 0 0 5.373 0 11.99c0 2.11.55 4.094 1.513 5.815L.057 23.929l6.304-1.474A11.944 11.944 0 0 0 11.99 24C18.607 24 24 18.627 24 12.01 24 5.393 18.607 0 11.99 0zm.01 21.818a9.828 9.828 0 0 1-5.014-1.368l-.36-.214-3.742.982 1-3.646-.233-.374a9.818 9.818 0 0 1-1.505-5.244c0-5.425 4.415-9.84 9.854-9.84 2.629 0 5.1 1.024 6.959 2.884A9.777 9.777 0 0 1 21.83 12c0 5.425-4.415 9.818-9.83 9.818z" />
    </svg>
  ),
  mobilePush: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
    </svg>
  ),
  webPush: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
  ),
  edicaoProp: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
      <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z" />
    </svg>
  ),
  webhooks: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
      <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
    </svg>
  ),
  desisncrever: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
      <path d="M14 8c0-2.21-1.79-4-4-4S6 5.79 6 8s1.79 4 4 4 4-1.79 4-4zm3 2v2h6v-2h-6zM2 18v2h16v-2c0-2.66-5.33-4-8-4s-8 1.34-8 4z" />
    </svg>
  ),
  aguardar: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
    </svg>
  ),
  jornadaOutra: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
      <path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z" />
    </svg>
  ),
  segmentacao: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
      <path d="M14 4l2.29 2.29-2.88 2.88 1.42 1.42 2.88-2.88L20 10V4zm-4 0H4v6l2.29-2.29 4.71 4.7V20h2v-8.41l-5.29-5.3z" />
    </svg>
  ),
  testeAB: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
      <path d="M9 2v8.5L5.5 17c-.91 1.37-.06 3 1.5 3h11c1.56 0 2.41-1.63 1.5-3L16 10.5V2H9zm1 2h4v5h-4V4zm2 11c-.83 0-1.5-.67-1.5-1.5S11.17 12 12 12s1.5.67 1.5 1.5S12.83 15 12 15z" />
    </svg>
  ),
};

const nodeColors: Record<string, string> = {
  email: "#2724ed",
  sms: "#0ea5e9",
  whatsapp: "#16a34a",
  mobilePush: "#f77316",
  webPush: "#7c3aed",
  edicaoProp: "#9d174d",
  webhooks: "#75ab21",
  desisncrever: "#ef4444",
  aguardar: "#64748b",
  jornadaOutra: "#10b8a9",
  segmentacao: "#f79f28",
  testeAB: "#fb7185",
};

const nodeLabels: Record<string, string> = {
  email: "Envio de E-mail",
  sms: "Envio de SMS",
  whatsapp: "Envio de WhatsApp",
  mobilePush: "Envio de Mobile Push",
  webPush: "Envio de Web Push",
  edicaoProp: "Edição de Propriedade",
  webhooks: "Webhooks",
  desisncrever: "Desisncrever",
  aguardar: "Aguardar",
  jornadaOutra: "Adicionar a outra jornada",
  segmentacao: "Segmentação",
  testeAB: "Teste A/B",
};

/* ── Canvas Utility Components ── */
function AddNodeButton({ active, onClick, style }: { active: boolean; onClick?: () => void; style?: React.CSSProperties }) {
  return (
    <button
      onClick={active ? onClick : undefined}
      disabled={!active}
      className={`absolute flex items-center justify-center rounded-[8px] px-[12px] py-[8px] transition-colors ${
        active
          ? "bg-brand text-white hover:opacity-90 cursor-pointer"
          : "bg-surface-disabled border border-border-disabled text-text-disabled cursor-not-allowed"
      }`}
      style={style}
    >
      <span className="text-sm font-semibold whitespace-nowrap">Adicionar nó</span>
    </button>
  );
}

function DashedConnector({ style }: { style?: React.CSSProperties }) {
  return (
    <div className="absolute flex items-center" style={style}>
      <div className="w-full border-t-2 border-dashed border-gray-300" />
    </div>
  );
}

function SolidConnector({ style }: { style?: React.CSSProperties }) {
  return (
    <div className="absolute flex items-center" style={style}>
      <div className="w-full border-t-2 border-gray-400" />
    </div>
  );
}

function AddCircleButton({ onClick, style }: { onClick?: () => void; style?: React.CSSProperties }) {
  return (
    <button
      onClick={onClick}
      className="absolute flex items-center justify-center rounded-full bg-[#2724ed] text-white hover:opacity-90 transition-opacity shadow-md"
      style={{ width: 28, height: 28, ...style }}
      title="Inserir nó"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 3v10M3 8h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </button>
  );
}

/* ── Main Canvas ── */
export default function Canvas() {
  const [activePanel, setActivePanel] = useState<ActivePanel>("none");
  const [savedSegmentacao, setSavedSegmentacao] = useState<string>("");
  const [savedNodes, setSavedNodes] = useState<SavedNode[]>([]);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [pendingAguardar, setPendingAguardar] = useState(false);

  /* ── Viewport state ── */
  const [viewport, setViewport] = useState({ zoom: 1, pan: { x: 0, y: 0 } });
  const [isDragging, setIsDragging] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  /* ── Non-passive wheel listener (zoom + pan) ── */
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    const handler = (e: WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        setViewport((vp) => {
          const factor = e.deltaY < 0 ? 1.1 : 0.9;
          const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, vp.zoom * factor));
          const rect = el.getBoundingClientRect();
          const mx = e.clientX - rect.left;
          const my = e.clientY - rect.top;
          return {
            zoom: newZoom,
            pan: {
              x: mx - (mx - vp.pan.x) * (newZoom / vp.zoom),
              y: my - (my - vp.pan.y) * (newZoom / vp.zoom),
            },
          };
        });
      } else {
        setViewport((vp) => ({
          ...vp,
          pan: { x: vp.pan.x - e.deltaX, y: vp.pan.y - e.deltaY },
        }));
      }
    };

    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  /* ── Mouse drag for pan ── */
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const target = e.target as Element;
    if (target.closest("button, input, select, a, [role='button'], [role='switch']")) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: viewport.pan.x,
      panY: viewport.pan.y,
    };
    e.preventDefault();
  }, [viewport.pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setViewport((vp) => ({
      ...vp,
      pan: {
        x: dragStartRef.current.panX + dx,
        y: dragStartRef.current.panY + dy,
      },
    }));
  }, [isDragging]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  /* ── Zoom button handlers ── */
  const handleZoomIn = useCallback(() => {
    setViewport((vp) => ({ ...vp, zoom: Math.min(MAX_ZOOM, Math.round((vp.zoom + ZOOM_STEP) * 10) / 10) }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setViewport((vp) => ({ ...vp, zoom: Math.max(MIN_ZOOM, Math.round((vp.zoom - ZOOM_STEP) * 10) / 10) }));
  }, []);

  /* ── Panel handlers ── */
  const nodeConfigured = Boolean(savedSegmentacao);

  const handleOpenConfigurar = () => setActivePanel("configurar");
  const handleOpenAdicionarNo = () => {
    setEditingNodeId(null);
    setActivePanel("adicionarNo");
  };
  const handleClosePanel = () => {
    setActivePanel("none");
    setEditingNodeId(null);
  };

  const handleAdd = (segmentacao: string) => {
    setSavedSegmentacao(segmentacao);
    setActivePanel("none");
  };

  const handleNodeSelect = (type: string) => {
    if (type === "aguardar") {
      setPendingAguardar(true);
      setActivePanel("none");
      return;
    }
    const panelMap: Record<string, ActivePanel> = {
      email: "emailConfig",
      sms: "smsConfig",
      whatsapp: "whatsappConfig",
      mobilePush: "mobilePushConfig",
      webPush: "webPushConfig",
      edicaoProp: "edicaoConfig",
      webhooks: "webhooksConfig",
      desisncrever: "desisncreverConfig",
      jornadaOutra: "jornadaConfig",
      segmentacao: "segmentacaoConfig",
      testeAB: "testeABConfig",
    };
    const panel = panelMap[type];
    if (panel) setActivePanel(panel);
  };

  const handleEditNode = (nodeId: string) => {
    const node = savedNodes.find((n) => n.id === nodeId);
    if (!node) return;
    setEditingNodeId(nodeId);
    handleNodeSelect(node.panelType);
  };

  function pushOrUpdateNode(data: GenericNodeData, panelType: string) {
    if (editingNodeId) {
      setSavedNodes((prev) =>
        prev.map((n) => (n.id === editingNodeId ? { ...n, data, panelType } : n))
      );
    } else {
      setSavedNodes((prev) => [...prev, { id: uid(), data, panelType }]);
    }
    setActivePanel("none");
    setEditingNodeId(null);
  }

  const handleEmailAdd = (raw: EmailNodeData) => {
    pushOrUpdateNode({
      type: "email",
      color: nodeColors.email,
      icon: nodeIcons.email,
      label: nodeLabels.email,
      fields: [{ key: "Tipo de Mensagem:", value: raw.tipoMensagem === "unica" ? "Mensagem única" : "Teste A/B" }],
    }, "email");
  };

  const handleGenericEnvioAdd = (type: string) => (raw: GenericPanelData) => {
    pushOrUpdateNode({
      type,
      color: nodeColors[type],
      icon: nodeIcons[type],
      label: nodeLabels[type],
      fields: [{ key: "Tipo de Mensagem:", value: raw.tipoMensagem === "unica" ? "Mensagem única" : "Teste A/B" }],
    }, type);
  };

  const handleEdicaoAdd = (raw: EdicaoPropriedadeNodeData) => {
    pushOrUpdateNode({
      type: "edicaoProp",
      color: nodeColors.edicaoProp,
      icon: nodeIcons.edicaoProp,
      label: nodeLabels.edicaoProp,
      fields: [{ key: "Propriedade:", value: raw.propriedade || "—" }],
    }, "edicaoProp");
  };

  const handleWebhooksAdd = (raw: WebhooksNodeData) => {
    pushOrUpdateNode({
      type: "webhooks",
      color: nodeColors.webhooks,
      icon: nodeIcons.webhooks,
      label: nodeLabels.webhooks,
      fields: [{ key: "Método:", value: raw.metodo }],
    }, "webhooks");
  };

  const handleDesisncreverAdd = (_raw: DesisncreverNodeData) => {
    pushOrUpdateNode({
      type: "desisncrever",
      color: nodeColors.desisncrever,
      icon: nodeIcons.desisncrever,
      label: nodeLabels.desisncrever,
      fields: [],
    }, "desisncrever");
  };

  const handleAguardarConfirm = (raw: AguardarNodeData) => {
    setSavedNodes((prev) => [
      ...prev,
      {
        id: uid(),
        panelType: "aguardar",
        data: {
          type: "aguardar",
          color: nodeColors.aguardar,
          icon: nodeIcons.aguardar,
          label: nodeLabels.aguardar,
          fields: [{ key: "Duração:", value: `${raw.quantidade} ${raw.unidade}` }],
          aguardarData: raw,
        },
      },
    ]);
    setPendingAguardar(false);
  };

  const handleAguardarUpdate = (nodeId: string, raw: AguardarNodeData) => {
    setSavedNodes((prev) =>
      prev.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              data: {
                ...n.data,
                fields: [{ key: "Duração:", value: `${raw.quantidade} ${raw.unidade}` }],
                aguardarData: raw,
              },
            }
          : n
      )
    );
  };

  const handleRemoveNode = (nodeId: string) => {
    setSavedNodes((prev) => prev.filter((n) => n.id !== nodeId));
  };

  const handleJornadaAdd = (raw: AdicionarJornadaNodeData) => {
    pushOrUpdateNode({
      type: "jornadaOutra",
      color: nodeColors.jornadaOutra,
      icon: nodeIcons.jornadaOutra,
      label: nodeLabels.jornadaOutra,
      fields: [{ key: "Redirecionar para:", value: raw.jornada || "—" }],
    }, "jornadaOutra");
  };

  const handleSegmentacaoAdd = (raw: SegmentacaoNoNodeData) => {
    pushOrUpdateNode({
      type: "segmentacao",
      color: nodeColors.segmentacao,
      icon: nodeIcons.segmentacao,
      label: nodeLabels.segmentacao,
      fields: [{ key: "Segmentação:", value: raw.segmentacao || "—" }],
    }, "segmentacao");
  };

  const handleTesteABAdd = (_raw: TesteABNodeData) => {
    pushOrUpdateNode({
      type: "testeAB",
      color: nodeColors.testeAB,
      icon: nodeIcons.testeAB,
      label: nodeLabels.testeAB,
      fields: [{ key: "Variantes:", value: "2 variantes" }],
    }, "testeAB");
  };

  /* ── Node positioning (cumulative, respects per-node widths) ── */
  const NODE_START = 500;
  const NODE_GAP = 64;   // space between nodes (for connector line + add button)
  const NODE_WIDTH = 260; // default GenericNode width
  const AGUARDAR_WIDTH = 352; // badge(44) - overlap(16) + bar(324) = 352
  const topTransform = "translateY(-50%) translateY(41px)";
  const totalNodes = savedNodes.length;

  const nodeWidthOf = (node: SavedNode) =>
    node.data.type === "aguardar" ? AGUARDAR_WIDTH : NODE_WIDTH;

  // Build cumulative left positions for each saved node
  const nodePositions: number[] = [];
  {
    let x = NODE_START;
    for (const node of savedNodes) {
      nodePositions.push(x);
      x += nodeWidthOf(node) + NODE_GAP;
    }
  }

  const getNodeLeft = (idx: number) => nodePositions[idx] ?? NODE_START;

  // Left edge of connector after node idx
  const getConnectorLeft = (idx: number) =>
    getNodeLeft(idx) + nodeWidthOf(savedNodes[idx]);

  // Right edge = start of next node (or pending aguardar position)
  const pendingAguardarLeft = nodePositions.length > 0
    ? nodePositions[nodePositions.length - 1] + nodeWidthOf(savedNodes[savedNodes.length - 1]) + NODE_GAP
    : NODE_START;

  const getConnectorRight = (idx: number) => {
    if (idx + 1 < totalNodes) return getNodeLeft(idx + 1);
    if (pendingAguardar) return pendingAguardarLeft;
    return getConnectorLeft(idx) + 72; // trailing dashed connector
  };

  const getConnectorWidth = (idx: number) =>
    getConnectorRight(idx) - getConnectorLeft(idx);

  /* ── Envio panel icon (large 28px white) ── */
  const envioIcon = (type: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      sms: <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" /></svg>,
      whatsapp: <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M11.99 0C5.373 0 0 5.373 0 11.99c0 2.11.55 4.094 1.513 5.815L.057 23.929l6.304-1.474A11.944 11.944 0 0 0 11.99 24C18.607 24 24 18.627 24 12.01 24 5.393 18.607 0 11.99 0zm.01 21.818a9.828 9.828 0 0 1-5.014-1.368l-.36-.214-3.742.982 1-3.646-.233-.374a9.818 9.818 0 0 1-1.505-5.244c0-5.425 4.415-9.84 9.854-9.84 2.629 0 5.1 1.024 6.959 2.884A9.777 9.777 0 0 1 21.83 12c0 5.425-4.415 9.818-9.83 9.818z" /></svg>,
      mobilePush: <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" /></svg>,
      webPush: <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>,
    };
    return iconMap[type] ?? null;
  };

  /* ── Derived grid background values ── */
  const gridSizePx = GRID_SIZE * viewport.zoom;
  const bgPos = `${viewport.pan.x % gridSizePx}px ${viewport.pan.y % gridSizePx}px`;

  return (
    <div
      ref={canvasRef}
      className="relative flex-1 overflow-hidden select-none"
      style={{
        backgroundImage: "radial-gradient(circle, #c8cdd3 1px, transparent 1px)",
        backgroundSize: `${gridSizePx}px ${gridSizePx}px`,
        backgroundPosition: bgPos,
        backgroundColor: "#f0f2f4",
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* ── Top bar (fixed to canvas, not transformed) ── */}
      <div className="absolute top-[24px] left-[24px] right-[24px] flex items-start justify-between z-10 pointer-events-auto">
        <JourneyNameCard />
        <ActionButtons />
      </div>

      {/* ── Transformed canvas content ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          transform: `translate(${viewport.pan.x}px, ${viewport.pan.y}px) scale(${viewport.zoom})`,
          transformOrigin: "0 0",
          pointerEvents: isDragging ? "none" : "auto",
        }}
      >
        <EntradaCard
          onConfigure={handleOpenConfigurar}
          savedSegmentacao={savedSegmentacao || undefined}
        />

        {/* No nodes yet and no pending */}
        {totalNodes === 0 && !pendingAguardar && activePanel !== "configurar" && (
          <>
            <DashedConnector
              style={{ left: "376px", top: "50%", transform: topTransform, width: "72px" }}
            />
            <AddNodeButton
              active={nodeConfigured}
              onClick={handleOpenAdicionarNo}
              style={{ left: "448px", top: "50%", transform: topTransform }}
            />
          </>
        )}

        {/* Nodes exist OR pending aguardar */}
        {(totalNodes > 0 || pendingAguardar) && (
          <>
            <SolidConnector
              style={{ left: "376px", top: "50%", transform: topTransform, width: "124px" }}
            />
            <AddCircleButton
              style={{ left: "426px", top: "50%", transform: topTransform }}
              onClick={handleOpenAdicionarNo}
            />

            {savedNodes.map((node, idx) => (
              <div key={node.id}>
                {node.data.type === "aguardar" ? (
                  <AguardarCardNode
                    initialData={node.data.aguardarData}
                    style={{ left: `${getNodeLeft(idx)}px` }}
                    onConfirm={(data) => handleAguardarUpdate(node.id, data)}
                    onCancel={() => {}}
                    onRemove={() => handleRemoveNode(node.id)}
                  />
                ) : (
                  <GenericNode
                    data={node.data}
                    onEdit={() => handleEditNode(node.id)}
                    style={{ left: `${getNodeLeft(idx)}px` }}
                  />
                )}

                {idx < totalNodes - 1 ? (
                  <>
                    <SolidConnector
                      style={{
                        left: `${getConnectorLeft(idx)}px`,
                        top: "50%",
                        transform: topTransform,
                        width: `${getConnectorWidth(idx)}px`,
                      }}
                    />
                    <AddCircleButton
                      style={{
                        left: `${getConnectorLeft(idx) + Math.floor(getConnectorWidth(idx) / 2) - 14}px`,
                        top: "50%",
                        transform: topTransform,
                      }}
                      onClick={handleOpenAdicionarNo}
                    />
                  </>
                ) : !pendingAguardar ? (
                  <>
                    <DashedConnector
                      style={{
                        left: `${getConnectorLeft(idx)}px`,
                        top: "50%",
                        transform: topTransform,
                        width: "72px",
                      }}
                    />
                    <AddNodeButton
                      active={true}
                      onClick={handleOpenAdicionarNo}
                      style={{
                        left: `${getConnectorLeft(idx) + 72}px`,
                        top: "50%",
                        transform: topTransform,
                      }}
                    />
                  </>
                ) : (
                  // Connector from last saved node to the pending aguardar
                  <SolidConnector
                    style={{
                      left: `${getConnectorLeft(idx)}px`,
                      top: "50%",
                      transform: topTransform,
                      width: `${getConnectorWidth(idx)}px`,
                    }}
                  />
                )}
              </div>
            ))}

            {/* Pending aguardar node (being configured inline) */}
            {pendingAguardar && (
              <AguardarCardNode
                isNew
                style={{ left: `${pendingAguardarLeft}px` }}
                onConfirm={handleAguardarConfirm}
                onCancel={() => setPendingAguardar(false)}
                onRemove={() => setPendingAguardar(false)}
              />
            )}
          </>
        )}
      </div>

      {/* ── Panels (position: fixed — unaffected by canvas transform) ── */}
      {activePanel === "configurar" && (
        <ConfigurarEntradaPanel
          initialSegmentacao={savedSegmentacao}
          onClose={handleClosePanel}
          onAdd={handleAdd}
        />
      )}
      {activePanel === "adicionarNo" && (
        <AdicionarNoPanel onClose={handleClosePanel} onNodeSelect={handleNodeSelect} />
      )}
      {activePanel === "emailConfig" && (
        <EnvioEmailPanel onClose={handleClosePanel} onAdd={handleEmailAdd} />
      )}
      {activePanel === "smsConfig" && (
        <GenericNodePanel
          color={nodeColors.sms}
          icon={envioIcon("sms")}
          title={nodeLabels.sms}
          onClose={handleClosePanel}
          onAdd={handleGenericEnvioAdd("sms")}
        />
      )}
      {activePanel === "whatsappConfig" && (
        <GenericNodePanel
          color={nodeColors.whatsapp}
          icon={envioIcon("whatsapp")}
          title={nodeLabels.whatsapp}
          onClose={handleClosePanel}
          onAdd={handleGenericEnvioAdd("whatsapp")}
        />
      )}
      {activePanel === "mobilePushConfig" && (
        <GenericNodePanel
          color={nodeColors.mobilePush}
          icon={envioIcon("mobilePush")}
          title={nodeLabels.mobilePush}
          onClose={handleClosePanel}
          onAdd={handleGenericEnvioAdd("mobilePush")}
        />
      )}
      {activePanel === "webPushConfig" && (
        <GenericNodePanel
          color={nodeColors.webPush}
          icon={envioIcon("webPush")}
          title={nodeLabels.webPush}
          onClose={handleClosePanel}
          onAdd={handleGenericEnvioAdd("webPush")}
        />
      )}
      {activePanel === "edicaoConfig" && (
        <EdicaoPropriedadePanel onClose={handleClosePanel} onAdd={handleEdicaoAdd} />
      )}
      {activePanel === "webhooksConfig" && (
        <WebhooksPanel onClose={handleClosePanel} onAdd={handleWebhooksAdd} />
      )}
      {activePanel === "desisncreverConfig" && (
        <DesisncreverPanel onClose={handleClosePanel} onAdd={handleDesisncreverAdd} />
      )}
      {activePanel === "jornadaConfig" && (
        <AdicionarJornadaPanel onClose={handleClosePanel} onAdd={handleJornadaAdd} />
      )}
      {activePanel === "segmentacaoConfig" && (
        <SegmentacaoNoPanel onClose={handleClosePanel} onAdd={handleSegmentacaoAdd} />
      )}
      {activePanel === "testeABConfig" && (
        <TesteABPanel onClose={handleClosePanel} onAdd={handleTesteABAdd} />
      )}

      {/* ── Zoom control (outside transform) ── */}
      <ZoomControl
        zoom={Math.round(viewport.zoom * 100)}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />
    </div>
  );
}
