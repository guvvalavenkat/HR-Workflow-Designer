import React from 'react';
import type { WorkflowNodeType } from '../../types/workflow';

type Props = {
  onDragStart: (event: React.DragEvent, type: WorkflowNodeType) => void;
};

const nodeTypes: Array<{ type: WorkflowNodeType; label: string; helper: string }> = [
  { type: 'start', label: 'Start', helper: 'Entry event' },
  { type: 'task', label: 'Task', helper: 'Manual action' },
  { type: 'approval', label: 'Approval', helper: 'Decision gate' },
  { type: 'automated', label: 'Automated', helper: 'System action' },
  { type: 'end', label: 'End', helper: 'Flow complete' },
];

const Sidebar: React.FC<Props> = ({ onDragStart }) => {
  return (
    <aside className="panel panel--narrow">
      <div className="panel__header">
        <p className="eyebrow">Sidebar</p>
        <h2>Drag node types</h2>
        <p className="muted">Drag a type onto the canvas to create a node.</p>
      </div>

      <ul className="list">
        {nodeTypes.map((node) => (
          <li key={node.type} className="list__item">
            <button
              className="chip"
              type="button"
              draggable
              onDragStart={(event) => onDragStart(event, node.type)}
            >
              <span className="chip__title">{node.label}</span>
              <span className="chip__meta">{node.helper}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;

