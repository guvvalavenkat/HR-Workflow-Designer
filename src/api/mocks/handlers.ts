import { http, HttpResponse } from 'msw';
import type {
  AutomationAction,
  SimulationLogEntry,
  WorkflowTemplate,
} from '../../types/workflow';

const mockTemplates: WorkflowTemplate[] = [
  {
    id: 'onboarding',
    name: 'New hire onboarding',
    nodes: [],
    edges: [],
  },
];

const mockActions: AutomationAction[] = [
  { id: 'send-email', name: 'Send Email', description: 'Send templated email to user' },
  { id: 'create-ticket', name: 'Create Ticket', description: 'Open a ticket in Jira/Asana' },
  { id: 'provision-app', name: 'Provision App Access', description: 'Grant access to Okta app' },
];

export const handlers = [
  http.get('/api/workflows', () => HttpResponse.json(mockTemplates)),
  http.get('/api/automations', () => HttpResponse.json(mockActions)),
  http.post('/api/simulate', async ({ request }) => {
    const body = (await request.json()) as { nodes?: unknown[]; edges?: unknown[] };
    const log: SimulationLogEntry[] = [
      {
        step: 'Validate workflow',
        status: 'completed',
        detail: 'Structure and node types valid',
        timestamp: new Date().toISOString(),
      },
      {
        step: 'Execute start',
        status: 'completed',
        detail: 'Start node triggered',
        timestamp: new Date(Date.now() + 1000).toISOString(),
      },
      {
        step: 'Run tasks',
        status: 'completed',
        detail: `Processed ${body?.nodes?.length ?? 0} nodes`,
        timestamp: new Date(Date.now() + 2000).toISOString(),
      },
      {
        step: 'Finish',
        status: 'completed',
        detail: 'Simulation complete',
        timestamp: new Date(Date.now() + 3000).toISOString(),
      },
    ];

    return HttpResponse.json({ log });
  }),
];

