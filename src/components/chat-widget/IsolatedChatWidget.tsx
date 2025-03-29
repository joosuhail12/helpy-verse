
import React, { useState, Suspense, lazy, useEffect } from 'react';
import { ChatProvider } from '@/context/ChatContext';
import { AblyProvider } from '@/context/AblyContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ChatWidgetProvider, useChatWidget } from '@/context/ChatWidgetContext';
import { ChatWidgetConfig } from '@/api/chat-widget/types';
import ToggleButton from './components/button/ToggleButton';
import { Loader2 } from 'lucide-react';
import '@/styles/chat-widget-theme.css';

// Lazy load the widget container
const ChatWidgetWrapper = lazy(() => import('./components/wrapper/ChatWidgetWrapper'));
const ChatWidgetContainer = lazy(() => import('./container/ChatWidgetContainer'));

interface IsolatedChatWidgetProps {
  workspaceId: string;
  config?: Partial<ChatWidgetConfig>;
}

// Inner component that has access to context
const ChatWidgetInner: React.FC = () => {
  const { state, dispatch } = useChatWidget();
  
  const toggleWidget = () => {
    dispatch({ type: 'TOGGLE_WIDGET' });
  };

  const position = state.theme.position;
  const compact = state.theme.compact;

  return (
    <>
      {state.isOpen && (
        <Suspense fallback={
          <div className={`fixed bottom-20 ${position === 'left' ? 'left-4' : 'right-4'} rounded-xl shadow-lg bg-white p-4 z-50`}>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }>
          <ChatWidgetWrapper 
            isOpen={state.isOpen}
            position={position}
            compact={compact}
          >
            <ChatWidgetContainer 
              onClose={() => dispatch({ type: 'CLOSE_WIDGET' })} 
              workspaceId={state.config?.workspaceId || ''} 
              position={position}
              compact={compact}
            />
          </ChatWidgetWrapper>
        </Suspense>
      )}
      <div className={`fixed bottom-4 z-50 ${position === 'left' ? 'left-4' : 'right-4'}`}>
        <ToggleButton 
          isOpen={state.isOpen} 
          onClick={toggleWidget} 
        />
      </div>
    </>
  );
};

// Main component that provides context
export const IsolatedChatWidget: React.FC<IsolatedChatWidgetProps> = ({ 
  workspaceId, 
  config 
}) => {
  const [initialized, setInitialized] = useState(false);

  // Initialize configuration on mount
  useEffect(() => {
    if (!initialized && workspaceId) {
      setInitialized(true);
    }
  }, [workspaceId, initialized]);

  if (!workspaceId) {
    console.error('Chat widget requires a workspace ID');
    return null;
  }

  const defaultConfig: ChatWidgetConfig = {
    workspaceId,
    theme: {
      colors: {
        primary: '#9b87f5',
      },
      position: 'right',
      compact: false
    },
    labels: {
      welcomeTitle: 'Hello there',
      welcomeSubtitle: 'How can we help you today?'
    },
    features: {
      typingIndicator: true,
      fileAttachments: true
    }
  };

  // Merge default config with provided config
  const mergedConfig: ChatWidgetConfig = {
    ...defaultConfig,
    ...config,
    theme: {
      ...defaultConfig.theme,
      ...(config?.theme || {}),
      colors: {
        ...(defaultConfig.theme?.colors || {}),
        ...(config?.theme?.colors || {})
      }
    },
    labels: {
      ...(defaultConfig.labels || {}),
      ...(config?.labels || {})
    },
    features: {
      ...(defaultConfig.features || {}),
      ...(config?.features || {})
    }
  };

  return (
    <ChatWidgetProvider>
      <AblyProvider workspaceId={workspaceId}>
        <ChatProvider workspaceId={workspaceId}>
          <ThemeProvider initialTheme={mergedConfig.theme}>
            <ChatWidgetInner />
          </ThemeProvider>
        </ChatProvider>
      </AblyProvider>
    </ChatWidgetProvider>
  );
};

export default IsolatedChatWidget;
