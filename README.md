# HR Workflow Designer (Vite + React + TS)

Prototype for designing HR workflows with drag-and-drop nodes, per-node editors, simulation, and MSW-backed APIs.

## Run it

```bash
npm install
npm run msw:start   # generate service worker if not present
npm run dev         # start Vite
```

Build / preview:

```bash
npm run build
npm run start
```

## Architecture
- **Vite + React + TypeScript** for the SPA.
- **react-flow-renderer** for the canvas (custom node components registered in `WorkflowCanvas`).
- **State hooks**: `useWorkflowStore` wraps nodes/edges + React Flow change handlers; `useNodeEditor` manages selected node state; `useWorkflow` (existing) orchestrates app-specific logic.
- **MSW** in `src/api/mocks` to mock `/api/*` routes (workflows, automations, simulate).
- **API helpers** in `src/api/useApi.ts` for `getAutomations`, `simulateWorkflow`, `getWorkflows`.
- **Forms** per node type under `src/components/Forms` update node data via React Flow `setNodes`.
- **TestPanel** validates graph (one Start, ≥1 End, no cycles) and calls `/simulate`, rendering a timeline.

## Design decisions
- Kept data model small but expressive (`WorkflowNodeData` has title/summary plus type-specific fields like assignee, approverRole, actionParams).
- Custom nodes show title/summary and key metadata; minimal CSS for readability on dark background.
- Validation before simulation prevents bad graphs from hitting the API.
- MSW responses stay simple and synchronous to keep iteration fast.

## What’s left / next
- Persist workflows (save/load) to real backend.
- Add edge labels/conditions and richer validation (disconnected components, parallel branches).
- Support versioning and templates for reusable flows.
- Expand simulation to return per-node results and durations; stream updates.
- Add tests (component + hooks) and CI lint/format steps.

