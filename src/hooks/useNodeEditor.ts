import { useMemo, useState } from 'react';
import type { WorkflowNode } from '../types/workflow';

export const useNodeEditor = (nodes: WorkflowNode[]) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId),
    [nodes, selectedNodeId],
  );

  return {
    selectedNodeId,
    setSelectedNodeId,
    selectedNode,
  };
};

