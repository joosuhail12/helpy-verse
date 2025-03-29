
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ThemeProvider } from './context/ThemeContext';
import { ChatProvider } from './context/ChatContext';
import { AblyProvider } from './context/AblyContext';
import ChatWidgetStandalone from './components/chat-widget/ChatWidgetStandalone';
import './index.css';
import './styles/chat-widget-theme.css';

// Get configuration from window object or use defaults
const config = (window as any).PULLSE_CHAT_CONFIG || {
  workspaceId: '6c22b22f-7bdf-43db-b7c1-9c5884125c63',
  theme: {
    colors: { primary: '#9b87f5' },
    position: 'right',
    compact: false,
    labels: {
      welcomeTitle: 'Hello there.',
      welcomeSubtitle: 'How can we help?'
    }
  }
};

// Create an isolated root for the widget
const container = document.getElementById('chat-widget-root');
if (!container) {
  console.error('Chat widget container not found');
} else {
  const root = createRoot(container);

  root.render(
    <Provider store={store}>
      <ThemeProvider initialTheme={config.theme}>
        <AblyProvider workspaceId={config.workspaceId}>
          <ChatProvider workspaceId={config.workspaceId}>
            <ChatWidgetStandalone 
              workspaceId={config.workspaceId}
            />
          </ChatProvider>
        </AblyProvider>
      </ThemeProvider>
    </Provider>
  );
}

// Expose a global API for the widget
(window as any).PULLSE_CHAT = {
  open: () => {
    const event = new CustomEvent('pullse-chat-toggle', { detail: { open: true } });
    window.dispatchEvent(event);
  },
  close: () => {
    const event = new CustomEvent('pullse-chat-toggle', { detail: { open: false } });
    window.dispatchEvent(event);
  },
  toggle: () => {
    const event = new CustomEvent('pullse-chat-toggle', { detail: { toggle: true } });
    window.dispatchEvent(event);
  }
};
