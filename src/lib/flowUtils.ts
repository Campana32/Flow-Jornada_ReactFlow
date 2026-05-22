import type { Node, Edge } from "@xyflow/react";
import type { GenericNodeData } from "../components/GenericNode";
import type { AguardarNodeData } from "../components/AguardarCardNode";
import type { JornadaCardNodeData } from "../components/JornadaCardNode";
import type { SegmentacaoNoNodeData } from "../components/SegmentacaoNoPanel";
import type { TesteABCardNodeData } from "../components/TesteABCardNode";

/* ── Re-exported types ── */
export interface BranchChain {
  id: string;
  label: string;
  color: string;
  percentual: number;
  nodes: SavedNode[];
  rawData?: SegmentacaoNoNodeData;
  isNegativa?: boolean;
}

export interface SavedNode {
  id: string;
  data: GenericNodeData;
  panelType: string;
  rawData?: unknown;
  branches?: BranchChain[];
}

export interface PendingBranchNodeState {
  type: "aguardar" | "jornada";
  parentNodeId: string;
  branchIdx: number;
  nestedNodeId?: string;
  subBranchIdx?: number;
}

/* ── Layout constants ── */
export const NODE_WIDTH = 352;
export const AGUARDAR_WIDTH = 352;
export const DESISNCREVER_WIDTH = 325;
export const JORNADA_WIDTH = 352;
export const TESTEAB_WIDTH = 352;
export const SEGMENTACAO_CARD_WIDTH = 352;
export const NODE_GAP = 64;
export const BRANCH_Y_GAP = 300;
export const MAIN_FLOW_X_START = 500;
export const BRANCH_LABEL_WIDTH = 160;

export function nodeWidthOf(type: string): number {
  if (type === "aguardar") return AGUARDAR_WIDTH;
  if (type === "desisncrever") return DESISNCREVER_WIDTH;
  if (type === "jornadaOutra") return JORNADA_WIDTH;
  if (type === "testeAB") return TESTEAB_WIDTH;
  if (type === "segmentacao") return 0;
  return NODE_WIDTH;
}

function getRFNodeType(type: string): string {
  if (type === "aguardar") return "aguardarNode";
  if (type === "desisncrever") return "desisncreverNode";
  if (type === "jornadaOutra") return "jornadaNode";
  if (type === "testeAB") return "testeABNode";
  if (type === "segmentacao") return "segmentacaoNode";
  return "genericNode";
}

function makeNodeData(
  node: SavedNode,
  branchCtx?: { parentNodeId: string; branchIdx: number },
): Record<string, unknown> {
  const type = node.data.type;
  if (type === "aguardar") {
    return { nodeId: node.id, aguardarData: node.data.aguardarData, isNew: false, branchCtx };
  }
  if (type === "jornadaOutra") {
    return { nodeId: node.id, jornadaData: node.data.jornadaData, isNew: false, branchCtx };
  }
  if (type === "desisncrever") {
    return { nodeId: node.id, branchCtx };
  }
  return { nodeId: node.id, nodeData: node.data, branchCtx };
}

let _eid = 0;
function eid() {
  return `fe-${++_eid}`;
}

/* ── Edge builders ── */
function flowEdge(
  source: string,
  target: string,
  opts: { isEmpty?: boolean; showAddBtn?: boolean; branchCtx?: { parentNodeId: string; branchIdx: number } },
): Edge {
  return {
    id: eid(),
    source,
    sourceHandle: "out",
    target,
    targetHandle: "in",
    type: "flowEdge",
    data: {
      isEmpty: opts.isEmpty ?? false,
      showAddBtn: opts.showAddBtn ?? false,
      branchCtx: opts.branchCtx,
    },
  };
}

function chainEdge(
  source: string,
  sourceHandle: string,
  target: string,
  targetHandle: string,
  dashed = false,
): Edge {
  return {
    id: eid(),
    source,
    sourceHandle,
    target,
    targetHandle,
    type: "flowEdge",
    data: { isEmpty: dashed, showAddBtn: false },
  };
}

/* ── Build branch nodes ── */
function buildBranchNodes(
  nodes: Node[],
  edges: Edge[],
  branch: BranchChain,
  firstSourceId: string,
  startX: number,
  y: number,
  nodePositions: Record<string, { x: number; y: number }>,
  branchCtx: { parentNodeId: string; branchIdx: number },
  pendingBranchNode: PendingBranchNodeState | null,
): { nodeIds: string[]; lastRight: number; prevId: string } {
  const pos = (id: string, dx: number, dy: number) =>
    nodePositions[id] ?? { x: dx, y: dy };

  let x = startX;
  let prevId = firstSourceId;
  const nodeIds: string[] = [];
  let lastRight = startX;

  for (const bn of branch.nodes) {
    const type = bn.data.type;
    const w = nodeWidthOf(type);

    nodes.push({
      id: bn.id,
      type: getRFNodeType(type),
      position: pos(bn.id, x, y),
      data: makeNodeData(bn, branchCtx),
    });

    edges.push({
      id: eid(),
      source: prevId,
      sourceHandle: "out",
      target: bn.id,
      targetHandle: "in",
      type: "flowEdge",
      data: { isEmpty: false, showAddBtn: false },
    });

    nodeIds.push(bn.id);
    prevId = bn.id;
    lastRight = x + w;
    x += w + NODE_GAP;
  }

  // Pending branch node
  const pbn = pendingBranchNode;
  if (
    pbn &&
    pbn.parentNodeId === branchCtx.parentNodeId &&
    pbn.branchIdx === branchCtx.branchIdx &&
    !pbn.nestedNodeId
  ) {
    const pendId = `pbn-${branchCtx.parentNodeId}-${branchCtx.branchIdx}`;
    const pendType = pbn.type === "aguardar" ? "aguardarNode" : "jornadaNode";
    nodes.push({
      id: pendId,
      type: pendType,
      position: pos(pendId, x, y),
      data: { nodeId: null, isNew: true, branchCtx },
    });
    edges.push({
      id: eid(),
      source: prevId,
      sourceHandle: "out",
      target: pendId,
      targetHandle: "in",
      type: "flowEdge",
      data: { isEmpty: false, showAddBtn: false },
    });
    nodeIds.push(pendId);
    prevId = pendId;
    lastRight = x + nodeWidthOf(pbn.type === "aguardar" ? "aguardar" : "jornadaOutra");
  }

  return { nodeIds, lastRight, prevId };
}

/* ── Main graph builder ── */
export interface BuildFlowGraphParams {
  savedNodes: SavedNode[];
  savedSegmentacao: string;
  pendingAguardar: boolean;
  pendingJornada: boolean;
  pendingBranchNode: PendingBranchNodeState | null;
  nodePositions: Record<string, { x: number; y: number }>;
}

export function buildFlowGraph({
  savedNodes,
  savedSegmentacao,
  pendingAguardar,
  pendingJornada,
  pendingBranchNode,
  nodePositions,
}: BuildFlowGraphParams): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const pos = (id: string, dx: number, dy: number) =>
    nodePositions[id] ?? { x: dx, y: dy };

  const nodeConfigured = Boolean(savedSegmentacao);

  /* Entrada */
  nodes.push({
    id: "entrada",
    type: "entradaNode",
    position: pos("entrada", 24, 0),
    data: { savedSegmentacao },
  });

  /* Main flow X positions */
  const mainX: number[] = [];
  let cumX = MAIN_FLOW_X_START;
  for (const n of savedNodes) {
    mainX.push(cumX);
    cumX += nodeWidthOf(n.data.type) + NODE_GAP;
  }

  let prevId = "entrada";

  for (let i = 0; i < savedNodes.length; i++) {
    const node = savedNodes[i];
    const nx = mainX[i];
    const type = node.data.type;
    const isLast = i === savedNodes.length - 1;

    /* ── Segmentação ── */
    if (type === "segmentacao") {
      const segCardX = nx + 64;
      const effectiveBranchX = segCardX + SEGMENTACAO_CARD_WIDTH + NODE_GAP;
      const BSPC = BRANCH_Y_GAP;
      const branches = node.branches ?? [];
      const nonNegBranches = branches.filter((b) => !b.isNegativa);
      const lastNonNegBi = nonNegBranches.length - 1;
      const hasNegativa = branches.some((b) => b.isNegativa);

      /* Edge from previous to seg-0 card */
      edges.push(flowEdge(prevId, node.id, { showAddBtn: true }));

      branches.forEach((branch, bi) => {
        const isNeg = branch.isNegativa === true;
        const branchY = bi * BSPC;
        const branchCtx = { parentNodeId: node.id, branchIdx: bi };

        if (isNeg) {
          const negId = `${node.id}-negativa`;
          nodes.push({
            id: negId,
            type: "negativaNode",
            position: pos(negId, segCardX, branchY),
            data: { nodeId: node.id },
          });

          const chainSrc = lastNonNegBi === 0 ? node.id : `${node.id}-seg-${lastNonNegBi}`;
          edges.push(chainEdge(chainSrc, "branch-chain", negId, "branch-chain-in", true));

          const { nodeIds, lastRight, prevId: lastPrevId } = buildBranchNodes(
            nodes, edges, branch, negId, effectiveBranchX, branchY,
            nodePositions, branchCtx, pendingBranchNode,
          );

          const hasPending =
            pendingBranchNode?.parentNodeId === node.id &&
            pendingBranchNode.branchIdx === bi &&
            !pendingBranchNode.nestedNodeId;

          if (!hasPending && (nodeIds.length === 0 || !endsWithDesisncrever(branch))) {
            const addId = `add-end-${node.id}-${bi}`;
            nodes.push({
              id: addId, type: "addBtnNode",
              position: pos(addId, lastRight + 72, branchY),
              draggable: false,
              data: { label: "Adicionar nó", branchCtx },
            });
            edges.push(flowEdge(lastPrevId, addId, { isEmpty: true }));
          }
        } else {
          const segId = bi === 0 ? node.id : `${node.id}-seg-${bi}`;
          nodes.push({
            id: segId,
            type: "segmentacaoNode",
            position: pos(segId, segCardX, branchY),
            data: {
              nodeId: node.id,
              branchIdx: bi,
              rawData: bi === 0 ? node.rawData : branch.rawData,
              priority: bi + 1,
              isFirst: bi === 0,
              hasNegativa,
              lastNonNegBi,
            },
          });

          if (bi > 0) {
            const prevSegId = bi === 1 ? node.id : `${node.id}-seg-${bi - 1}`;
            edges.push(chainEdge(prevSegId, "branch-chain", segId, "branch-chain-in"));
          }

          const { nodeIds, lastRight, prevId: lastPrevId } = buildBranchNodes(
            nodes, edges, branch, segId, effectiveBranchX, branchY,
            nodePositions, branchCtx, pendingBranchNode,
          );

          const hasPending =
            pendingBranchNode?.parentNodeId === node.id &&
            pendingBranchNode.branchIdx === bi &&
            !pendingBranchNode.nestedNodeId;

          if (!hasPending && (nodeIds.length === 0 || !endsWithDesisncrever(branch))) {
            const addId = `add-end-${node.id}-${bi}`;
            nodes.push({
              id: addId, type: "addBtnNode",
              position: pos(addId, lastRight + 72, branchY),
              draggable: false,
              data: { label: "Adicionar nó", branchCtx },
            });
            edges.push(flowEdge(lastPrevId, addId, { isEmpty: true }));
          }
        }
      });

      /* "Adicionar ramificação" button */
      const addRamY = nonNegBranches.length * BSPC - BSPC / 2;
      const addRamId = `add-ram-${node.id}`;
      nodes.push({
        id: addRamId,
        type: "addBtnNode",
        position: pos(addRamId, segCardX + SEGMENTACAO_CARD_WIDTH / 2 - 80, addRamY),
        draggable: false,
        data: {
          label: "Adicionar ramificação",
          isAddBranch: true,
          nodeId: node.id,
          lastNonNegBi,
        },
      });

      prevId = node.id;

    /* ── Teste A/B ── */
    } else if (type === "testeAB") {
      nodes.push({
        id: node.id,
        type: "testeABNode",
        position: pos(node.id, nx, 0),
        data: { nodeId: node.id, rawData: node.rawData as TesteABCardNodeData | undefined },
      });

      edges.push(flowEdge(prevId, node.id, { showAddBtn: true }));

      const branches = node.branches ?? [];
      const N = branches.length;
      const BSPC = BRANCH_Y_GAP;

      branches.forEach((branch, bi) => {
        const yo = (bi - (N - 1) / 2) * BSPC;
        const labelX = nx + TESTEAB_WIDTH + NODE_GAP;
        const labelId = `bl-${branch.id}`;
        const branchCtx = { parentNodeId: node.id, branchIdx: bi };

        nodes.push({
          id: labelId,
          type: "branchLabelNode",
          position: pos(labelId, labelX, yo),
          draggable: false,
          data: { label: branch.label, color: branch.color, percentual: branch.percentual },
        });

        edges.push({
          id: eid(),
          source: node.id,
          sourceHandle: "out",
          target: labelId,
          targetHandle: "in",
          type: "smoothstep",
          style: { stroke: "#9ca3af", strokeWidth: 2 },
          data: {},
        });

        const branchNodeStartX = labelX + BRANCH_LABEL_WIDTH + NODE_GAP;

        const { nodeIds, lastRight, prevId: lastPrevId } = buildBranchNodes(
          nodes, edges, branch, labelId, branchNodeStartX, yo,
          nodePositions, branchCtx, pendingBranchNode,
        );

        const hasPending =
          pendingBranchNode?.parentNodeId === node.id &&
          pendingBranchNode.branchIdx === bi &&
          !pendingBranchNode.nestedNodeId;

        if (!hasPending && (nodeIds.length === 0 || !endsWithDesisncrever(branch))) {
          const addId = `add-end-${node.id}-${bi}`;
          nodes.push({
            id: addId, type: "addBtnNode",
            position: pos(addId, lastRight + 72, yo),
            draggable: false,
            data: { label: "Adicionar nó", branchCtx },
          });
          edges.push(flowEdge(lastPrevId, addId, { isEmpty: true }));
        }
      });

      prevId = node.id;

    /* ── Simple node ── */
    } else {
      nodes.push({
        id: node.id,
        type: getRFNodeType(type),
        position: pos(node.id, nx, 0),
        data: makeNodeData(node),
      });

      edges.push(flowEdge(prevId, node.id, { showAddBtn: true }));
      prevId = node.id;

      const isPending = (pendingAguardar || pendingJornada) && isLast;
      if (isLast && type !== "desisncrever" && !isPending) {
        const addId = "add-main-end";
        nodes.push({
          id: addId, type: "addBtnNode",
          position: pos(addId, nx + nodeWidthOf(type) + 72, 0),
          draggable: false,
          data: { label: "Adicionar nó" },
        });
        edges.push(flowEdge(node.id, addId, { isEmpty: true }));
      }
    }
  }

  /* No nodes yet */
  if (savedNodes.length === 0 && !pendingAguardar && !pendingJornada) {
    const addId = "add-main-0";
    nodes.push({
      id: addId, type: "addBtnNode",
      position: pos(addId, MAIN_FLOW_X_START + 72, 0),
      draggable: false,
      data: { label: "Adicionar nó", disabled: !nodeConfigured },
    });
    edges.push(flowEdge("entrada", addId, { isEmpty: true }));
  }

  /* Pending aguardar (main flow) */
  if (pendingAguardar) {
    const pendX = mainX.length > 0
      ? mainX[mainX.length - 1] + nodeWidthOf(savedNodes[savedNodes.length - 1]?.data.type ?? "") + NODE_GAP
      : MAIN_FLOW_X_START;
    nodes.push({
      id: "pending-aguardar",
      type: "aguardarNode",
      position: pos("pending-aguardar", pendX, 0),
      data: { nodeId: null, isNew: true },
    });
    edges.push(flowEdge(prevId, "pending-aguardar", {}));
  }

  /* Pending jornada (main flow) */
  if (pendingJornada) {
    const pendX = mainX.length > 0
      ? mainX[mainX.length - 1] + nodeWidthOf(savedNodes[savedNodes.length - 1]?.data.type ?? "") + NODE_GAP
      : MAIN_FLOW_X_START;
    nodes.push({
      id: "pending-jornada",
      type: "jornadaNode",
      position: pos("pending-jornada", pendX, 0),
      data: { nodeId: null, isNew: true },
    });
    edges.push(flowEdge(prevId, "pending-jornada", {}));
  }

  return { nodes, edges };
}

function endsWithDesisncrever(branch: BranchChain): boolean {
  return branch.nodes[branch.nodes.length - 1]?.data.type === "desisncrever";
}
