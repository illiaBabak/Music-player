import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import { App } from './root';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const root = document.getElementById('root');
const queryClient = new QueryClient();

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </React.StrictMode>
  );
}
