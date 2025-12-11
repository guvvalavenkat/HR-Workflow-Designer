import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/global.css';
import 'react-flow-renderer/dist/style.css';

const root = document.getElementById('app');

if (!root) {
  throw new Error('Root container missing');
}

// Render app immediately with error boundary
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);

// Initialize MSW in background (non-blocking)
if (import.meta.env.DEV) {
  import('./api/mocks/browser')
    .then(({ worker }) => worker.start({ onUnhandledRequest: 'bypass' }))
    .catch((error) => console.warn('MSW initialization failed:', error));
}

