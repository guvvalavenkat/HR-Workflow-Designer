import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
import type { WorkflowNodeData } from '../../types/workflow';

interface StartNodeProps {
  id: string;
  data: WorkflowNodeData;
  selected?: boolean;
  type: string;
}

const StartNode: React.FC<StartNodeProps> = ({ data }) => {
  if (!data) return null;
  
  return (
    <div className="rf-card rf-card--start">
      <div className="rf-card__title">{data.title ?? 'Start'}</div>
      <div className="rf-card__summary">{data.summary}</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default StartNode;

