import React, { useCallback, useMemo, useRef, useState } from 'react';
import type { Edge, Node } from 'react-flow-renderer';
import { simulateWorkflow } from '../../api/useApi';
import type { SimulationLogEntry, WorkflowNodeData } from '../../types/workflow';

type Props = {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
  setNodes: (updater: (prev: Node<WorkflowNodeData>[]) => Node<WorkflowNodeData>[]) => void;
  setEdges: (updater: (prev: Edge[]) => Edge[]) => void;
  markValidation: (ids: Set<string>) => void;
};

const detectCycles = (nodes: Node[], edges: Edge[]): { hasCycle: boolean; inCycle: Set<string> } => {
  const adj = new Map<string, string[]>();
  nodes.forEach((n) => adj.set(n.id, []));
  edges.forEach((edge) => {
    if (!adj.has(edge.source)) adj.set(edge.source, []);
    adj.get(edge.source)!.push(edge.target);
  });

  const visited = new Set<string>();
  const stack = new Set<string>();

  const inCycle = new Set<string>();

  const dfs = (nodeId: string): boolean => {
    if (stack.has(nodeId)) {
      inCycle.add(nodeId);
      return true;
    }
    if (visited.has(nodeId)) return false;
    visited.add(nodeId);
    stack.add(nodeId);
    for (const neighbor of adj.get(nodeId) ?? []) {
      if (dfs(neighbor)) {
        inCycle.add(nodeId);
        return true;
      }
    }
    stack.delete(nodeId);
    return false;
  };

  for (const node of nodes) {
    if (dfs(node.id)) return { hasCycle: true, inCycle };
  }
  return { hasCycle: false, inCycle };
};

const TestPanel: React.FC<Props> = ({ nodes, edges, setNodes, setEdges, markValidation }) => {
  const [errors, setErrors] = useState<string[]>([]);
  const [logs, setLogs] = useState<SimulationLogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const counts = useMemo(
    () => ({
      start: nodes.filter((n) => n.type === 'start').length,
      end: nodes.filter((n) => n.type === 'end').length,
    }),
    [nodes],
  );

  const runSimulation = useCallback(async () => {
    const validation: string[] = [];
    if (counts.start !== 1) validation.push('Flow must have exactly one Start node.');
    if (counts.end < 1) validation.push('Flow must include at least one End node.');
    const { hasCycle, inCycle } = detectCycles(nodes, edges);
    if (hasCycle) validation.push('Flow contains a cycle. Break the loop.');

    const errorIds = new Set<string>();
    if (counts.start !== 1) nodes.filter((n) => n.type === 'start').forEach((n) => errorIds.add(n.id));
    if (counts.end < 1) nodes.filter((n) => n.type === 'end').forEach((n) => errorIds.add(n.id));
    inCycle.forEach((id) => errorIds.add(id));
    markValidation(errorIds);

    if (validation.length > 0) {
      setErrors(validation);
      setLogs([]);
      return;
    }

    try {
      setLoading(true);
      setErrors([]);
      const payload = { nodes, edges };
      const response = await simulateWorkflow(payload);
      setLogs(response.log ?? []);
      markValidation(new Set());
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'Failed to run simulation']);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [counts.end, counts.start, edges, markValidation, nodes]);

  const exportJson = useCallback(() => {
    const blob = new Blob([JSON.stringify({ nodes, edges }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'workflow.json';
    link.click();
    URL.revokeObjectURL(url);
  }, [edges, nodes]);

  const handleImport = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result as string) as { nodes: Node<WorkflowNodeData>[]; edges: Edge[] };
          setNodes(() => parsed.nodes ?? []);
          setEdges(() => parsed.edges ?? []);
          markValidation(new Set());
          setErrors([]);
          setLogs([]);
        } catch (e) {
          setErrors(['Invalid JSON file']);
        }
      };
      reader.readAsText(file);
    },
    [markValidation, setEdges, setNodes],
  );

  return (
    <section className="panel panel--narrow">
      <div className="panel__header">
        <p className="eyebrow">Test</p>
        <h2>Run Simulation</h2>
        <p className="muted">Validate and simulate the current workflow.</p>
      </div>

      <div className="actions">
        <button className="primary-btn" type="button" onClick={runSimulation} disabled={loading}>
          {loading ? 'Running...' : 'Run Simulation'}
        </button>
        <button className="ghost-btn" type="button" onClick={exportJson}>
          Export JSON
        </button>
        <button className="ghost-btn" type="button" onClick={() => fileInputRef.current?.click()}>
          Import JSON
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          style={{ display: 'none' }}
          onChange={handleImport}
        />
      </div>

      {errors.length > 0 && (
        <div className="alert alert--error">
          <p className="alert__title">Validation issues</p>
          <ul>
            {errors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {logs.length > 0 && (
        <ol className="timeline">
          {logs.map((entry) => (
            <li key={`${entry.step}-${entry.timestamp}`} className={`timeline__item timeline__item--${entry.status}`}>
              <div className="timeline__step">{entry.step}</div>
              <div className="timeline__meta">
                <span className="timeline__status">{entry.status}</span>
                <span className="timeline__time">{new Date(entry.timestamp).toLocaleTimeString()}</span>
              </div>
              {entry.detail && <p className="timeline__detail">{entry.detail}</p>}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
};

export default TestPanel;

