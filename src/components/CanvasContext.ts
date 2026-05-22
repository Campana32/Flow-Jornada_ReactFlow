import { createContext } from "react";
import type { AguardarNodeData } from "./AguardarCardNode";
import type { JornadaCardNodeData } from "./JornadaCardNode";
import type { SavedNode, PendingBranchNodeState } from "../lib/flowUtils";

export interface CanvasCtxValue {
  /* State (for graph building in FlowCanvas) */
  savedNodes: SavedNode[];
  savedSegmentacao: string;
  pendingAguardar: boolean;
  pendingJornada: boolean;
  pendingBranchNode: PendingBranchNodeState | null;

  /* Handlers */
  onConfigure: () => void;
  onOpenAdicionarNo: () => void;
  onOpenAdicionarNoBranch: (
    parentNodeId: string,
    branchIdx: number,
    nestedNodeId?: string,
    subBranchIdx?: number,
  ) => void;
  onEditNode: (nodeId: string, ctx?: { parentNodeId: string; branchIdx: number }) => void;
  onEditSegBranch: (parentNodeId: string, branchIdx: number) => void;
  onRemoveNode: (nodeId: string) => void;
  onAguardarUpdate: (nodeId: string, data: AguardarNodeData) => void;
  onAguardarConfirm: (data: AguardarNodeData) => void;
  onAguardarCancel: () => void;
  onJornadaUpdate: (nodeId: string, data: JornadaCardNodeData) => void;
  onJornadaConfirm: (data: JornadaCardNodeData) => void;
  onJornadaCancel: () => void;
  onRemoveNegativa: (parentNodeId: string) => void;
  onAddNegativa: (parentNodeId: string) => void;
  onSelectBranchType: (
    parentNodeId: string,
    type: "segmentar" | "nao-atende",
    lastNonNegBi: number,
  ) => void;
  onBranchAguardarConfirm: (
    parentNodeId: string,
    branchIdx: number,
    data: AguardarNodeData,
    nestedNodeId?: string,
    subBranchIdx?: number,
  ) => void;
  onBranchJornadaConfirm: (
    parentNodeId: string,
    branchIdx: number,
    data: JornadaCardNodeData,
    nestedNodeId?: string,
    subBranchIdx?: number,
  ) => void;
  onBranchInlineUpdate: (
    parentNodeId: string,
    branchIdx: number,
    nodeId: string,
    updater: (n: SavedNode) => SavedNode,
  ) => void;
  onPendingBranchCancel: () => void;
}

export const CanvasCtx = createContext<CanvasCtxValue>(null!);
