
import React from 'react';
import ReactDOM from 'react-dom/client';
import ChatWidgetStandalone from './components/chat-widget/ChatWidgetStandalone';
import './index.css';

// Initialize React for the standalone widget
const chatWidgetContainer = document.getElementById('pullse-chat-widget');

if (chatWidgetContainer) {
  ReactDOM.createRoot(chatWidgetContainer).render(
    <React.StrictMode>
      <ChatWidgetStandalone />
    </React.StrictMode>
  );
}
