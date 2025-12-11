import type { Edge, Node, XYPosition } from 'react-flow-renderer';

export type WorkflowNodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';

export interface WorkflowNodeData {
  title: string;
  summary: string;
  description?: string;
  assignee?: string;
  approverRole?: string;
  actionParams?: string;
  dueDate?: Date | null;
}

export interface WorkflowNode extends Node<WorkflowNodeData> {
  type: WorkflowNodeType;
}

export interface WorkflowEdge extends Edge {
  source: string;
  target: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export interface DropPayload {
  type: WorkflowNodeType;
  position: XYPosition;
}

export interface AutomationAction {
  id: string;
  name: string;
  description: string;
}

export interface SimulationLogEntry {
  step: string;
  status: 'queued' | 'running' | 'completed';
  detail?: string;
  timestamp: string;
}

