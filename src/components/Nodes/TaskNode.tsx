import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
import type { WorkflowNodeData } from '../../types/workflow';

interface TaskNodeProps {
  id: string;
  data: WorkflowNodeData;
  selected?: boolean;
  type: string;
}

const TaskNode: React.FC<TaskNodeProps> = ({ data }) => {
  if (!data) return null;
  
  return (
    <div className="rf-card rf-card--task">
      <div className="rf-card__title">{data.title ?? 'Task'}</div>
      <div className="rf-card__summary">{data.summary}</div>
      <div className="rf-card__meta">Assignee: {data.assignee ?? 'Unassigned'}</div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default TaskNode;

