
import React from 'react';
import ReactDOM from 'react-dom/client';
import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import './index.css';

// Lazy load the standalone chat widget component
const ChatWidgetStandalone = lazy(() => 
  import('./components/chat-widget/ChatWidgetStandalone')
);

// Loading indicator component
const LoadingIndicator = () => (
  <div className="flex h-full w-full items-center justify-center bg-transparent">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Create a shadow DOM for the widget to isolate its styles
const createWidgetContainer = () => {
  const chatWidgetContainer = document.getElementById('pullse-chat-widget');
  
  if (!chatWidgetContainer) return null;

  // If Shadow DOM is supported, use it for complete style isolation
  if (chatWidgetContainer.attachShadow) {
    const shadowRoot = chatWidgetContainer.attachShadow({ mode: 'open' });
    
    // Create a container for React to render into
    const reactContainer = document.createElement('div');
    reactContainer.id = 'pullse-chat-widget-root';
    shadowRoot.appendChild(reactContainer);
    
    // Add stylesheet to shadow DOM
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = `${window.location.origin}/chat-widget.css`;
    shadowRoot.appendChild(linkElement);
    
    return reactContainer;
  } else {
    // Fallback for browsers that don't support Shadow DOM
    const reactContainer = document.createElement('div');
    reactContainer.id = 'pullse-chat-widget-root';
    reactContainer.classList.add('pullse-chat-widget-isolated');
    chatWidgetContainer.appendChild(reactContainer);
    return reactContainer;
  }
};

// Initialize React for the standalone widget
const renderTarget = createWidgetContainer();

if (renderTarget) {
  ReactDOM.createRoot(renderTarget).render(
    <React.StrictMode>
      <Suspense fallback={<LoadingIndicator />}>
        <ChatWidgetStandalone />
      </Suspense>
    </React.StrictMode>
  );
}
