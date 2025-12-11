import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
import type { WorkflowNodeData } from '../../types/workflow';

interface ApprovalNodeProps {
  id: string;
  data: WorkflowNodeData;
  selected?: boolean;
  type: string;
}

const ApprovalNode: React.FC<ApprovalNodeProps> = ({ data }) => {
  if (!data) return null;
  
  return (
    <div className="rf-card rf-card--approval">
      <div className="rf-card__title">{data.title ?? 'Approval'}</div>
      <div className="rf-card__summary">{data.summary}</div>
      <div className="rf-card__meta">Approver: {data.approverRole ?? 'Unset'}</div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default ApprovalNode;

