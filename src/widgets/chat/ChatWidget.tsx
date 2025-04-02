
import React, { useState, Suspense, lazy } from 'react';
import { ChatProvider } from '@/context/ChatContext';
import { AblyProvider } from '@/context/AblyContext';
import { ThemeProvider, ThemeConfig } from '@/context/ThemeContext';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';
import ToggleButton from './components/button/ToggleButton';
import { Loader2 } from 'lucide-react';
import '@/styles/chat-widget-theme.css';
import { MotionConfig } from 'framer-motion';

// Lazy load the widget container
const ChatWidgetWrapper = lazy(() => import('./components/wrapper/ChatWidgetWrapper'));
const ChatWidgetContainer = lazy(() => import('./container/ChatWidgetContainer'));

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
  const [isOpen, setIsOpen] = useState(false);

  // Apply settings to theme if provided
  const combinedTheme: Partial<ThemeConfig> = {
    ...theme,
    // Override with settings if provided
    ...(settings?.appearance && {
      position: 'right', // Force right positioning
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
    setIsOpen((prev) => !prev);
  };

  return (
    <AblyProvider workspaceId={workspaceId}>
      <ChatProvider workspaceId={workspaceId}>
        <ThemeProvider initialTheme={combinedTheme}>
          <MotionConfig>
            <div className="fixed bottom-4 right-4 z-[9999] flex flex-col items-end">
              {isOpen && (
                <Suspense fallback={
                  <div className="rounded-xl shadow-lg bg-white p-4 mb-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                }>
                  <div className="mb-4">
                    <ChatWidgetWrapper 
                      isOpen={isOpen}
                      position="right"
                      compact={Boolean(combinedTheme.compact)}
                    >
                      <ChatWidgetContainer 
                        onClose={() => setIsOpen(false)} 
                        workspaceId={workspaceId} 
                        position="right"
                        compact={Boolean(combinedTheme.compact)}
                        instanceId={instanceId}
                      />
                    </ChatWidgetWrapper>
                  </div>
                </Suspense>
              )}
              <div>
                <ToggleButton 
                  isOpen={isOpen} 
                  onClick={toggleWidget} 
                />
              </div>
            </div>
          </MotionConfig>
        </ThemeProvider>
      </ChatProvider>
    </AblyProvider>
  );
};
