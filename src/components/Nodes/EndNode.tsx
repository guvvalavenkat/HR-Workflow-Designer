import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
import type { WorkflowNodeData } from '../../types/workflow';

interface EndNodeProps {
  id: string;
  data: WorkflowNodeData;
  selected?: boolean;
  type: string;
}

const EndNode: React.FC<EndNodeProps> = ({ data }) => {
  if (!data) return null;
  
  return (
    <div className="rf-card rf-card--end">
      <div className="rf-card__title">{data.title ?? 'End'}</div>
      <div className="rf-card__summary">{data.summary}</div>
      <Handle type="target" position={Position.Left} />
    </div>
  );
};

export default EndNode;

