
import React, { useState, useEffect } from 'react';
import { ChatProvider } from '@/context/ChatContext';
import { AblyProvider } from '@/context/AblyContext';
import { ThemeProvider, ThemeConfig } from '@/context/ThemeContext';
import ToggleButton from './components/button/ToggleButton';
import { Loader2 } from 'lucide-react';
import '@/styles/chat-widget-theme.css';
import { useWidgetState } from './context/WidgetStateContext';
import ChatWidgetWrapper from './components/wrapper/ChatWidgetWrapper';
import ChatWidgetContainer from './container/ChatWidgetContainer';
import { ChatWidgetSettings } from './types';

interface ChatWidgetProps {
  workspaceId: string;
  theme?: Partial<ThemeConfig>;
  settings?: Partial<ChatWidgetSettings>;
  standalone?: boolean;
  instanceId?: string;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ 
  workspaceId, 
  theme = {}, 
  settings,
  standalone = false,
  instanceId = 'default'
}) => {
  const { state, dispatch } = useWidgetState();
  const isOpen = state.isOpen;

  // Apply settings to theme if provided
  const combinedTheme: Partial<ThemeConfig> = {
    ...theme,
    // Override with settings if provided
    ...(settings?.appearance && {
      position: settings.appearance.position,
      compact: settings.appearance.compact,
      colors: {
        ...theme.colors,
        primary: settings.appearance.primaryColor
      },
      labels: {
        ...theme.labels,
        welcomeTitle: settings.content?.welcomeTitle,
        welcomeSubtitle: settings.content?.welcomeSubtitle
      },
      features: {
        typingIndicator: settings.features?.enableTypingIndicator,
        reactions: settings.features?.enableReactions,
        fileAttachments: settings.features?.enableFileAttachments,
        readReceipts: settings.features?.enableReadReceipts
      }
    })
  };

  const toggleWidget = () => {
    dispatch({ type: 'TOGGLE_WIDGET' });
    
    // Dispatch event for external listeners with instance ID to avoid cross-talk
    window.dispatchEvent(new CustomEvent(
      state.isOpen ? `chat-widget-close-${instanceId}` : `chat-widget-open-${instanceId}`
    ));
  };

  const position = combinedTheme.position === 'left' ? 'left' : 'right';

  // Setup event listeners for external control
  React.useEffect(() => {
    // Use instance-specific event names
    const openEventName = `chat-widget-open-${instanceId}`;
    const closeEventName = `chat-widget-close-${instanceId}`;
    const toggleEventName = `chat-widget-toggle-${instanceId}`;
    
    const handleOpen = () => dispatch({ type: 'OPEN_WIDGET' });
    const handleClose = () => dispatch({ type: 'CLOSE_WIDGET' });
    const handleToggle = () => dispatch({ type: 'TOGGLE_WIDGET' });
    
    window.addEventListener(openEventName, handleOpen);
    window.addEventListener(closeEventName, handleClose);
    window.addEventListener(toggleEventName, handleToggle);
    
    return () => {
      window.removeEventListener(openEventName, handleOpen);
      window.removeEventListener(closeEventName, handleClose);
      window.removeEventListener(toggleEventName, handleToggle);
    };
  }, [dispatch, instanceId]);

  // Initialize widget state with configuration
  useEffect(() => {
    if (workspaceId && !state.isInitialized) {
      dispatch({ 
        type: 'INITIALIZE', 
        payload: {
          workspaceId,
          theme: combinedTheme,
          settings
        }
      });
    }
  }, [workspaceId, combinedTheme, settings, dispatch, state.isInitialized]);

  return (
    <AblyProvider workspaceId={workspaceId}>
      <ChatProvider workspaceId={workspaceId}>
        <ThemeProvider initialTheme={combinedTheme}>
          <div className={`fixed z-[9999] ${position === 'left' ? 'left-4' : 'right-4'}`}>
            {isOpen && (
              <div className="mb-4">
                <ChatWidgetWrapper 
                  isOpen={isOpen}
                  position={position}
                  compact={Boolean(combinedTheme.compact)}
                >
                  <ChatWidgetContainer 
                    onClose={() => dispatch({ type: 'CLOSE_WIDGET' })} 
                    workspaceId={workspaceId} 
                    position={position}
                    compact={Boolean(combinedTheme.compact)}
                    instanceId={instanceId}
                  />
                </ChatWidgetWrapper>
              </div>
            )}
            <div className="bottom-4">
              <ToggleButton 
                isOpen={isOpen} 
                onClick={toggleWidget} 
              />
            </div>
          </div>
        </ThemeProvider>
      </ChatProvider>
    </AblyProvider>
  );
};
