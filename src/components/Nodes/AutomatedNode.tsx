import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
import type { WorkflowNodeData } from '../../types/workflow';

interface AutomatedNodeProps {
  id: string;
  data: WorkflowNodeData;
  selected?: boolean;
  type: string;
}

const AutomatedNode: React.FC<AutomatedNodeProps> = ({ data }) => {
  if (!data) return null;
  
  return (
    <div className="rf-card rf-card--automated">
      <div className="rf-card__title">{data.title ?? 'Automated'}</div>
      <div className="rf-card__summary">{data.summary}</div>
      <div className="rf-card__meta">Params: {data.actionParams ?? 'n/a'}</div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default AutomatedNode;

