import React from 'react';
import type { WorkflowNode, WorkflowNodeData } from '../../types/workflow';

type Props = {
  node: WorkflowNode;
  onChange: (nodeId: string, data: Partial<WorkflowNodeData>) => void;
};

const ApprovalForm: React.FC<Props> = ({ node, onChange }) => {
  return (
    <>
      <label className="form__field">
        <span className="form__label">Title</span>
        <input
          type="text"
          value={node.data.title}
          onChange={(e) => onChange(node.id, { title: e.target.value })}
        />
      </label>
      <label className="form__field">
        <span className="form__label">Summary</span>
        <input
          type="text"
          value={node.data.summary}
          onChange={(e) => onChange(node.id, { summary: e.target.value })}
        />
      </label>
      <label className="form__field">
        <span className="form__label">Approver role</span>
        <input
          type="text"
          value={node.data.approverRole ?? ''}
          onChange={(e) => onChange(node.id, { approverRole: e.target.value })}
        />
      </label>
      <label className="form__field">
        <span className="form__label">Description</span>
        <textarea
          value={node.data.description ?? ''}
          onChange={(e) => onChange(node.id, { description: e.target.value })}
          rows={3}
        />
      </label>
    </>
  );
};

export default ApprovalForm;

