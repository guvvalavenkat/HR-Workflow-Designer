import { useCallback } from 'react';
import { addEdge, useEdgesState, useNodesState } from 'react-flow-renderer';
import type {
  Connection,
  Edge,
  OnEdgesDelete,
  OnNodesDelete,
} from 'react-flow-renderer';
import type { WorkflowEdge, WorkflowNode, WorkflowNodeData, WorkflowNodeType } from '../types/workflow';

const defaultNodeData: Record<WorkflowNodeType, WorkflowNodeData> = {
  start: { title: 'Start', summary: 'Entry event', description: 'Trigger point' },
  task: { title: 'Task', summary: 'Manual work', assignee: 'Owner TBD' },
  approval: { title: 'Approval', summary: 'Decision step', approverRole: 'Approver' },
  automated: { title: 'Automated', summary: 'System action', actionParams: 'key=value' },
  end: { title: 'End', summary: 'Finish' },
};

export const useWorkflowStore = (initialNodes: WorkflowNode[] = [], initialEdges: WorkflowEdge[] = []) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<WorkflowNodeData>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection: Edge | Connection) => {
      setEdges((prev) => addEdge({ ...connection, animated: true }, prev));
    },
    [setEdges],
  );

  const onNodesDelete: OnNodesDelete = useCallback(
    (deleted) => {
      const deletedIds = new Set(deleted.map((node) => node.id));
      setEdges((prev) => prev.filter((edge) => !deletedIds.has(edge.source) && !deletedIds.has(edge.target)));
    },
    [setEdges],
  );

  const onEdgesDelete: OnEdgesDelete = useCallback(
    (deleted) => {
      const deletedIds = new Set(deleted.map((edge) => edge.id));
      setEdges((prev) => prev.filter((edge) => !deletedIds.has(edge.id)));
    },
    [setEdges],
  );

  const addNodeAt = useCallback(
    (type: WorkflowNodeType, position: { x: number; y: number }) => {
      setNodes((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          type,
          position,
          data: defaultNodeData[type],
        },
      ]);
    },
    [setNodes],
  );

  return {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodesDelete,
    onEdgesDelete,
    addNodeAt,
  };
};

