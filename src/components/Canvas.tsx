"use client";

import {
  useState, useRef, useEffect, useCallback, useContext,
} from "react";
import {
  ReactFlow, ReactFlowProvider,
  useNodesState, useEdgesState,
  useReactFlow, useViewport,
  Background, BackgroundVariant,
  MiniMap, type NodeMouseHandler,
  type Node, type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import JourneyNameCard from "./JourneyNameCard";
import ActionButtons from "./ActionButtons";
import ZoomControl from "./ZoomControl";
import ConfigurarEntradaPanel from "./ConfigurarEntradaPanel";
import AdicionarNoPanel from "./AdicionarNoPanel";

import EnvioEmailPanel from "./EnvioEmailPanel";
import type { EmailNodeData } from "./EnvioEmailPanel";
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
import SegmentacaoNoPanel from "./SegmentacaoNoPanel";
import type { SegmentacaoNoNodeData } from "./SegmentacaoNoPanel";
import TesteABPanel from "./TesteABPanel";
import type { TesteABCardNodeData } from "./TesteABCardNode";

import { NODE_COLORS, NODE_LABELS, NodeIconImg } from "@/lib/nodeConfig";
import type { GenericNodeData } from "./GenericNode";
import type { AguardarNodeData } from "./AguardarCardNode";
import type { JornadaCardNodeData } from "./JornadaCardNode";

import { CanvasCtx } from "./CanvasContext";
import {
  buildFlowGraph,
  type SavedNode, type BranchChain, type PendingBranchNodeState,
} from "../lib/flowUtils";

// Custom node types
import FlowEntradaNode from "./nodes/FlowEntradaNode";
import FlowGenericNode from "./nodes/FlowGenericNode";
import FlowAguardarNode from "./nodes/FlowAguardarNode";
import FlowSegmentacaoNode from "./nodes/FlowSegmentacaoNode";
import FlowTesteABNode from "./nodes/FlowTesteABNode";
import FlowDesisncreverNode from "./nodes/FlowDesisncreverNode";
import FlowJornadaNode from "./nodes/FlowJornadaNode";
import FlowBranchLabelNode from "./nodes/FlowBranchLabelNode";
import FlowNegativaNode from "./nodes/FlowNegativaNode";
import FlowAddBtnNode from "./nodes/FlowAddBtnNode";
import FlowEdge from "./edges/FlowEdge";

/* ── Node/Edge type maps (stable references, defined outside component) ── */
const nodeTypes = {
  entradaNode: FlowEntradaNode,
  genericNode: FlowGenericNode,
  aguardarNode: FlowAguardarNode,
  segmentacaoNode: FlowSegmentacaoNode,
  testeABNode: FlowTesteABNode,
  desisncreverNode: FlowDesisncreverNode,
  jornadaNode: FlowJornadaNode,
  branchLabelNode: FlowBranchLabelNode,
  negativaNode: FlowNegativaNode,
  addBtnNode: FlowAddBtnNode,
} as const;

const edgeTypes = { flowEdge: FlowEdge } as const;

/* ── Panel type ── */
type ActivePanel =
  | "none" | "configurar" | "adicionarNo"
  | "emailConfig" | "smsConfig" | "whatsappConfig"
  | "mobilePushConfig" | "webPushConfig" | "edicaoConfig"
  | "webhooksConfig" | "segmentacaoConfig" | "testeABConfig";

/* ── UID ── */
let _idCounter = 0;
function uid(): string {
  return `node-${Date.now()}-${++_idCounter}`;
}

const nodeColors = NODE_COLORS;
const nodeLabels = NODE_LABELS;
const nodeIcon = (type: string): React.ReactNode => <NodeIconImg type={type} />;

/* ════════════════════════════════════════════════════════════════
   Inner canvas (inside ReactFlowProvider — can use RF hooks)
════════════════════════════════════════════════════════════════ */
function FlowCanvas() {
  const ctx = useContext(CanvasCtx)!;
  const { zoomIn, zoomOut } = useReactFlow();
  const { zoom } = useViewport();

  const [rfNodes, setRfNodes, onNodesChange] = useNodesState<Node>([]);
  const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState<Edge>([]);

  /* Positions ref — loaded from localStorage, updated on drag */
  const posRef = useRef<Record<string, { x: number; y: number }>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem("flow-node-positions");
      if (saved) posRef.current = JSON.parse(saved);
    } catch {}
  }, []);

  /* Rebuild RF graph whenever flow structure changes */
  useEffect(() => {
    const { nodes, edges } = buildFlowGraph({
      savedNodes: ctx.savedNodes,
      savedSegmentacao: ctx.savedSegmentacao,
      pendingAguardar: ctx.pendingAguardar,
      pendingJornada: ctx.pendingJornada,
      pendingBranchNode: ctx.pendingBranchNode,
      nodePositions: posRef.current,
    });
    setRfNodes(nodes);
    setRfEdges(edges);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    ctx.savedNodes,
    ctx.savedSegmentacao,
    ctx.pendingAguardar,
    ctx.pendingJornada,
    ctx.pendingBranchNode,
  ]);

  /* Persist dragged positions to localStorage without triggering a full rebuild */
  const onNodeDragStop: NodeMouseHandler = useCallback((_evt, node) => {
    posRef.current = { ...posRef.current, [node.id]: { x: node.position.x, y: node.position.y } };
    try {
      localStorage.setItem("flow-node-positions", JSON.stringify(posRef.current));
    } catch {}
  }, []);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodesConnectable={false}
        deleteKeyCode={null}
        minZoom={0.25}
        maxZoom={3}
        defaultViewport={{ x: 0, y: 200, zoom: 1 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="#c8cdd3"
          style={{ backgroundColor: "#f0f2f4" }}
        />
        <MiniMap
          position="bottom-right"
          style={{ marginBottom: 0, marginRight: 0 }}
          nodeColor={(n) => {
            const color = (n.data as { nodeData?: GenericNodeData; rawData?: unknown })?.nodeData?.color;
            if (color) return color as string;
            if (n.type === "entradaNode") return "#10b681";
            if (n.type === "segmentacaoNode") return "#f79f28";
            if (n.type === "negativaNode") return "#f79f28";
            if (n.type === "testeABNode") return "#fb7185";
            return "#6b7280";
          }}
          pannable
          zoomable
        />
      </ReactFlow>
      <ZoomControl
        zoom={Math.round(zoom * 100)}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   Main Canvas (state + handlers + panels)
════════════════════════════════════════════════════════════════ */
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
  const [pendingBranchNode, setPendingBranchNode] = useState<PendingBranchNodeState | null>(null);
  const [editingSegBranch, setEditingSegBranch] = useState<{ parentNodeId: string; branchIdx: number } | null>(null);

  /* ── Panel helpers ── */
  const handleClosePanel = useCallback(() => {
    setActivePanel("none");
    setEditingNodeId(null);
    setBranchContext(null);
    setEditingSegBranch(null);
  }, []);

  const handleOpenConfigurar = useCallback(() => setActivePanel("configurar"), []);

  const handleOpenAdicionarNo = useCallback(() => {
    setEditingNodeId(null);
    setActivePanel("adicionarNo");
  }, []);

  const handleOpenAdicionarNoBranch = useCallback((
    parentNodeId: string,
    branchIdx: number,
    nestedNodeId?: string,
    subBranchIdx?: number,
  ) => {
    setBranchContext({ parentNodeId, branchIdx, nestedNodeId, subBranchIdx });
    setEditingNodeId(null);
    setActivePanel("adicionarNo");
  }, []);

  /* ── Derived editing node ── */
  const editingNode = editingNodeId
    ? branchContext
      ? savedNodes
          .find((n) => n.id === branchContext.parentNodeId)
          ?.branches?.[branchContext.branchIdx]?.nodes.find((bn) => bn.id === editingNodeId) ?? null
      : savedNodes.find((n) => n.id === editingNodeId) ?? null
    : null;

  const removeHandler = editingNodeId
    ? () => { handleRemoveNode(editingNodeId); handleClosePanel(); }
    : undefined;

  const segRemoveHandler = editingSegBranch
    ? () => {
        const { parentNodeId, branchIdx } = editingSegBranch;
        setSavedNodes((prev) =>
          prev.map((n) => {
            if (n.id !== parentNodeId || !n.branches) return n;
            const branches = n.branches.filter((_, i) => i !== branchIdx);
            const negativa = branches[branches.length - 1]?.isNegativa ? branches.pop()! : null;
            branches.forEach((b, i) => { b.label = `Segmentação ${i + 1}`; });
            if (negativa) branches.push(negativa);
            return { ...n, branches, rawData: branches[0]?.rawData ?? n.rawData };
          })
        );
        handleClosePanel();
      }
    : removeHandler;

  /* ── handleEditNode ── */
  const handleEditNode = useCallback((
    nodeId: string,
    ctx?: { parentNodeId: string; branchIdx: number },
  ) => {
    if (ctx) setBranchContext(ctx);
    const node = ctx
      ? savedNodes.find((n) => n.id === ctx.parentNodeId)?.branches?.[ctx.branchIdx]?.nodes.find((bn) => bn.id === nodeId)
      : savedNodes.find((n) => n.id === nodeId);
    if (!node) return;
    setEditingNodeId(nodeId);
    handleNodeSelect(node.panelType);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedNodes]);

  const handleEditSegBranch = useCallback((parentNodeId: string, branchIdx: number) => {
    setEditingSegBranch({ parentNodeId, branchIdx });
    setActivePanel("segmentacaoConfig");
  }, []);

  /* ── Node type → panel ── */
  function handleNodeSelect(type: string) {
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
        id: uid(), panelType: "desisncrever",
        data: { type: "desisncrever", color: nodeColors.desisncrever, icon: nodeIcon("desisncrever"), label: nodeLabels.desisncrever, fields: [] },
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
      email: "emailConfig", sms: "smsConfig", whatsapp: "whatsappConfig",
      mobilePush: "mobilePushConfig", webPush: "webPushConfig",
      edicaoProp: "edicaoConfig", webhooks: "webhooksConfig",
      segmentacao: "segmentacaoConfig", testeAB: "testeABConfig",
    };
    const panel = panelMap[type];
    if (panel) setActivePanel(panel);
  }

  /* ── pushOrUpdateNode ── */
  function pushOrUpdateNode(data: GenericNodeData, panelType: string, rawData?: unknown) {
    if (branchContext) {
      const { parentNodeId, branchIdx, nestedNodeId, subBranchIdx } = branchContext;
      setSavedNodes((prev) =>
        prev.map((n) => {
          if (n.id !== parentNodeId || !n.branches) return n;
          const branches = n.branches.map((b, bi) => {
            if (bi !== branchIdx) return b;
            if (nestedNodeId !== undefined && subBranchIdx !== undefined) {
              return {
                ...b,
                nodes: b.nodes.map((bn) => {
                  if (bn.id !== nestedNodeId || !bn.branches) return bn;
                  const subBranches = bn.branches.map((sb, sbi) =>
                    sbi === subBranchIdx ? { ...sb, nodes: [...sb.nodes, { id: uid(), data, panelType, rawData }] } : sb,
                  );
                  return { ...bn, branches: subBranches };
                }),
              };
            }
            if (editingNodeId) {
              return { ...b, nodes: b.nodes.map((bn) => bn.id === editingNodeId ? { ...bn, data, panelType, rawData } : bn) };
            }
            return { ...b, nodes: [...b.nodes, { id: uid(), data, panelType, rawData }] };
          });
          return { ...n, branches };
        })
      );
      setBranchContext(null);
    } else if (editingNodeId) {
      setSavedNodes((prev) => prev.map((n) => n.id === editingNodeId ? { ...n, data, panelType, rawData } : n));
    } else {
      setSavedNodes((prev) => [...prev, { id: uid(), data, panelType, rawData }]);
    }
    setActivePanel("none");
    setEditingNodeId(null);
  }

  /* ── Panel add handlers ── */
  const handleEmailAdd = (raw: EmailNodeData) => pushOrUpdateNode({ type: "email", color: nodeColors.email, icon: nodeIcon("email"), label: nodeLabels.email, fields: [{ key: "Tipo de Mensagem:", value: raw.tipoMensagem === "unica" ? "Mensagem única" : "Teste A/B" }] }, "email", raw);
  const handleSmsAdd = (raw: SmsNodeData) => pushOrUpdateNode({ type: "sms", color: nodeColors.sms, icon: nodeIcon("sms"), label: nodeLabels.sms, fields: [{ key: "Nome:", value: raw.nome || "—" }, { key: "Tipo:", value: raw.tipoMensagem === "unica" ? "Mensagem única" : "Teste A/B" }] }, "sms", raw);
  const handleWhatsAppAdd = (raw: WhatsAppNodeData) => pushOrUpdateNode({ type: "whatsapp", color: nodeColors.whatsapp, icon: nodeIcon("whatsapp"), label: nodeLabels.whatsapp, fields: [{ key: "Nome:", value: raw.nome || "—" }, { key: "Tipo:", value: raw.tipoMensagem === "unica" ? "Mensagem única" : "Teste A/B" }] }, "whatsapp", raw);
  const handleMobilePushAdd = (raw: MobilePushNodeData) => pushOrUpdateNode({ type: "mobilePush", color: nodeColors.mobilePush, icon: nodeIcon("mobilePush"), label: nodeLabels.mobilePush, fields: [{ key: "Nome:", value: raw.nome || "—" }, { key: "Tipo:", value: raw.tipoMensagem === "unica" ? "Mensagem única" : "Teste A/B" }] }, "mobilePush", raw);
  const handleWebPushAdd = (raw: WebPushNodeData) => pushOrUpdateNode({ type: "webPush", color: nodeColors.webPush, icon: nodeIcon("webPush"), label: nodeLabels.webPush, fields: [{ key: "Nome:", value: raw.nome || "—" }, { key: "Tipo:", value: raw.tipoMensagem === "unica" ? "Mensagem única" : "Teste A/B" }] }, "webPush", raw);
  const handleEdicaoAdd = (raw: EdicaoPropriedadeNodeData) => pushOrUpdateNode({ type: "edicaoProp", color: nodeColors.edicaoProp, icon: nodeIcon("edicaoProp"), label: nodeLabels.edicaoProp, fields: [{ key: "Propriedade:", value: raw.nome || "—" }] }, "edicaoProp", raw);
  const handleWebhooksAdd = (raw: WebhooksNodeData) => pushOrUpdateNode({ type: "webhooks", color: nodeColors.webhooks, icon: nodeIcon("webhooks"), label: nodeLabels.webhooks, fields: [{ key: "Nome:", value: raw.nome || "—" }, { key: "Método:", value: raw.metodo }] }, "webhooks", raw);

  /* ── Aguardar ── */
  const handleAguardarConfirm = (raw: AguardarNodeData) => {
    setSavedNodes((prev) => [...prev, { id: uid(), panelType: "aguardar", data: { type: "aguardar", color: nodeColors.aguardar, icon: nodeIcon("aguardar"), label: nodeLabels.aguardar, fields: [{ key: "Duração:", value: `${raw.quantidade} ${raw.unidade}` }], aguardarData: raw } }]);
    setPendingAguardar(false);
  };
  const handleAguardarUpdate = (nodeId: string, raw: AguardarNodeData) => {
    setSavedNodes((prev) => prev.map((n) => n.id === nodeId ? { ...n, data: { ...n.data, fields: [{ key: "Duração:", value: `${raw.quantidade} ${raw.unidade}` }], aguardarData: raw } } : n));
  };
  const handleAguardarCancel = () => setPendingAguardar(false);

  /* ── Jornada ── */
  const handleJornadaConfirm = (raw: JornadaCardNodeData) => {
    setSavedNodes((prev) => [...prev, { id: uid(), panelType: "jornadaOutra", data: { type: "jornadaOutra", color: nodeColors.jornadaOutra, icon: nodeIcon("jornadaOutra"), label: nodeLabels.jornadaOutra, fields: [{ key: "Redirecionar para:", value: raw.jornada }], jornadaData: raw } }]);
    setPendingJornada(false);
  };
  const handleJornadaUpdate = (nodeId: string, raw: JornadaCardNodeData) => {
    setSavedNodes((prev) => prev.map((n) => n.id === nodeId ? { ...n, data: { ...n.data, fields: [{ key: "Redirecionar para:", value: raw.jornada }], jornadaData: raw } } : n));
  };
  const handleJornadaCancel = () => setPendingJornada(false);

  /* ── Branch inline helpers ── */
  const addBranchInlineNode = (parentNodeId: string, branchIdx: number, node: SavedNode, nestedNodeId?: string, subBranchIdx?: number) => {
    setSavedNodes((prev) => prev.map((n) => {
      if (n.id !== parentNodeId || !n.branches) return n;
      return {
        ...n, branches: n.branches.map((b, bi) => {
          if (bi !== branchIdx) return b;
          if (nestedNodeId !== undefined && subBranchIdx !== undefined) {
            return { ...b, nodes: b.nodes.map((bn) => { if (bn.id !== nestedNodeId || !bn.branches) return bn; return { ...bn, branches: bn.branches.map((sb, sbi) => sbi === subBranchIdx ? { ...sb, nodes: [...sb.nodes, node] } : sb) }; }) };
          }
          return { ...b, nodes: [...b.nodes, node] };
        }),
      };
    }));
    setPendingBranchNode(null);
  };

  const handleBranchAguardarConfirm = (parentNodeId: string, branchIdx: number, raw: AguardarNodeData, nestedNodeId?: string, subBranchIdx?: number) => {
    addBranchInlineNode(parentNodeId, branchIdx, { id: uid(), panelType: "aguardar", data: { type: "aguardar", color: nodeColors.aguardar, icon: nodeIcon("aguardar"), label: nodeLabels.aguardar, fields: [{ key: "Duração:", value: `${raw.quantidade} ${raw.unidade}` }], aguardarData: raw } }, nestedNodeId, subBranchIdx);
  };
  const handleBranchJornadaConfirm = (parentNodeId: string, branchIdx: number, raw: JornadaCardNodeData, nestedNodeId?: string, subBranchIdx?: number) => {
    addBranchInlineNode(parentNodeId, branchIdx, { id: uid(), panelType: "jornadaOutra", data: { type: "jornadaOutra", color: nodeColors.jornadaOutra, icon: nodeIcon("jornadaOutra"), label: nodeLabels.jornadaOutra, fields: [{ key: "Redirecionar para:", value: raw.jornada }], jornadaData: raw } }, nestedNodeId, subBranchIdx);
  };
  const handleBranchInlineUpdate = (parentNodeId: string, branchIdx: number, nodeId: string, updater: (n: SavedNode) => SavedNode) => {
    setSavedNodes((prev) => prev.map((n) => {
      if (n.id !== parentNodeId || !n.branches) return n;
      return { ...n, branches: n.branches.map((b, bi) => bi === branchIdx ? { ...b, nodes: b.nodes.map((bn) => bn.id === nodeId ? updater(bn) : bn) } : b) };
    }));
  };

  /* ── Remove node ── */
  const handleRemoveNode = useCallback((nodeId: string) => {
    setSavedNodes((prev) => {
      if (prev.some((n) => n.id === nodeId)) return prev.filter((n) => n.id !== nodeId);
      return prev.map((n) => {
        if (!n.branches) return n;
        return { ...n, branches: n.branches.map((b) => ({ ...b, nodes: b.nodes.filter((bn) => bn.id !== nodeId) })) };
      });
    });
  }, []);

  /* ── Negativa ── */
  const handleAddNegativa = (parentNodeId: string) => {
    setSavedNodes((prev) => prev.map((n) => {
      if (n.id !== parentNodeId || !n.branches) return n;
      if (n.branches.some((b) => b.isNegativa)) return n;
      return { ...n, branches: [...n.branches, { id: uid(), label: "Negativa", color: "#9ca3af", percentual: 0, nodes: [], isNegativa: true }] };
    }));
  };
  const handleRemoveNegativa = (parentNodeId: string) => {
    setSavedNodes((prev) => prev.map((n) => {
      if (n.id !== parentNodeId || !n.branches) return n;
      return { ...n, branches: n.branches.filter((b) => !b.isNegativa) };
    }));
  };

  /* ── Select branch type (from AddBranchNode dropdown) ── */
  const handleSelectBranchType = (parentNodeId: string, type: "segmentar" | "nao-atende", lastNonNegBi: number) => {
    if (type === "segmentar") {
      setBranchContext({ parentNodeId, branchIdx: lastNonNegBi });
      setActivePanel("segmentacaoConfig");
    } else {
      handleAddNegativa(parentNodeId);
    }
  };

  /* ── Segmentação add ── */
  const handleSegmentacaoAdd = (raw: SegmentacaoNoNodeData) => {
    const newPriority = raw.prioridade;
    const syncBranchOrder = (branches: BranchChain[], fallback?: unknown) => {
      branches.forEach((b, i) => {
        b.label = `Segmentação ${i + 1}`;
        const rd = (b.rawData ?? fallback) as SegmentacaoNoNodeData | undefined;
        if (rd) b.rawData = { ...rd, prioridade: i + 1 };
      });
    };

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
          return { ...n, branches, rawData: branches[0].rawData ?? n.rawData };
        })
      );
      setEditingSegBranch(null);
      setActivePanel("none");
      return;
    }

    const nodeData: GenericNodeData = { type: "segmentacao", color: nodeColors.segmentacao, icon: nodeIcon("segmentacao"), label: nodeLabels.segmentacao, fields: [{ key: "Segmentação:", value: raw.segmentacao || "—" }] };

    if (branchContext) {
      const { parentNodeId, branchIdx } = branchContext;
      const parentNode = savedNodes.find((n) => n.id === parentNodeId);

      if (parentNode?.data.type === "segmentacao" && parentNode.branches) {
        setSavedNodes((prev) =>
          prev.map((n) => {
            if (n.id !== parentNodeId || !n.branches) return n;
            const branches = [...n.branches];
            const hasNegativa = branches[branches.length - 1]?.isNegativa;
            const negativa = hasNegativa ? branches.pop()! : null;
            const newBranch = { id: uid(), label: "", color: "#f79f28", percentual: 0, nodes: [], rawData: raw };
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

      setSavedNodes((prev) =>
        prev.map((n) => {
          if (n.id !== parentNodeId || !n.branches) return n;
          return {
            ...n, branches: n.branches.map((b, bi) => {
              if (bi !== branchIdx) return b;
              return { ...b, nodes: [...b.nodes, { id: uid(), data: nodeData, panelType: "segmentacao", rawData: raw, branches: [{ id: uid(), label: "Segmentação 1", color: "#f79f28", percentual: 0, nodes: [] }, { id: uid(), label: "Negativa", color: "#9ca3af", percentual: 0, nodes: [] }] }] };
            }),
          };
        })
      );
      setBranchContext(null);
      setActivePanel("none");
      return;
    }

    if (editingNodeId) {
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
            return { ...n, data: nodeData, rawData: branches[0].rawData ?? raw, branches };
          }
          return { ...n, data: nodeData, rawData: raw };
        })
      );
      setActivePanel("none");
      setEditingNodeId(null);
    } else {
      setSavedNodes((prev) => [...prev, { id: uid(), panelType: "segmentacao", data: nodeData, rawData: raw, branches: [{ id: uid(), label: "Segmentação 1", color: "#f79f28", percentual: 0, nodes: [], rawData: raw }] }]);
      setActivePanel("none");
    }
  };

  /* ── Teste A/B add ── */
  const handleTesteABAdd = (raw: TesteABCardNodeData) => {
    const nodeData: GenericNodeData = { type: "testeAB", color: nodeColors.testeAB, icon: nodeIcon("testeAB"), label: nodeLabels.testeAB, fields: [{ key: "Variantes:", value: `${raw.variantes.length} variantes` }] };
    if (editingNodeId) {
      setSavedNodes((prev) =>
        prev.map((n) => {
          if (n.id !== editingNodeId) return n;
          const existing = n.branches ?? [];
          const branches = raw.variantes.map((v, i) => ({ id: existing[i]?.id ?? uid(), label: v.label, color: v.color, percentual: v.percentual, nodes: existing[i]?.nodes ?? [] }));
          return { ...n, data: nodeData, rawData: raw, branches };
        })
      );
      setActivePanel("none");
      setEditingNodeId(null);
    } else {
      setSavedNodes((prev) => [...prev, { id: uid(), panelType: "testeAB", data: nodeData, rawData: raw, branches: raw.variantes.map((v) => ({ id: uid(), label: v.label, color: v.color, percentual: v.percentual, nodes: [] })) }]);
      setActivePanel("none");
    }
  };

  /* ── Segmentação panel helpers ── */
  const segPanelParentNode = editingSegBranch
    ? savedNodes.find((n) => n.id === editingSegBranch.parentNodeId)
    : editingNodeId && !branchContext
      ? savedNodes.find((n) => n.id === editingNodeId)
      : branchContext && !editingNodeId
        ? savedNodes.find((n) => n.id === branchContext.parentNodeId)
        : null;
  const segNonNegBranches = segPanelParentNode?.branches?.filter((b) => !b.isNegativa) ?? [];
  const isCreatingSeg = !editingSegBranch && !editingNodeId;
  const segPanelSegCount = isCreatingSeg ? (segNonNegBranches.length > 0 ? segNonNegBranches.length + 1 : 1) : segNonNegBranches.length;
  const segPanelCurrentPriority = editingSegBranch ? editingSegBranch.branchIdx + 1 : editingNodeId ? 1 : segPanelSegCount;

  /* ── Context value ── */
  const ctxValue = {
    savedNodes,
    savedSegmentacao,
    pendingAguardar,
    pendingJornada,
    pendingBranchNode,
    onConfigure: handleOpenConfigurar,
    onOpenAdicionarNo: handleOpenAdicionarNo,
    onOpenAdicionarNoBranch: handleOpenAdicionarNoBranch,
    onEditNode: handleEditNode,
    onEditSegBranch: handleEditSegBranch,
    onRemoveNode: handleRemoveNode,
    onAguardarUpdate: handleAguardarUpdate,
    onAguardarConfirm: handleAguardarConfirm,
    onAguardarCancel: handleAguardarCancel,
    onJornadaUpdate: handleJornadaUpdate,
    onJornadaConfirm: handleJornadaConfirm,
    onJornadaCancel: handleJornadaCancel,
    onRemoveNegativa: handleRemoveNegativa,
    onAddNegativa: handleAddNegativa,
    onSelectBranchType: handleSelectBranchType,
    onBranchAguardarConfirm: handleBranchAguardarConfirm,
    onBranchJornadaConfirm: handleBranchJornadaConfirm,
    onBranchInlineUpdate: handleBranchInlineUpdate,
    onPendingBranchCancel: () => setPendingBranchNode(null),
  };

  return (
    <ReactFlowProvider>
      <CanvasCtx.Provider value={ctxValue}>
        <div className="relative flex-1 overflow-hidden select-none">
          {/* Top bar */}
          <div className="absolute top-[24px] left-[24px] right-[24px] flex items-start justify-between z-10 pointer-events-auto">
            <JourneyNameCard />
            <ActionButtons />
          </div>

          {/* React Flow canvas */}
          <FlowCanvas />

          {/* ── Panels ── */}
          {activePanel === "configurar" && (
            <ConfigurarEntradaPanel initialSegmentacao={savedSegmentacao} onClose={handleClosePanel} onAdd={(seg) => { setSavedSegmentacao(seg); setActivePanel("none"); }} />
          )}
          {activePanel === "adicionarNo" && (
            <AdicionarNoPanel onClose={handleClosePanel} onNodeSelect={handleNodeSelect} />
          )}
          {activePanel === "emailConfig" && (
            <EnvioEmailPanel onClose={handleClosePanel} onAdd={handleEmailAdd} onRemove={removeHandler} initialData={editingNode?.rawData as EmailNodeData | undefined} />
          )}
          {activePanel === "smsConfig" && (
            <SmsPanel onClose={handleClosePanel} onAdd={handleSmsAdd} onRemove={removeHandler} initialData={editingNode?.rawData as SmsNodeData | undefined} />
          )}
          {activePanel === "whatsappConfig" && (
            <WhatsAppPanel onClose={handleClosePanel} onAdd={handleWhatsAppAdd} onRemove={removeHandler} initialData={editingNode?.rawData as WhatsAppNodeData | undefined} />
          )}
          {activePanel === "mobilePushConfig" && (
            <MobilePushPanel onClose={handleClosePanel} onAdd={handleMobilePushAdd} onRemove={removeHandler} initialData={editingNode?.rawData as MobilePushNodeData | undefined} />
          )}
          {activePanel === "webPushConfig" && (
            <WebPushPanel onClose={handleClosePanel} onAdd={handleWebPushAdd} onRemove={removeHandler} initialData={editingNode?.rawData as WebPushNodeData | undefined} />
          )}
          {activePanel === "edicaoConfig" && (
            <EdicaoPropriedadePanel onClose={handleClosePanel} onAdd={handleEdicaoAdd} onRemove={removeHandler} initialData={editingNode?.rawData as EdicaoPropriedadeNodeData | undefined} />
          )}
          {activePanel === "webhooksConfig" && (
            <WebhooksPanel onClose={handleClosePanel} onAdd={handleWebhooksAdd} onRemove={removeHandler} initialData={editingNode?.rawData as WebhooksNodeData | undefined} />
          )}
          {activePanel === "segmentacaoConfig" && (
            <SegmentacaoNoPanel
              onClose={handleClosePanel}
              onAdd={handleSegmentacaoAdd}
              onRemove={segRemoveHandler}
              segCount={segPanelSegCount}
              currentPriority={segPanelCurrentPriority}
              initialData={
                editingSegBranch
                  ? (savedNodes.find((n) => n.id === editingSegBranch.parentNodeId)?.branches?.[editingSegBranch.branchIdx]?.rawData as SegmentacaoNoNodeData | undefined)
                  : (editingNode?.rawData as SegmentacaoNoNodeData | undefined)
              }
            />
          )}
          {activePanel === "testeABConfig" && (
            <TesteABPanel onClose={handleClosePanel} onAdd={handleTesteABAdd} onRemove={removeHandler} initialData={editingNode?.rawData as TesteABCardNodeData | undefined} />
          )}
        </div>
      </CanvasCtx.Provider>
    </ReactFlowProvider>
  );
}
