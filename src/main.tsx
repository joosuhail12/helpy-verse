
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { WidgetStateProvider } from './context/WidgetContext';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <WidgetStateProvider>
      <App />
    </WidgetStateProvider>
  </React.StrictMode>
);
