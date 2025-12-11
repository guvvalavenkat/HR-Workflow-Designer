import React from 'react';
import WorkflowCanvas from './components/Canvas/WorkflowCanvas';
import Sidebar from './components/Sidebar/Sidebar';
import NodeForm from './components/Forms/NodeForm';
import { useWorkflow } from './hooks/useWorkflow';
import type { WorkflowNode, WorkflowNodeType } from './types/workflow';
import TestPanel from './components/TestPanel/TestPanel';

const App: React.FC = () => {
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNodeAtPosition,
    selectedNodeId,
    setSelectedNodeId,
    updateNodeData,
    onNodesDelete,
    onEdgesDelete,
    undo,
    redo,
    canUndo,
    canRedo,
    markValidation,
  } = useWorkflow();

  const selectedNode: WorkflowNode | undefined = nodes.find(
    (node) => node.id === selectedNodeId,
  ) as WorkflowNode | undefined;

  const handleDragStart = (event: React.DragEvent, type: WorkflowNodeType) => {
    event.dataTransfer.setData('application/reactflow', type);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="layout">
      <header className="layout__header">
        <div>
          <p className="eyebrow">HR Workflow Designer</p>
          <h1>Design people workflows fast</h1>
          <p className="muted">
            Drag node types from the sidebar, connect them on the canvas, and edit details to
            prototype HR automations.
          </p>
        </div>
        <div className="actions">
          <button className="ghost-btn" type="button" onClick={undo} disabled={!canUndo()}>
            Undo
          </button>
          <button className="ghost-btn" type="button" onClick={redo} disabled={!canRedo()}>
            Redo
          </button>
        </div>
      </header>

      <main className="layout__main">
        <Sidebar onDragStart={handleDragStart} />

        <WorkflowCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onSelectNode={setSelectedNodeId}
          onDropNode={addNodeAtPosition}
          onNodesDelete={onNodesDelete}
          onEdgesDelete={onEdgesDelete}
        />

        <div className="panel-stack">
          <NodeForm node={selectedNode} onChange={updateNodeData} />
          <TestPanel
            nodes={nodes}
            edges={edges}
            setNodes={setNodes}
            setEdges={setEdges}
            markValidation={markValidation}
          />
        </div>
      </main>
    </div>
  );
};

export default App;

