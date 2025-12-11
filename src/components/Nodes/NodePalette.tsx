import React from 'react';
import type { WorkflowNodeType } from '../../types/workflow';

type Props = {
  onAddNode: (type: WorkflowNodeType) => void;
};

const nodeConfigs: Array<{ type: WorkflowNodeType; label: string; helper: string }> = [
  { type: 'start', label: 'Start', helper: 'Start a flow from an event' },
  { type: 'task', label: 'Task', helper: 'Assign work to a teammate' },
  { type: 'approval', label: 'Approval', helper: 'Request a decision step' },
];

const NodePalette: React.FC<Props> = ({ onAddNode }) => {
  return (
    <div className="palette">
      {nodeConfigs.map((node) => (
        <button
          key={node.type}
          className="palette__item"
          type="button"
          onClick={() => onAddNode(node.type)}
        >
          <span className="palette__title">{node.label}</span>
          <span className="palette__helper">{node.helper}</span>
        </button>
      ))}
    </div>
  );
};

export default NodePalette;

