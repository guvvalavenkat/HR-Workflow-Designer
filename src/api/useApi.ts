import type { AutomationAction, SimulationLogEntry, WorkflowTemplate } from '../types/workflow';

const BASE_URL = '/api';

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
};

export const getAutomations = () => request<AutomationAction[]>('/automations');

export const simulateWorkflow = (payload: { nodes: unknown; edges: unknown }) =>
  request<{ log: SimulationLogEntry[] }>('/simulate', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const getWorkflows = () => request<WorkflowTemplate[]>('/workflows');

