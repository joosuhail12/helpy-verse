
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

  // Initialize widget with provided settings
  useEffect(() => {
    dispatch({
      type: 'INITIALIZE',
      payload: { 
        workspaceId, 
        theme: {
          position: 'right', // Force right positioning
          ...theme
        },
        settings
      }
    });
  }, [workspaceId, dispatch]);

  // Override theme settings to ensure right positioning
  const combinedTheme: Partial<ThemeConfig> = {
    ...theme,
    position: 'right', // Force right positioning
    ...(settings?.appearance && {
      position: 'right',
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
  };

  return (
    <AblyProvider workspaceId={workspaceId}>
      <ChatProvider workspaceId={workspaceId}>
        <ThemeProvider initialTheme={combinedTheme}>
          <div className="fixed bottom-4 right-4 z-50">
            {isOpen && (
              <ChatWidgetWrapper 
                isOpen={isOpen}
                position="right"
                compact={Boolean(combinedTheme.compact)}
              >
                <ChatWidgetContainer 
                  onClose={() => dispatch({ type: 'CLOSE_WIDGET' })} 
                  workspaceId={workspaceId} 
                  position="right"
                  compact={Boolean(combinedTheme.compact)}
                />
              </ChatWidgetWrapper>
            )}
            <div className="mt-2">
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
