
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import AppProviders from './components/app/AppProviders';
import { WidgetStateProvider } from './context/WidgetContext';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <AppProviders>
      <WidgetStateProvider>
        <App />
      </WidgetStateProvider>
    </AppProviders>
  </React.StrictMode>
);
