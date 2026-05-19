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
import SmsPanel from "./SmsPanel";
import type { SmsNodeData } from "./SmsPanel";
import MobilePushPanel from "./MobilePushPanel";
import type { MobilePushNodeData } from "./MobilePushPanel";
import WhatsAppPanel from "./WhatsAppPanel";
import type { WhatsAppNodeData } from "./WhatsAppPanel";
import WebPushPanel from "./WebPushPanel";
import type { WebPushNodeData } from "./WebPushPanel";
import DesisncreverCardNode from "./DesisncreverCardNode";
import AguardarCardNode from "./AguardarCardNode";
import type { AguardarNodeData } from "./AguardarCardNode";
import JornadaCardNode from "./JornadaCardNode";
import type { JornadaCardNodeData } from "./JornadaCardNode";
import SegmentacaoNoPanel from "./SegmentacaoNoPanel";
import type { SegmentacaoNoNodeData } from "./SegmentacaoNoPanel";
import SegmentacaoCardNode, { SEGMENTACAO_CARD_WIDTH } from "./SegmentacaoCardNode";
import TesteABPanel from "./TesteABPanel";
import TesteABCardNode from "./TesteABCardNode";
import type { TesteABCardNodeData } from "./TesteABCardNode";

import MiniMap from "./MiniMap";
import type { MiniMapNode } from "./MiniMap";

// Canvas nodes
import GenericNode from "./GenericNode";
import type { GenericNodeData } from "./GenericNode";
import { NODE_COLORS, NODE_LABELS, NodeIconImg } from "@/lib/nodeConfig";

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
  | "segmentacaoConfig"
  | "testeABConfig";

interface BranchChain {
  id: string;
  label: string;
  color: string;
  percentual: number;
  nodes: SavedNode[];
  rawData?: SegmentacaoNoNodeData;
  isNegativa?: boolean;
}

interface SavedNode {
  id: string;
  data: GenericNodeData;
  panelType: string;
  rawData?: unknown;
  branches?: BranchChain[];
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

const nodeColors = NODE_COLORS;
const nodeLabels = NODE_LABELS;

/** Icon element for a given node type (20×20 Figma asset image). */
const nodeIcon = (type: string): React.ReactNode => <NodeIconImg type={type} />;

/* ── Canvas Utility Components ── */
function AddNodeButton({ active, onClick, style, label = "Adicionar nó" }: { active: boolean; onClick?: () => void; style?: React.CSSProperties; label?: string }) {
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
      <span className="text-sm font-semibold whitespace-nowrap">{label}</span>
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

function BranchDropdown({
  style,
  onSelect,
  onClose,
}: {
  style?: React.CSSProperties;
  onSelect: (type: "segmentar" | "nao-atende") => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    const timeout = setTimeout(() => {
      if (!mounted) return;
      const handler = (e: MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target as Node)) onClose();
      };
      document.addEventListener("mousedown", handler);
      (ref as React.MutableRefObject<{ _cleanup?: () => void }>).current!._cleanup = () =>
        document.removeEventListener("mousedown", handler);
    }, 0);
    return () => {
      mounted = false;
      clearTimeout(timeout);
      (ref as React.MutableRefObject<{ _cleanup?: () => void }>).current?._cleanup?.();
    };
  }, [onClose]);

  return (
    <div ref={ref} className="absolute" style={{ ...style, zIndex: 50 }}>
      <div
        className="rounded-[8px] border border-[#E8EAEC] bg-[#FCFCFC] overflow-hidden"
        style={{ width: 224, boxShadow: "0 4px 6px -2px rgba(16,24,40,0.03), 0 12px 16px -4px rgba(16,24,40,0.08)" }}
      >
        <button
          className="w-full flex items-center gap-3 px-3 py-[11px] hover:bg-[#F5F6F7] transition-colors text-left"
          onClick={() => onSelect("segmentar")}
        >
          <svg width="14" height="12" viewBox="28 17 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M35.3327 17.6665L36.8593 19.1932L34.9393 21.1132L35.886 22.0598L37.806 20.1398L39.3327 21.6665V17.6665H35.3327ZM32.666 17.6665H28.666V21.6665L30.1927 20.1398L33.3327 23.2732V28.3332H34.666V22.7265L31.1393 19.1932L32.666 17.6665Z" fill="#6F7680"/>
          </svg>
          <span className="text-sm text-[#343B44]">Segmentação</span>
        </button>
        <div className="h-px bg-[#E8EAEC]" />
        <button
          className="w-full flex items-center gap-3 px-3 py-[11px] hover:bg-[#F5F6F7] transition-colors text-left"
          onClick={() => onSelect("nao-atende")}
        >
          <svg width="14" height="14" viewBox="27 54 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M34.0007 54.3335C30.3207 54.3335 27.334 57.3202 27.334 61.0002C27.334 64.6802 30.3207 67.6668 34.0007 67.6668C37.6807 67.6668 40.6673 64.6802 40.6673 61.0002C40.6673 57.3202 37.6807 54.3335 34.0007 54.3335ZM34.0007 66.3335C31.0607 66.3335 28.6673 63.9402 28.6673 61.0002C28.6673 58.0602 31.0607 55.6668 34.0007 55.6668C36.9407 55.6668 39.334 58.0602 39.334 61.0002C39.334 63.9402 36.9407 66.3335 34.0007 66.3335ZM30.6673 60.3335H37.334V61.6668H30.6673V60.3335Z" fill="#6F7680"/>
          </svg>
          <span className="text-sm text-[#343B44]">Negativa</span>
        </button>
      </div>
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
  const [pendingJornada, setPendingJornada] = useState(false);
  const [branchContext, setBranchContext] = useState<{
    parentNodeId: string;
    branchIdx: number;
    nestedNodeId?: string;
    subBranchIdx?: number;
  } | null>(null);
  const [pendingBranchNode, setPendingBranchNode] = useState<{ type: "aguardar" | "jornada"; parentNodeId: string; branchIdx: number; nestedNodeId?: string; subBranchIdx?: number } | null>(null);
  const [openBranchDropdownKey, setOpenBranchDropdownKey] = useState<string | null>(null);
  const [editingSegBranch, setEditingSegBranch] = useState<{ parentNodeId: string; branchIdx: number } | null>(null);

  /* ── Viewport state ── */
  const [viewport, setViewport] = useState({ zoom: 1, pan: { x: 0, y: 0 } });
  const [isDragging, setIsDragging] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const activePanelRef = useRef(activePanel);
  useEffect(() => { activePanelRef.current = activePanel; }, [activePanel]);

  /* ── Non-passive wheel listener (zoom + pan) ── */
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    const handler = (e: WheelEvent) => {
      if (activePanelRef.current !== "none") return;
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

  const handlePanTo = useCallback((pan: { x: number; y: number }) => {
    setViewport((vp) => ({ ...vp, pan }));
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
    setBranchContext(null);
    setEditingSegBranch(null);
  };

  const removeHandler = editingNodeId
    ? () => { handleRemoveNode(editingNodeId); handleClosePanel(); }
    : undefined;

  const editingNode = editingNodeId
    ? branchContext
      ? savedNodes
          .find((n) => n.id === branchContext.parentNodeId)
          ?.branches?.[branchContext.branchIdx]?.nodes.find((bn) => bn.id === editingNodeId) ?? null
      : savedNodes.find((n) => n.id === editingNodeId) ?? null
    : null;

  const handleAdd = (segmentacao: string) => {
    setSavedSegmentacao(segmentacao);
    setActivePanel("none");
  };

  const handleNodeSelect = (type: string) => {
    if (type === "aguardar") {
      if (branchContext) {
        const { parentNodeId, branchIdx, nestedNodeId, subBranchIdx } = branchContext;
        setPendingBranchNode({ type: "aguardar", parentNodeId, branchIdx, nestedNodeId, subBranchIdx });
        setBranchContext(null);
      } else {
        setPendingAguardar(true);
      }
      setActivePanel("none");
      return;
    }
    if (type === "jornadaOutra") {
      if (branchContext) {
        const { parentNodeId, branchIdx, nestedNodeId, subBranchIdx } = branchContext;
        setPendingBranchNode({ type: "jornada", parentNodeId, branchIdx, nestedNodeId, subBranchIdx });
        setBranchContext(null);
      } else {
        setPendingJornada(true);
      }
      setActivePanel("none");
      return;
    }
    if (type === "desisncrever") {
      const newNode: SavedNode = {
        id: uid(),
        panelType: "desisncrever",
        data: {
          type: "desisncrever",
          color: nodeColors.desisncrever,
          icon: nodeIcon("desisncrever"),
          label: nodeLabels.desisncrever,
          fields: [],
        },
      };
      if (branchContext) {
        const { parentNodeId, branchIdx, nestedNodeId, subBranchIdx } = branchContext;
        setSavedNodes((prev) => prev.map((n) => {
          if (n.id !== parentNodeId || !n.branches) return n;
          return {
            ...n, branches: n.branches.map((b, bi) => {
              if (bi !== branchIdx) return b;
              if (nestedNodeId !== undefined && subBranchIdx !== undefined) {
                return {
                  ...b, nodes: b.nodes.map((bn) => {
                    if (bn.id !== nestedNodeId || !bn.branches) return bn;
                    return { ...bn, branches: bn.branches.map((sb, sbi) => sbi === subBranchIdx ? { ...sb, nodes: [...sb.nodes, newNode] } : sb) };
                  }),
                };
              }
              return { ...b, nodes: [...b.nodes, newNode] };
            }),
          };
        }));
        setBranchContext(null);
      } else {
        setSavedNodes((prev) => [...prev, newNode]);
      }
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
      segmentacao: "segmentacaoConfig",
      testeAB: "testeABConfig",
    };
    const panel = panelMap[type];
    if (panel) setActivePanel(panel);
  };

  const handleEditNode = (nodeId: string, ctx?: { parentNodeId: string; branchIdx: number }) => {
    if (ctx) setBranchContext(ctx);
    const node = ctx
      ? savedNodes.find((n) => n.id === ctx.parentNodeId)?.branches?.[ctx.branchIdx]?.nodes.find((bn) => bn.id === nodeId)
      : savedNodes.find((n) => n.id === nodeId);
    if (!node) return;
    setEditingNodeId(nodeId);
    handleNodeSelect(node.panelType);
  };

  function pushOrUpdateNode(data: GenericNodeData, panelType: string, rawData?: unknown) {
    if (branchContext) {
      const { parentNodeId, branchIdx, nestedNodeId, subBranchIdx } = branchContext;
      setSavedNodes((prev) =>
        prev.map((n) => {
          if (n.id !== parentNodeId || !n.branches) return n;
          const branches = n.branches.map((b, bi) => {
            if (bi !== branchIdx) return b;
            // Sub-branch of a nested node inside this branch
            if (nestedNodeId !== undefined && subBranchIdx !== undefined) {
              return {
                ...b,
                nodes: b.nodes.map((bn) => {
                  if (bn.id !== nestedNodeId || !bn.branches) return bn;
                  const subBranches = bn.branches.map((sb, sbi) => {
                    if (sbi !== subBranchIdx) return sb;
                    return { ...sb, nodes: [...sb.nodes, { id: uid(), data, panelType, rawData }] };
                  });
                  return { ...bn, branches: subBranches };
                }),
              };
            }
            if (editingNodeId) {
              return { ...b, nodes: b.nodes.map((bn) => (bn.id === editingNodeId ? { ...bn, data, panelType, rawData } : bn)) };
            }
            return { ...b, nodes: [...b.nodes, { id: uid(), data, panelType, rawData }] };
          });
          return { ...n, branches };
        })
      );
      setBranchContext(null);
    } else if (editingNodeId) {
      setSavedNodes((prev) =>
        prev.map((n) => (n.id === editingNodeId ? { ...n, data, panelType, rawData } : n))
      );
    } else {
      setSavedNodes((prev) => [...prev, { id: uid(), data, panelType, rawData }]);
    }
    setActivePanel("none");
    setEditingNodeId(null);
  }

  const handleWebPushAdd = (raw: WebPushNodeData) => {
    pushOrUpdateNode({
      type: "webPush",
      color: nodeColors.webPush,
      icon: nodeIcon("webPush"),
      label: nodeLabels.webPush,
      fields: [
        { key: "Nome:", value: raw.nome || "—" },
        { key: "Tipo:", value: raw.tipoMensagem === "unica" ? "Mensagem única" : "Teste A/B" },
      ],
    }, "webPush", raw);
  };

  const handleWhatsAppAdd = (raw: WhatsAppNodeData) => {
    pushOrUpdateNode({
      type: "whatsapp",
      color: nodeColors.whatsapp,
      icon: nodeIcon("whatsapp"),
      label: nodeLabels.whatsapp,
      fields: [
        { key: "Nome:", value: raw.nome || "—" },
        { key: "Tipo:", value: raw.tipoMensagem === "unica" ? "Mensagem única" : "Teste A/B" },
      ],
    }, "whatsapp", raw);
  };

  const handleMobilePushAdd = (raw: MobilePushNodeData) => {
    pushOrUpdateNode({
      type: "mobilePush",
      color: nodeColors.mobilePush,
      icon: nodeIcon("mobilePush"),
      label: nodeLabels.mobilePush,
      fields: [
        { key: "Nome:", value: raw.nome || "—" },
        { key: "Tipo:", value: raw.tipoMensagem === "unica" ? "Mensagem única" : "Teste A/B" },
      ],
    }, "mobilePush", raw);
  };

  const handleSmsAdd = (raw: SmsNodeData) => {
    pushOrUpdateNode({
      type: "sms",
      color: nodeColors.sms,
      icon: nodeIcon("sms"),
      label: nodeLabels.sms,
      fields: [
        { key: "Nome:", value: raw.nome || "—" },
        { key: "Tipo:", value: raw.tipoMensagem === "unica" ? "Mensagem única" : "Teste A/B" },
      ],
    }, "sms", raw);
  };

  const handleEmailAdd = (raw: EmailNodeData) => {
    pushOrUpdateNode({
      type: "email",
      color: nodeColors.email,
      icon: nodeIcon("email"),
      label: nodeLabels.email,
      fields: [{ key: "Tipo de Mensagem:", value: raw.tipoMensagem === "unica" ? "Mensagem única" : "Teste A/B" }],
    }, "email", raw);
  };

  const handleGenericEnvioAdd = (type: string) => (raw: GenericPanelData) => {
    pushOrUpdateNode({
      type,
      color: nodeColors[type],
      icon: nodeIcon(type),
      label: nodeLabels[type],
      fields: [{ key: "Tipo de Mensagem:", value: raw.tipoMensagem === "unica" ? "Mensagem única" : "Teste A/B" }],
    }, type, raw);
  };

  const handleEdicaoAdd = (raw: EdicaoPropriedadeNodeData) => {
    pushOrUpdateNode({
      type: "edicaoProp",
      color: nodeColors.edicaoProp,
      icon: nodeIcon("edicaoProp"),
      label: nodeLabels.edicaoProp,
      fields: [{ key: "Propriedade:", value: raw.nome || "—" }],
    }, "edicaoProp", raw);
  };

  const handleWebhooksAdd = (raw: WebhooksNodeData) => {
    pushOrUpdateNode({
      type: "webhooks",
      color: nodeColors.webhooks,
      icon: nodeIcon("webhooks"),
      label: nodeLabels.webhooks,
      fields: [
        { key: "Nome:", value: raw.nome || "—" },
        { key: "Método:", value: raw.metodo },
      ],
    }, "webhooks", raw);
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
          icon: nodeIcon("aguardar"),
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

  // Branch-specific helpers for inline card nodes
  const addBranchInlineNode = (parentNodeId: string, branchIdx: number, node: SavedNode, nestedNodeId?: string, subBranchIdx?: number) => {
    setSavedNodes((prev) => prev.map((n) => {
      if (n.id !== parentNodeId || !n.branches) return n;
      return {
        ...n, branches: n.branches.map((b, bi) => {
          if (bi !== branchIdx) return b;
          if (nestedNodeId !== undefined && subBranchIdx !== undefined) {
            return {
              ...b, nodes: b.nodes.map((bn) => {
                if (bn.id !== nestedNodeId || !bn.branches) return bn;
                return { ...bn, branches: bn.branches.map((sb, sbi) => sbi === subBranchIdx ? { ...sb, nodes: [...sb.nodes, node] } : sb) };
              }),
            };
          }
          return { ...b, nodes: [...b.nodes, node] };
        }),
      };
    }));
    setPendingBranchNode(null);
  };

  const updateBranchInlineNode = (parentNodeId: string, branchIdx: number, nodeId: string, updater: (n: SavedNode) => SavedNode) => {
    setSavedNodes((prev) => prev.map((n) => {
      if (n.id !== parentNodeId || !n.branches) return n;
      return { ...n, branches: n.branches.map((b, bi) => bi === branchIdx ? { ...b, nodes: b.nodes.map((bn) => bn.id === nodeId ? updater(bn) : bn) } : b) };
    }));
  };

  const handleBranchAguardarConfirm = (parentNodeId: string, branchIdx: number, raw: AguardarNodeData, nestedNodeId?: string, subBranchIdx?: number) => {
    addBranchInlineNode(parentNodeId, branchIdx, {
      id: uid(),
      panelType: "aguardar",
      data: {
        type: "aguardar",
        color: nodeColors.aguardar,
        icon: nodeIcon("aguardar"),
        label: nodeLabels.aguardar,
        fields: [{ key: "Duração:", value: `${raw.quantidade} ${raw.unidade}` }],
        aguardarData: raw,
      },
    }, nestedNodeId, subBranchIdx);
  };

  const handleBranchJornadaConfirm = (parentNodeId: string, branchIdx: number, raw: JornadaCardNodeData, nestedNodeId?: string, subBranchIdx?: number) => {
    addBranchInlineNode(parentNodeId, branchIdx, {
      id: uid(),
      panelType: "jornadaOutra",
      data: {
        type: "jornadaOutra",
        color: nodeColors.jornadaOutra,
        icon: nodeIcon("jornadaOutra"),
        label: nodeLabels.jornadaOutra,
        fields: [{ key: "Redirecionar para:", value: raw.jornada }],
        jornadaData: raw,
      },
    }, nestedNodeId, subBranchIdx);
  };

  const handleRemoveNode = (nodeId: string) => {
    setSavedNodes((prev) => {
      if (prev.some((n) => n.id === nodeId)) return prev.filter((n) => n.id !== nodeId);
      return prev.map((n) => {
        if (!n.branches) return n;
        return { ...n, branches: n.branches.map((b) => ({ ...b, nodes: b.nodes.filter((bn) => bn.id !== nodeId) })) };
      });
    });
  };

  const handleTesteABAdd = (raw: TesteABCardNodeData) => {
    const nodeData = {
      type: "testeAB",
      color: nodeColors.testeAB,
      icon: nodeIcon("testeAB"),
      label: nodeLabels.testeAB,
      fields: [{ key: "Variantes:", value: `${raw.variantes.length} variantes` }],
    };
    if (editingNodeId) {
      setSavedNodes((prev) =>
        prev.map((n) => {
          if (n.id !== editingNodeId) return n;
          const existing = n.branches ?? [];
          const branches = raw.variantes.map((v, i) => ({
            id: existing[i]?.id ?? uid(),
            label: v.label,
            color: v.color,
            percentual: v.percentual,
            nodes: existing[i]?.nodes ?? [],
          }));
          return { ...n, data: nodeData, rawData: raw, branches };
        })
      );
      setActivePanel("none");
      setEditingNodeId(null);
    } else {
      setSavedNodes((prev) => [
        ...prev,
        {
          id: uid(),
          panelType: "testeAB",
          data: nodeData,
          rawData: raw,
          branches: raw.variantes.map((v) => ({
            id: uid(),
            label: v.label,
            color: v.color,
            percentual: v.percentual,
            nodes: [],
          })),
        },
      ]);
      setActivePanel("none");
    }
  };

  const handleJornadaConfirm = (raw: JornadaCardNodeData) => {
    setSavedNodes((prev) => [
      ...prev,
      {
        id: uid(),
        panelType: "jornadaOutra",
        data: {
          type: "jornadaOutra",
          color: nodeColors.jornadaOutra,
          icon: nodeIcon("jornadaOutra"),
          label: nodeLabels.jornadaOutra,
          fields: [{ key: "Redirecionar para:", value: raw.jornada }],
          jornadaData: raw,
        },
      },
    ]);
    setPendingJornada(false);
  };

  const handleJornadaUpdate = (nodeId: string, raw: JornadaCardNodeData) => {
    setSavedNodes((prev) =>
      prev.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              data: {
                ...n.data,
                fields: [{ key: "Redirecionar para:", value: raw.jornada }],
                jornadaData: raw,
              },
            }
          : n
      )
    );
  };

  const handleSegmentacaoAdd = (raw: SegmentacaoNoNodeData) => {
    const newPriority = raw.prioridade; // 1-based

    // Sync labels and rawData.prioridade after reorder.
    // fallback fills branches that were created without rawData (e.g. the original branches[0]).
    const syncBranchOrder = (branches: BranchChain[], fallback?: unknown) => {
      branches.forEach((b, i) => {
        b.label = `Segmentação ${i + 1}`;
        const rd = (b.rawData ?? fallback) as SegmentacaoNoNodeData | undefined;
        if (rd) b.rawData = { ...rd, prioridade: i + 1 };
      });
    };

    // Editing rawData of a specific branch (bi > 0)
    if (editingSegBranch) {
      const { parentNodeId, branchIdx } = editingSegBranch;
      setSavedNodes((prev) =>
        prev.map((n) => {
          if (n.id !== parentNodeId || !n.branches) return n;
          const branches = [...n.branches];
          const negativa = branches[branches.length - 1]?.isNegativa ? branches.pop()! : null;
          branches[branchIdx] = { ...branches[branchIdx], rawData: raw };
          if (newPriority !== undefined && newPriority !== branchIdx + 1) {
            const [moved] = branches.splice(branchIdx, 1);
            branches.splice(newPriority - 1, 0, moved);
          }
          syncBranchOrder(branches, n.rawData);
          if (negativa) branches.push(negativa);
          // Keep node.rawData in sync with whatever is now at position 0
          return { ...n, branches, rawData: branches[0].rawData ?? n.rawData };
        })
      );
      setEditingSegBranch(null);
      setActivePanel("none");
      return;
    }

    const nodeData = {
      type: "segmentacao",
      color: nodeColors.segmentacao,
      icon: nodeIcon("segmentacao"),
      label: nodeLabels.segmentacao,
      fields: [{ key: "Segmentação:", value: raw.segmentacao || "—" }],
    };
    if (branchContext) {
      const { parentNodeId } = branchContext;
      const parentNode = savedNodes.find((n) => n.id === parentNodeId);

      // If parent is a segmentation node: add new branch before the negativa (if exists)
      if (parentNode?.data.type === "segmentacao" && parentNode.branches) {
        setSavedNodes((prev) =>
          prev.map((n) => {
            if (n.id !== parentNodeId || !n.branches) return n;
            const branches = [...n.branches];
            const hasNegativa = branches[branches.length - 1]?.isNegativa;
            const negativa = hasNegativa ? branches.pop()! : null;
            const newBranch = {
              id: uid(),
              label: "",
              color: "#f79f28",
              percentual: 0,
              nodes: [],
              rawData: raw,
            };
            const insertAt = newPriority !== undefined ? newPriority - 1 : branches.length;
            branches.splice(insertAt, 0, newBranch);
            syncBranchOrder(branches, n.rawData);
            if (negativa) branches.push(negativa);
            return { ...n, branches, rawData: branches[0].rawData ?? n.rawData };
          })
        );
        setBranchContext(null);
        setActivePanel("none");
        return;
      }

      // Original behavior: add nested segmentation node inside a non-segmentation branch
      const { branchIdx } = branchContext;
      setSavedNodes((prev) =>
        prev.map((n) => {
          if (n.id !== parentNodeId || !n.branches) return n;
          const branches = n.branches.map((b, bi) => {
            if (bi !== branchIdx) return b;
            return {
              ...b,
              nodes: [...b.nodes, {
                id: uid(),
                data: nodeData,
                panelType: "segmentacao",
                rawData: raw,
                branches: [
                  { id: uid(), label: "Segmentação 1", color: "#f79f28", percentual: 0, nodes: [] },
                  { id: uid(), label: "Negativa", color: "#9ca3af", percentual: 0, nodes: [] },
                ],
              }],
            };
          });
          return { ...n, branches };
        })
      );
      setBranchContext(null);
      setActivePanel("none");
      return;
    }
    if (editingNodeId) {
      // preserve existing branches when editing
      setSavedNodes((prev) =>
        prev.map((n) => {
          if (n.id !== editingNodeId) return n;
          if (newPriority !== undefined && newPriority !== 1 && n.branches) {
            const branches = [...n.branches];
            const negativa = branches[branches.length - 1]?.isNegativa ? branches.pop()! : null;
            branches[0] = { ...branches[0], rawData: raw };
            const [moved] = branches.splice(0, 1);
            branches.splice(newPriority - 1, 0, moved);
            syncBranchOrder(branches, n.rawData);
            if (negativa) branches.push(negativa);
            // node.rawData must reflect the new bi=0 content
            return { ...n, data: nodeData, rawData: branches[0].rawData ?? raw, branches };
          }
          return { ...n, data: nodeData, rawData: raw };
        })
      );
      setActivePanel("none");
      setEditingNodeId(null);
    } else {
      setSavedNodes((prev) => [
        ...prev,
        {
          id: uid(),
          panelType: "segmentacao",
          data: nodeData,
          rawData: raw,
          branches: [
            { id: uid(), label: "Segmentação 1", color: "#f79f28", percentual: 0, nodes: [], rawData: raw },
            // No negativa initially — user adds it via "Adicionar Ramificação" dropdown
          ],
        },
      ]);
      setActivePanel("none");
    }
  };

  const handleAddNegativa = (parentNodeId: string) => {
    setSavedNodes((prev) =>
      prev.map((n) => {
        if (n.id !== parentNodeId || !n.branches) return n;
        if (n.branches.some((b) => b.isNegativa)) return n; // already has negativa
        return {
          ...n,
          branches: [
            ...n.branches,
            { id: uid(), label: "Negativa", color: "#9ca3af", percentual: 0, nodes: [], isNegativa: true },
          ],
        };
      })
    );
  };

  const handleRemoveNegativa = (parentNodeId: string) => {
    setSavedNodes((prev) =>
      prev.map((n) => {
        if (n.id !== parentNodeId || !n.branches) return n;
        return { ...n, branches: n.branches.filter((b) => !b.isNegativa) };
      })
    );
  };

  const autoCollapsed = viewport.zoom <= 0.6;

  const canvasW = canvasRef.current?.clientWidth ?? 1200;
  const canvasH = canvasRef.current?.clientHeight ?? 700;

  /* ── Node positioning (cumulative, respects per-node widths) ── */
  const NODE_START = 500;
  const NODE_GAP = 64;   // space between nodes (for connector line + add button)
  const NODE_WIDTH = 352; // badge(44) - overlap(16) + bar(324) = 352
  const AGUARDAR_WIDTH = 352; // badge(44) - overlap(16) + bar(324) = 352
  const DESISNCREVER_WIDTH = 325; // badge(44) - overlap(16) + bar(297) = 325
  const JORNADA_WIDTH = 352; // badge(44) - overlap(16) + bar(324) = 352
  const TESTA_B_WIDTH = 352; // badge(44) - overlap(16) + bar(324) = 352
  const topTransform = "translateY(-50%) translateY(41px)";
  const totalNodes = savedNodes.length;

  const nodeWidthOf = (node: SavedNode, forBranchNode = false) => {
    if (node.data.type === "aguardar") return AGUARDAR_WIDTH;
    if (node.data.type === "desisncrever") return DESISNCREVER_WIDTH;
    if (node.data.type === "jornadaOutra") return JORNADA_WIDTH;
    if (node.data.type === "testeAB") return TESTA_B_WIDTH;
    if (node.data.type === "segmentacao") return forBranchNode ? SEGMENTACAO_CARD_WIDTH : 0;
    return NODE_WIDTH;
  };

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

  /* ── MiniMap data ── */
  const ENTRADA_X = 24;
  const ENTRADA_W = 352;
  // Nodes sit at top:50% + translateY(-50%) + translateY(41px) → center = canvasH/2 + 41
  const NODE_CY = canvasH / 2 + 41;
  const NODE_MINI_H = 44;
  const minimapNodes: MiniMapNode[] = [
    { id: "entrada", x: ENTRADA_X, y: NODE_CY, width: ENTRADA_W, height: NODE_MINI_H, color: "#10b681" },
    ...savedNodes.map((n, i) => ({
      id: n.id,
      x: nodePositions[i] ?? NODE_START,
      y: NODE_CY,
      width: nodeWidthOf(n),
      height: NODE_MINI_H,
      color: n.data.color ?? "#6b7280",
    })),
  ];

  // Left edge of connector after node idx
  const getConnectorLeft = (idx: number) =>
    getNodeLeft(idx) + nodeWidthOf(savedNodes[idx]);

  // Right edge = start of next node (or pending aguardar position)
  const pendingAguardarLeft = nodePositions.length > 0
    ? nodePositions[nodePositions.length - 1] + nodeWidthOf(savedNodes[savedNodes.length - 1]) + NODE_GAP
    : NODE_START;

  const getConnectorRight = (idx: number) => {
    if (idx + 1 < totalNodes) return getNodeLeft(idx + 1);
    if (pendingAguardar || pendingJornada) return pendingAguardarLeft;
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
          forceCollapsed={autoCollapsed}
        />

        {/* No nodes yet and no pending */}
        {totalNodes === 0 && !pendingAguardar && !pendingJornada && activePanel !== "configurar" && (
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

        {/* Nodes exist OR pending */}
        {(totalNodes > 0 || pendingAguardar || pendingJornada) && (
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
                    forceCollapsed={autoCollapsed}
                    onConfirm={(data) => handleAguardarUpdate(node.id, data)}
                    onCancel={() => {}}
                    onRemove={() => handleRemoveNode(node.id)}
                  />
                ) : node.data.type === "desisncrever" ? (
                  <DesisncreverCardNode
                    style={{ left: `${getNodeLeft(idx)}px` }}
                    onRemove={() => handleRemoveNode(node.id)}
                  />
                ) : node.data.type === "jornadaOutra" ? (
                  <JornadaCardNode
                    initialData={node.data.jornadaData}
                    style={{ left: `${getNodeLeft(idx)}px` }}
                    forceCollapsed={autoCollapsed}
                    onConfirm={(data) => handleJornadaUpdate(node.id, data)}
                    onCancel={() => {}}
                    onRemove={() => handleRemoveNode(node.id)}
                  />
                ) : node.data.type === "testeAB" ? (
                  <TesteABCardNode
                    initialData={node.rawData as TesteABCardNodeData | undefined}
                    style={{ left: `${getNodeLeft(idx)}px` }}
                    forceCollapsed={autoCollapsed}
                    onEdit={() => handleEditNode(node.id)}
                    onRemove={() => handleRemoveNode(node.id)}
                  />
                ) : node.data.type === "segmentacao" ? (
                  // Segmentação: width=0, card is rendered inside Branch 0 below
                  null
                ) : (
                  <GenericNode
                    data={node.data}
                    onEdit={() => handleEditNode(node.id)}
                    style={{ left: `${getNodeLeft(idx)}px` }}
                    forceCollapsed={autoCollapsed}
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
                ) : node.branches ? (
                  // Split node — branches are rendered separately below
                  null
                ) : node.data.type === "desisncrever" ? (
                  // Desisncrever ends the flow — no add button
                  null
                ) : !pendingAguardar && !pendingJornada ? (
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

            {/* Pending jornada node (being configured inline) */}
            {pendingJornada && (
              <JornadaCardNode
                isNew
                style={{ left: `${pendingAguardarLeft}px` }}
                onConfirm={handleJornadaConfirm}
                onCancel={() => setPendingJornada(false)}
                onRemove={() => setPendingJornada(false)}
              />
            )}

            {/* ── Branch rails for split nodes ── */}
            {savedNodes.map((node) => {
              if (!node.branches || node.branches.length === 0) return null;
              const N = node.branches.length;
              const splitIdx = savedNodes.indexOf(node);
              const splitLeft = getNodeLeft(splitIdx);
              const splitW = nodeWidthOf(node);
              const splitRight = splitLeft + splitW;
              const juncX = splitRight + 24;
              const branchStartX = juncX + 40;
              const BSPC = 300;
              const isSegmentacao = node.data.type === "segmentacao";

              // Segmentation: all branches have a card, content starts after card width
              const effectiveBranchStart = isSegmentacao
                ? branchStartX + SEGMENTACAO_CARD_WIDTH + NODE_GAP
                : branchStartX;

              // Last non-negativa branch index
              const lastNonNegBi = isSegmentacao
                ? (node.branches[N - 1]?.isNegativa ? N - 2 : N - 1)
                : -1;
              const hasNegativa = isSegmentacao && Boolean(node.branches[N - 1]?.isNegativa);
              // Button yo: between last seg and negativa (BSPC/2 below last non-neg center),
              // or 150px below if no negativa yet
              const addRamBtnYo = isSegmentacao
                ? lastNonNegBi * BSPC + BSPC / 2
                : 0;

              // Shared center X for segmentation vertical line and button
              const segLineX = branchStartX + Math.floor(SEGMENTACAO_CARD_WIDTH / 2);

              return (
                <div key={`branches-${node.id}`}>
                  {/* Horizontal stub from split node right edge to junction */}
                  <SolidConnector style={{ left: `${splitRight}px`, top: "50%", transform: topTransform, width: `${juncX - splitRight}px` }} />

                  {/* Segmentation vertical lines — always rendered for seg nodes:
                      • Solid: Seg1 → last non-neg seg (only when N > 1 and lastNonNegBi > 0)
                      • Dashed: last non-neg seg → "Adicionar ramificação" button (always)
                      • Solid (if negativa): button → negativa */}
                  {isSegmentacao && (() => {
                    const solidTopHeight = lastNonNegBi * BSPC;
                    const dashedHeight = BSPC / 2;
                    const solidBottomHeight = hasNegativa ? BSPC / 2 : 0;
                    return (
                      <>
                        {solidTopHeight > 0 && (
                          <div style={{ position: "absolute", left: `${segLineX}px`, top: "50%", transform: `translateY(${41}px)`, width: 2, height: solidTopHeight, background: "#9ca3af" }} />
                        )}
                        {/* Dashed: always shown, connects last seg card to the button */}
                        <div style={{ position: "absolute", left: `${segLineX}px`, top: "50%", transform: `translateY(${41 + lastNonNegBi * BSPC}px)`, width: 0, height: dashedHeight, borderLeft: "2px dashed #9ca3af" }} />
                        {solidBottomHeight > 0 && (
                          <div style={{ position: "absolute", left: `${segLineX}px`, top: "50%", transform: `translateY(${41 + addRamBtnYo}px)`, width: 2, height: solidBottomHeight, background: "#9ca3af" }} />
                        )}
                      </>
                    );
                  })()}

                  {/* Vertical bar for non-segmentation (centered as before) */}
                  {!isSegmentacao && N > 1 && (
                    <div style={{
                      position: "absolute",
                      left: `${juncX}px`,
                      top: "50%",
                      transform: `translateY(calc(-50% + 41px))`,
                      width: 2,
                      height: (N - 1) * BSPC,
                      background: "#9ca3af",
                    }} />
                  )}

                  {/* "Adicionar Ramificação" button — centered on the card, with dashed line above it */}
                  {isSegmentacao && (
                    openBranchDropdownKey === `${node.id}-add` ? (
                      <BranchDropdown
                        style={{
                          left: `${segLineX}px`,
                          top: "50%",
                          transform: `translateX(-50%) translateY(calc(-50% + ${41 + addRamBtnYo}px))`,
                        }}
                        onSelect={(type) => {
                          setOpenBranchDropdownKey(null);
                          if (type === "segmentar") {
                            setBranchContext({ parentNodeId: node.id, branchIdx: lastNonNegBi });
                            setActivePanel("segmentacaoConfig");
                          } else {
                            handleAddNegativa(node.id);
                          }
                        }}
                        onClose={() => setOpenBranchDropdownKey(null)}
                      />
                    ) : (
                      <AddNodeButton
                        active={true}
                        label="Adicionar ramificação"
                        onClick={() => setOpenBranchDropdownKey(`${node.id}-add`)}
                        style={{
                          left: `${segLineX}px`,
                          top: "50%",
                          transform: `translateX(-50%) translateY(calc(-50% + ${41 + addRamBtnYo}px))`,
                        }}
                      />
                    )
                  )}

                  {node.branches.map((branch, bi) => {
                    // Segmentation: branch 0 at yo=0 (same Y as main flow), branches 1+ go DOWN
                    // Non-segmentation: centered around 0 (original behavior)
                    const yo = isSegmentacao
                      ? bi * BSPC
                      : (bi - (N - 1) / 2) * BSPC;
                    const branchTransform = `translateY(calc(-50% + ${41 + yo}px))`;
                    const isNegativaBranch = branch.isNegativa === true;

                    // Branch node positions
                    const branchPositions: number[] = [];
                    let bx = effectiveBranchStart;
                    for (const bn of branch.nodes) {
                      branchPositions.push(bx);
                      bx += nodeWidthOf(bn, true) + NODE_GAP;
                    }
                    const lastRight = branch.nodes.length > 0
                      ? branchPositions[branch.nodes.length - 1] + nodeWidthOf(branch.nodes[branch.nodes.length - 1], true)
                      : effectiveBranchStart;

                    // Which rawData to use for the seg card of this branch
                    const segCardData = bi === 0
                      ? (node.rawData as SegmentacaoNoNodeData | undefined)
                      : (branch.rawData as SegmentacaoNoNodeData | undefined);

                    return (
                      <div key={branch.id}>
                        {/* Horizontal stub: for non-segmentation (all branches) and
                            segmentation branch 0 only (main flow connection to Seg Card 1).
                            Branches 1+ of segmentation connect via the vertical bar at branchStartX+14. */}
                        {(!isSegmentacao || bi === 0) && (
                          <div style={{
                            position: "absolute",
                            left: `${juncX + 2}px`,
                            top: "50%",
                            transform: branchTransform,
                            width: branchStartX - juncX - 2,
                            height: 2,
                            background: "#9ca3af",
                          }} />
                        )}

                        {/* Branch label chip (non-segmentation only) */}
                        {!isSegmentacao && (
                          <div style={{
                            position: "absolute",
                            left: `${branchStartX}px`,
                            top: "50%",
                            transform: `translateY(calc(-50% + ${41 + yo - 22}px))`,
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            background: `${branch.color}20`,
                            border: `1px solid ${branch.color}60`,
                            borderRadius: 99,
                            padding: "2px 8px",
                            fontSize: 11,
                            fontWeight: 600,
                            color: "#343b44",
                            whiteSpace: "nowrap",
                            pointerEvents: "none",
                            userSelect: "none",
                          }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: branch.color, flexShrink: 0 }} />
                            {`${branch.label} · ${branch.percentual}%`}
                          </div>
                        )}

                        {/* Segmentation: render card for each branch */}
                        {isSegmentacao && !isNegativaBranch && (
                          <>
                            <SegmentacaoCardNode
                              initialData={segCardData}
                              style={{ left: `${branchStartX}px`, top: "50%", transform: branchTransform }}
                              forceCollapsed={autoCollapsed}
                              priority={bi + 1}
                              onEdit={
                                bi === 0
                                  ? () => handleEditNode(node.id)
                                  : () => { setEditingSegBranch({ parentNodeId: node.id, branchIdx: bi }); setActivePanel("segmentacaoConfig"); }
                              }
                              onRemove={bi === 0 ? () => handleRemoveNode(node.id) : undefined}
                            />
                            {/* Connector from card to first branch node (or add button) */}
                            {branch.nodes.length > 0 || (pendingBranchNode?.parentNodeId === node.id && pendingBranchNode.branchIdx === bi) ? (
                              <SolidConnector style={{
                                left: `${branchStartX + SEGMENTACAO_CARD_WIDTH}px`,
                                top: "50%",
                                transform: branchTransform,
                                width: `${NODE_GAP}px`,
                              }} />
                            ) : (
                              <>
                                <DashedConnector style={{ left: `${branchStartX + SEGMENTACAO_CARD_WIDTH}px`, top: "50%", transform: branchTransform, width: "72px" }} />
                                <AddNodeButton
                                  active={true}
                                  onClick={() => { setBranchContext({ parentNodeId: node.id, branchIdx: bi }); handleOpenAdicionarNo(); }}
                                  style={{ left: `${branchStartX + SEGMENTACAO_CARD_WIDTH + 72}px`, top: "50%", transform: branchTransform }}
                                />
                              </>
                            )}
                          </>
                        )}

                        {/* Negativa card (last branch of segmentation node) */}
                        {isNegativaBranch && (() => {
                          const NEGATIVA_W = SEGMENTACAO_CARD_WIDTH;
                          const BAR_W = NEGATIVA_W - 44 + 16;
                          const negStyle: React.CSSProperties = {
                            position: "absolute",
                            left: `${branchStartX}px`,
                            top: "50%",
                            transform: branchTransform,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                          };
                          return (
                            <div style={negStyle}>
                              {/* Header — badge + bar */}
                              <div style={{ display: "flex", alignItems: "center", position: "relative", zIndex: 2 }}>
                                <div style={{
                                  width: 44, height: 44, background: "#f79f28", borderRadius: 8,
                                  border: "2px solid white", display: "flex", alignItems: "center",
                                  justifyContent: "center", marginRight: -16, zIndex: 2, flexShrink: 0,
                                }}>
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z" />
                                  </svg>
                                </div>
                                <div style={{
                                  width: BAR_W, background: "#f79f28",
                                  borderRadius: autoCollapsed ? 8 : "8px 8px 0 0",
                                  padding: "10px 8px 10px 26px",
                                  display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 1,
                                }}>
                                  <span style={{ fontSize: 16, fontWeight: 600, color: "white", whiteSpace: "nowrap" }}>Negativa</span>
                                  <button
                                    onClick={() => handleRemoveNegativa(node.id)}
                                    style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 8, background: "transparent", border: "none", cursor: "pointer", flexShrink: 0 }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                  >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="3 6 5 6 21 6" />
                                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                      <path d="M10 11v6M14 11v6" />
                                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              {/* Body — hidden when collapsed */}
                              {!autoCollapsed && (
                                <div style={{
                                  width: BAR_W, background: "white",
                                  borderRadius: "0 0 8px 8px", padding: 16, zIndex: 1,
                                  borderLeft: "1px solid #e8eaec", borderRight: "1px solid #e8eaec", borderBottom: "1px solid #e8eaec",
                                }}>
                                  <p style={{ fontSize: 14, color: "#4c535c", lineHeight: 1.5, margin: 0 }}>
                                    Caso o usuário não preencha os requisitos das demais segmentações ele continuará por este caminho
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })()}

                        {/* Branch nodes */}
                        {branch.nodes.map((branchNode, bni) => {
                          const bStyle = { left: `${branchPositions[bni]}px`, top: "50%", transform: branchTransform };
                          const isLast = bni === branch.nodes.length - 1;
                          const hasPending = isLast && pendingBranchNode?.parentNodeId === node.id && pendingBranchNode.branchIdx === bi;
                          return (
                            <div key={branchNode.id}>
                              {branchNode.data.type === "segmentacao" ? (
                                <>
                                  <SegmentacaoCardNode
                                    initialData={branchNode.rawData as SegmentacaoNoNodeData | undefined}
                                    style={bStyle}
                                    forceCollapsed={autoCollapsed}
                                    onEdit={() => handleEditNode(branchNode.id, { parentNodeId: node.id, branchIdx: bi })}
                                    onRemove={() => handleRemoveNode(branchNode.id)}
                                  />
                                  {branchNode.branches && (() => {
                                    const SN = branchNode.branches.length;
                                    const subCardRight = branchPositions[bni] + SEGMENTACAO_CARD_WIDTH;
                                    const subJuncX = subCardRight + 24;
                                    const subBranchStartX = subJuncX + 40;
                                    const SUB_BSPC = 200;
                                    return (
                                      <>
                                        <SolidConnector style={{ left: `${subCardRight}px`, top: "50%", transform: branchTransform, width: "24px" }} />
                                        {SN > 1 && (
                                          <div style={{
                                            position: "absolute",
                                            left: `${subJuncX}px`,
                                            top: "50%",
                                            transform: `translateY(calc(-50% + ${41 + yo}px))`,
                                            width: 2,
                                            height: (SN - 1) * SUB_BSPC,
                                            background: "#9ca3af",
                                          }} />
                                        )}
                                        {branchNode.branches.map((subBranch, sbi) => {
                                          const subYo = (sbi - (SN - 1) / 2) * SUB_BSPC;
                                          const subTransform = `translateY(calc(-50% + ${41 + yo + subYo}px))`;
                                          return (
                                            <div key={subBranch.id}>
                                              <div style={{ position: "absolute", left: `${subJuncX + 2}px`, top: "50%", transform: subTransform, width: subBranchStartX - subJuncX - 2, height: 2, background: "#9ca3af" }} />
                                              <DashedConnector style={{ left: `${subBranchStartX}px`, top: "50%", transform: subTransform, width: "72px" }} />
                                              <AddNodeButton
                                                active={true}
                                                label="Adicionar nó"
                                                style={{ left: `${subBranchStartX + 72}px`, top: "50%", transform: subTransform }}
                                                onClick={() => {
                                                  setBranchContext({ parentNodeId: node.id, branchIdx: bi, nestedNodeId: branchNode.id, subBranchIdx: sbi });
                                                  handleOpenAdicionarNo();
                                                }}
                                              />
                                            </div>
                                          );
                                        })}
                                      </>
                                    );
                                  })()}
                                </>
                              ) : branchNode.data.type === "aguardar" ? (
                                <AguardarCardNode
                                  initialData={branchNode.data.aguardarData}
                                  style={bStyle}
                                  forceCollapsed={autoCollapsed}
                                  onConfirm={(data) => updateBranchInlineNode(node.id, bi, branchNode.id, (n) => ({ ...n, data: { ...n.data, fields: [{ key: "Duração:", value: `${data.quantidade} ${data.unidade}` }], aguardarData: data } }))}
                                  onCancel={() => {}}
                                  onRemove={() => handleRemoveNode(branchNode.id)}
                                />
                              ) : branchNode.data.type === "desisncrever" ? (
                                <DesisncreverCardNode
                                  style={bStyle}
                                  onRemove={() => handleRemoveNode(branchNode.id)}
                                />
                              ) : branchNode.data.type === "jornadaOutra" ? (
                                <JornadaCardNode
                                  initialData={branchNode.data.jornadaData}
                                  style={bStyle}
                                  forceCollapsed={autoCollapsed}
                                  onConfirm={(data) => updateBranchInlineNode(node.id, bi, branchNode.id, (n) => ({ ...n, data: { ...n.data, fields: [{ key: "Redirecionar para:", value: data.jornada }], jornadaData: data } }))}
                                  onCancel={() => {}}
                                  onRemove={() => handleRemoveNode(branchNode.id)}
                                />
                              ) : (
                                <GenericNode
                                  data={branchNode.data}
                                  onEdit={() => handleEditNode(branchNode.id, { parentNodeId: node.id, branchIdx: bi })}
                                  style={bStyle}
                                  forceCollapsed={autoCollapsed}
                                />
                              )}
                              {!isLast ? (
                                <SolidConnector style={{
                                  left: `${branchPositions[bni] + nodeWidthOf(branchNode, true)}px`,
                                  top: "50%",
                                  transform: branchTransform,
                                  width: `${branchPositions[bni + 1] - branchPositions[bni] - nodeWidthOf(branchNode, true)}px`,
                                }} />
                              ) : branchNode.data.type === "desisncrever" ? (
                                null
                              ) : branchNode.data.type === "segmentacao" && branchNode.branches ? (
                                null
                              ) : hasPending ? (
                                <SolidConnector style={{ left: `${lastRight}px`, top: "50%", transform: branchTransform, width: `${NODE_GAP}px` }} />
                              ) : (
                                <>
                                  <DashedConnector style={{ left: `${lastRight}px`, top: "50%", transform: branchTransform, width: "72px" }} />
                                  <AddNodeButton
                                    active={true}
                                    onClick={() => { setBranchContext({ parentNodeId: node.id, branchIdx: bi }); handleOpenAdicionarNo(); }}
                                    style={{ left: `${lastRight + 72}px`, top: "50%", transform: branchTransform }}
                                  />
                                </>
                              )}
                            </div>
                          );
                        })}

                        {/* Pending inline node (aguardar / jornada) in this branch */}
                        {(() => {
                          const pbn = pendingBranchNode;
                          if (!pbn || pbn.parentNodeId !== node.id || pbn.branchIdx !== bi) return null;
                          const pendingLeft = branch.nodes.length > 0 ? lastRight + NODE_GAP : effectiveBranchStart;
                          const pStyle = { left: `${pendingLeft}px`, top: "50%", transform: branchTransform };
                          return pbn.type === "aguardar" ? (
                            <AguardarCardNode
                              isNew
                              style={pStyle}
                              onConfirm={(data) => handleBranchAguardarConfirm(node.id, bi, data, pbn.nestedNodeId, pbn.subBranchIdx)}
                              onCancel={() => setPendingBranchNode(null)}
                              onRemove={() => setPendingBranchNode(null)}
                            />
                          ) : (
                            <JornadaCardNode
                              isNew
                              style={pStyle}
                              onConfirm={(data) => handleBranchJornadaConfirm(node.id, bi, data, pbn.nestedNodeId, pbn.subBranchIdx)}
                              onCancel={() => setPendingBranchNode(null)}
                              onRemove={() => setPendingBranchNode(null)}
                            />
                          );
                        })()}

                        {/* Empty non-segmentation branch — show add button */}
                        {!isSegmentacao && branch.nodes.length === 0 && !pendingBranchNode && (
                          <>
                            <DashedConnector style={{ left: `${branchStartX}px`, top: "50%", transform: branchTransform, width: "72px" }} />
                            <AddNodeButton
                              active={true}
                              label="Adicionar nó"
                              onClick={() => { setBranchContext({ parentNodeId: node.id, branchIdx: bi }); handleOpenAdicionarNo(); }}
                              style={{ left: `${branchStartX + 72}px`, top: "50%", transform: branchTransform }}
                            />
                          </>
                        )}
                        {/* Empty non-segmentation branch with pending — solid connector */}
                        {!isSegmentacao && branch.nodes.length === 0 && pendingBranchNode?.parentNodeId === node.id && pendingBranchNode.branchIdx === bi && (
                          <SolidConnector style={{ left: `${branchStartX - NODE_GAP}px`, top: "50%", transform: branchTransform, width: `${NODE_GAP}px` }} />
                        )}

                        {/* Negativa branch: empty state — show add button to the right of negativa card */}
                        {isNegativaBranch && branch.nodes.length === 0 && !pendingBranchNode && (
                          <>
                            <DashedConnector style={{ left: `${branchStartX + SEGMENTACAO_CARD_WIDTH}px`, top: "50%", transform: branchTransform, width: "72px" }} />
                            <AddNodeButton
                              active={true}
                              onClick={() => { setBranchContext({ parentNodeId: node.id, branchIdx: bi }); handleOpenAdicionarNo(); }}
                              style={{ left: `${branchStartX + SEGMENTACAO_CARD_WIDTH + 72}px`, top: "50%", transform: branchTransform }}
                            />
                          </>
                        )}
                        {isNegativaBranch && branch.nodes.length === 0 && pendingBranchNode?.parentNodeId === node.id && pendingBranchNode.branchIdx === bi && (
                          <SolidConnector style={{ left: `${branchStartX + SEGMENTACAO_CARD_WIDTH}px`, top: "50%", transform: branchTransform, width: `${NODE_GAP}px` }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
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
        <EnvioEmailPanel onClose={handleClosePanel} onAdd={handleEmailAdd} onRemove={removeHandler} initialData={editingNode?.rawData as EmailNodeData | undefined} />
      )}
      {activePanel === "smsConfig" && (
        <SmsPanel
          onClose={handleClosePanel}
          onAdd={handleSmsAdd}
          onRemove={removeHandler}
          initialData={editingNode?.rawData as SmsNodeData | undefined}
        />
      )}
      {activePanel === "whatsappConfig" && (
        <WhatsAppPanel
          onClose={handleClosePanel}
          onAdd={handleWhatsAppAdd}
          onRemove={removeHandler}
          initialData={editingNode?.rawData as WhatsAppNodeData | undefined}
        />
      )}
      {activePanel === "mobilePushConfig" && (
        <MobilePushPanel
          onClose={handleClosePanel}
          onAdd={handleMobilePushAdd}
          onRemove={removeHandler}
          initialData={editingNode?.rawData as MobilePushNodeData | undefined}
        />
      )}
      {activePanel === "webPushConfig" && (
        <WebPushPanel
          onClose={handleClosePanel}
          onAdd={handleWebPushAdd}
          onRemove={removeHandler}
          initialData={editingNode?.rawData as WebPushNodeData | undefined}
        />
      )}
      {activePanel === "edicaoConfig" && (
        <EdicaoPropriedadePanel onClose={handleClosePanel} onAdd={handleEdicaoAdd} onRemove={removeHandler} initialData={editingNode?.rawData as EdicaoPropriedadeNodeData | undefined} />
      )}
      {activePanel === "webhooksConfig" && (
        <WebhooksPanel onClose={handleClosePanel} onAdd={handleWebhooksAdd} onRemove={removeHandler} initialData={editingNode?.rawData as WebhooksNodeData | undefined} />
      )}
      {activePanel === "segmentacaoConfig" && (() => {
        const segPanelParentNode = editingSegBranch
          ? savedNodes.find((n) => n.id === editingSegBranch.parentNodeId)
          : (editingNodeId && !branchContext)
            ? savedNodes.find((n) => n.id === editingNodeId)
            : (branchContext && !editingNodeId)
              ? savedNodes.find((n) => n.id === branchContext.parentNodeId)
              : null;
        const segNonNegBranches = segPanelParentNode?.branches?.filter((b) => !b.isNegativa) ?? [];
        const isCreating = !editingSegBranch && !editingNodeId;
        const segPanelSegCount = isCreating
          ? (segNonNegBranches.length > 0 ? segNonNegBranches.length + 1 : 1)
          : segNonNegBranches.length;
        const segPanelCurrentPriority = editingSegBranch
          ? editingSegBranch.branchIdx + 1
          : editingNodeId
            ? 1
            : segPanelSegCount;
        return (
          <SegmentacaoNoPanel
            onClose={handleClosePanel}
            onAdd={handleSegmentacaoAdd}
            onRemove={removeHandler}
            segCount={segPanelSegCount}
            currentPriority={segPanelCurrentPriority}
            initialData={
              editingSegBranch
                ? (savedNodes.find((n) => n.id === editingSegBranch.parentNodeId)
                    ?.branches?.[editingSegBranch.branchIdx]?.rawData as SegmentacaoNoNodeData | undefined)
                : (editingNode?.rawData as SegmentacaoNoNodeData | undefined)
            }
          />
        );
      })()}
      {activePanel === "testeABConfig" && (
        <TesteABPanel onClose={handleClosePanel} onAdd={handleTesteABAdd} onRemove={removeHandler} initialData={editingNode?.rawData as TesteABCardNodeData | undefined} />
      )}

      {/* ── Zoom control (outside transform) ── */}
      <ZoomControl
        zoom={Math.round(viewport.zoom * 100)}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />

      {/* ── MiniMap ── */}
      <MiniMap
        nodes={minimapNodes}
        viewport={viewport}
        canvasWidth={canvasW}
        canvasHeight={canvasH}
        onPanTo={handlePanTo}
      />
    </div>
  );
}
