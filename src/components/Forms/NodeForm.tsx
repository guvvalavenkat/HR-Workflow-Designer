import React from 'react';
import type { WorkflowNode, WorkflowNodeData } from '../../types/workflow';
import StartForm from './StartForm';
import TaskForm from './TaskForm';
import ApprovalForm from './ApprovalForm';
import AutomatedForm from './AutomatedForm';
import EndForm from './EndForm';

type Props = {
  node?: WorkflowNode;
  onChange: (id: string, data: Partial<WorkflowNodeData>) => void;
};

const NodeForm: React.FC<Props> = ({ node, onChange }) => {
  if (!node) {
    return (
      <section className="panel panel--narrow">
        <div className="panel__header">
          <p className="eyebrow">Details</p>
          <h2>Pick a node</h2>
          <p className="muted">Click a node on the canvas to edit.</p>
        </div>
      </section>
    );
  }

  const renderForm = () => {
    switch (node.type) {
      case 'start':
        return <StartForm node={node} onChange={onChange} />;
      case 'task':
        return <TaskForm node={node} onChange={onChange} />;
      case 'approval':
        return <ApprovalForm node={node} onChange={onChange} />;
      case 'automated':
        return <AutomatedForm node={node} onChange={onChange} />;
      case 'end':
        return <EndForm node={node} onChange={onChange} />;
      default:
        return null;
    }
  };

  return (
    <section className="panel panel--narrow">
      <div className="panel__header">
        <p className="eyebrow">Details</p>
        <h2>{node.data.title}</h2>
        <p className="muted">Update metadata to keep your HR flows organized.</p>
      </div>

      <form className="form">{renderForm()}</form>
    </section>
  );
};

export default NodeForm;

