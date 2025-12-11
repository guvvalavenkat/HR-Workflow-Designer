import React, { useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
} from 'react-flow-renderer';
import type {
  Connection,
  Edge,
  Node,
  NodeChange,
  OnConnect,
  OnEdgesChange,
  OnEdgesDelete,
  OnNodesChange,
  OnNodesDelete,
} from 'react-flow-renderer';
import type { WorkflowNodeData, WorkflowNodeType } from '../../types/workflow';
import StartNode from '../Nodes/StartNode';
import TaskNode from '../Nodes/TaskNode';
import ApprovalNode from '../Nodes/ApprovalNode';
import AutomatedNode from '../Nodes/AutomatedNode';
import EndNode from '../Nodes/EndNode';

type Props = {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  onSelectNode: (id: string | null) => void;
  onDropNode: (type: WorkflowNodeType, position: { x: number; y: number }) => void;
  onNodesDelete: OnNodesDelete;
  onEdgesDelete: OnEdgesDelete;
};

const CanvasInner: React.FC<Props> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onSelectNode,
  onDropNode,
  onNodesDelete,
  onEdgesDelete,
}) => {
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const reactFlow = useReactFlow();

  const handleNodesChange: OnNodesChange = (changes: NodeChange[]) => {
    onNodesChange(
      changes.map((change) =>
        change.type === 'select'
          ? {
              ...change,
              selected: true,
            }
          : change,
      ),
    );
  };

  const handleConnect: OnConnect = (connection: Connection | Edge) => {
    if ('source' in connection && 'target' in connection) {
      onConnect(connection as Connection);
    }
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow') as WorkflowNodeType;
      if (!type) return;

      const bounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!bounds) return;

      const position = reactFlow.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      onDropNode(type, position);
    },
    [onDropNode, reactFlow],
  );

  return (
    <section className="panel">
      <div className="panel__header">
        <div>
          <p className="eyebrow">Canvas</p>
          <h2>Workflow map</h2>
        </div>
        <p className="muted">
          Drag nodes, connect steps, and visualize the employee journey.
        </p>
      </div>

      <div className="canvas" ref={reactFlowWrapper} onDrop={onDrop} onDragOver={onDragOver}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={{
            start: StartNode as React.ComponentType<any>,
            task: TaskNode as React.ComponentType<any>,
            approval: ApprovalNode as React.ComponentType<any>,
            automated: AutomatedNode as React.ComponentType<any>,
            end: EndNode as React.ComponentType<any>,
          }}
          onNodesChange={handleNodesChange}
          onEdgesChange={onEdgesChange}
          onNodesDelete={onNodesDelete}
          onEdgesDelete={onEdgesDelete}
          onConnect={handleConnect}
          fitView
          onNodeClick={(_, node) => onSelectNode(node.id)}
          onPaneClick={() => onSelectNode(null)}
          deleteKeyCode={['Delete', 'Backspace']}
        >
          <MiniMap />
          <Controls />
          <Background gap={18} size={1} />
        </ReactFlow>
      </div>
    </section>
  );
};

const WorkflowCanvas: React.FC<Props> = (props) => (
  <ReactFlowProvider>
    <CanvasInner {...props} />
  </ReactFlowProvider>
);

export default WorkflowCanvas;

