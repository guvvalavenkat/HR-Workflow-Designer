import { useCallback, useRef, useState } from 'react';
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  useEdgesState,
  useNodesState,
} from 'react-flow-renderer';
import type {
  Connection,
  Edge,
  Node,
  XYPosition,
  OnEdgesChange,
  OnEdgesDelete,
  OnNodesChange,
} from 'react-flow-renderer';
import type { WorkflowEdge, WorkflowNode, WorkflowNodeData, WorkflowNodeType } from '../types/workflow';

const initialNodes: WorkflowNode[] = [
  {
    id: 'entry',
    type: 'start',
    data: { title: 'Start', summary: 'Entry event', description: 'New hire created' },
    position: { x: 150, y: 120 },
  },
  {
    id: 'task-1',
    type: 'task',
    data: {
      title: 'Collect paperwork',
      summary: 'Prep onboarding docs',
      assignee: 'People Ops',
      description: 'Gather tax forms and ID',
      dueDate: null,
    },
    position: { x: 400, y: 120 },
  },
  {
    id: 'task-2',
    type: 'approval',
    data: {
      title: 'Manager approval',
      summary: 'Confirm equipment',
      approverRole: 'Hiring Manager',
      description: 'Approve laptop + licenses',
    },
    position: { x: 650, y: 120 },
  },
  {
    id: 'automated-1',
    type: 'automated',
    data: {
      title: 'Send welcome email',
      summary: 'Auto message',
      actionParams: 'template=welcome-new-hire',
      assignee: 'Automation',
    },
    position: { x: 900, y: 120 },
  },
  {
    id: 'end',
    type: 'end',
    data: { title: 'End', summary: 'Flow complete' },
    position: { x: 1150, y: 120 },
  },
];

const initialEdges: Edge[] = [
  { id: 'entry->task-1', source: 'entry', target: 'task-1', animated: true },
  { id: 'task-1->task-2', source: 'task-1', target: 'task-2' },
  { id: 'task-2->automated-1', source: 'task-2', target: 'automated-1' },
  { id: 'automated-1->end', source: 'automated-1', target: 'end' },
];

export const useWorkflow = () => {
  const [nodes, setNodes] = useNodesState<WorkflowNodeData>(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(initialNodes[0]?.id ?? null);
  const historyRef = useRef<{ nodes: WorkflowNode[]; edges: WorkflowEdge[] }[]>([
    { nodes: initialNodes, edges: initialEdges },
  ]);
  const historyIndexRef = useRef(0);

  const recordHistory = useCallback((nextNodes: WorkflowNode[], nextEdges: WorkflowEdge[]) => {
    const snapshot = {
      nodes: JSON.parse(JSON.stringify(nextNodes)) as WorkflowNode[],
      edges: JSON.parse(JSON.stringify(nextEdges)) as WorkflowEdge[],
    };
    const trimmed = historyRef.current.slice(0, historyIndexRef.current + 1);
    trimmed.push(snapshot);
    if (trimmed.length > 30) trimmed.shift();
    historyRef.current = trimmed;
    historyIndexRef.current = trimmed.length - 1;
  }, []);

  const onConnect = useCallback(
    (connection: Edge | Connection) => {
      setEdges((prev) => {
        const next = addEdge({ ...connection, animated: true }, prev);
        recordHistory(nodes as WorkflowNode[], next as WorkflowEdge[]);
        return next;
      });
    },
    [nodes, recordHistory, setEdges],
  );

  const createNode = useCallback((type: WorkflowNodeType, position: XYPosition): WorkflowNode => {
    const defaults: Record<WorkflowNodeType, WorkflowNodeData> = {
      start: { title: 'Start', summary: 'Entry event', description: 'Trigger point' },
      task: {
        title: 'Task',
        summary: 'Manual work',
        assignee: 'Owner TBD',
        description: 'Describe the task',
        dueDate: null,
      },
      approval: {
        title: 'Approval',
        summary: 'Decision step',
        approverRole: 'Approver',
        description: 'What needs approval?',
      },
      automated: {
        title: 'Automated',
        summary: 'System action',
        actionParams: 'key=value',
        assignee: 'Automation',
      },
      end: { title: 'End', summary: 'Finish' },
    };

    return {
      id: crypto.randomUUID(),
      type,
      data: defaults[type],
      position,
    };
  }, []);

  const addNodeAtPosition = useCallback(
    (type: WorkflowNodeType, position: XYPosition) => {
      setNodes((prev) => {
        const newNode = createNode(type, position);
        const next = [...prev, newNode];
        recordHistory(next as WorkflowNode[], edges as WorkflowEdge[]);
        setSelectedNodeId(newNode.id);
        return next;
      });
    },
    [createNode, edges, recordHistory, setNodes],
  );

  const updateNodeData = useCallback(
    (nodeId: string, data: Partial<WorkflowNodeData>) => {
      setNodes((prev) => {
        const next = prev.map((node) =>
          node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node,
        );
        recordHistory(next as WorkflowNode[], edges as WorkflowEdge[]);
        return next;
      });
    },
    [edges, nodes, recordHistory, setNodes],
  );

  const onNodesDelete = useCallback(
    (deleted: Node<WorkflowNodeData>[]) => {
      const deletedIds = new Set(deleted.map((node) => node.id));
      setEdges((prev) => {
        const next = prev.filter(
          (edge) => !deletedIds.has(edge.source) && !deletedIds.has(edge.target),
        );
        recordHistory(nodes as WorkflowNode[], next as WorkflowEdge[]);
        return next;
      });
      setSelectedNodeId((current) => (current && deletedIds.has(current) ? null : current));
    },
    [nodes, recordHistory, setEdges],
  );

  const onEdgesDelete: OnEdgesDelete = useCallback(
    (deleted: Edge[]) => {
      const deletedIds = new Set(deleted.map((edge) => edge.id));
      setEdges((prev) => {
        const next = prev.filter((edge) => !deletedIds.has(edge.id));
        recordHistory(nodes as WorkflowNode[], next as WorkflowEdge[]);
        return next;
      });
    },
    [nodes, recordHistory, setEdges],
  );

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setNodes((prev) => {
        const next = applyNodeChanges(changes, prev);
        recordHistory(next as WorkflowNode[], edges as WorkflowEdge[]);
        return next;
      });
    },
    [edges, recordHistory, setNodes],
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      setEdges((prev) => {
        const next = applyEdgeChanges(changes, prev);
        recordHistory(nodes as WorkflowNode[], next as WorkflowEdge[]);
        return next;
      });
    },
    [nodes, recordHistory, setEdges],
  );

  const undo = useCallback(() => {
    if (historyIndexRef.current === 0) return;
    const nextIndex = historyIndexRef.current - 1;
    const snapshot = historyRef.current[nextIndex];
    historyIndexRef.current = nextIndex;
    setNodes(snapshot.nodes);
    setEdges(snapshot.edges);
  }, [setEdges, setNodes]);

  const redo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    const nextIndex = historyIndexRef.current + 1;
    const snapshot = historyRef.current[nextIndex];
    historyIndexRef.current = nextIndex;
    setNodes(snapshot.nodes);
    setEdges(snapshot.edges);
  }, [setEdges, setNodes]);

  const canUndo = useCallback(() => historyIndexRef.current > 0, []);
  const canRedo = useCallback(
    () => historyIndexRef.current < historyRef.current.length - 1,
    [],
  );

  const markValidation = useCallback(
    (ids: Set<string>) => {
      setNodes((prev) =>
        prev.map((node) => ({
          ...node,
          className: ids.has(node.id) ? 'rf-node-error' : undefined,
        })),
      );
    },
    [setNodes],
  );

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNodeAtPosition,
    selectedNodeId,
    setSelectedNodeId,
    updateNodeData,
    onNodesDelete,
    onEdgesDelete,
    setNodes,
    setEdges,
    undo,
    redo,
    canUndo,
    canRedo,
    markValidation,
  };
};

