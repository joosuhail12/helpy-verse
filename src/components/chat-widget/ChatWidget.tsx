
import React, { useState } from 'react';
import { ChatProvider } from '@/context/ChatContext';
import { AblyProvider } from '@/context/AblyContext';
import { ThemeProvider, ThemeConfig } from '@/context/ThemeContext';
import ChatWidgetContainer from './container/ChatWidgetContainer';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';
import ToggleButton from './components/button/ToggleButton';
import ChatWidgetWrapper from './components/wrapper/ChatWidgetWrapper';

interface ChatWidgetProps {
  workspaceId: string;
  theme?: Partial<ThemeConfig>;
  settings?: Partial<ChatWidgetSettings>;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ 
  workspaceId, 
  theme = {}, 
  settings
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Apply settings to theme if provided
  const combinedTheme: Partial<ThemeConfig> = {
    ...theme,
    // Override with settings if provided
    ...(settings && {
      position: settings.position,
      compact: settings.compact,
      colors: {
        ...theme.colors,
        primary: settings.primaryColor
      },
      labels: {
        ...theme.labels,
        welcomeTitle: settings.welcomeTitle,
        welcomeSubtitle: settings.welcomeSubtitle
      },
      features: {
        typingIndicator: settings.enableTypingIndicator,
        reactions: settings.enableReactions,
        fileAttachments: settings.enableFileAttachments,
        readReceipts: settings.enableReadReceipts
      }
    })
  };

  const toggleWidget = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <AblyProvider workspaceId={workspaceId}>
      <ChatProvider workspaceId={workspaceId}>
        <ThemeProvider initialTheme={combinedTheme}>
          <ChatWidgetWrapper 
            isOpen={isOpen}
            position={combinedTheme.position === 'left' ? 'left' : 'right'}
            compact={Boolean(combinedTheme.compact)}
          >
            <ChatWidgetContainer 
              onClose={() => setIsOpen(false)} 
              workspaceId={workspaceId} 
              position={combinedTheme.position === 'left' ? 'left' : 'right'} 
              compact={Boolean(combinedTheme.compact)}
            />
          </ChatWidgetWrapper>
          <div className={`fixed bottom-4 z-50`} 
            style={{ 
              [combinedTheme.position === 'left' ? 'left' : 'right']: '1rem'
            }}
          >
            <ToggleButton 
              isOpen={isOpen} 
              onClick={toggleWidget} 
            />
          </div>
        </ThemeProvider>
      </ChatProvider>
    </AblyProvider>
  );
};
