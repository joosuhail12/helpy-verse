
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
    setIsOpen((prev) => !prev);
  };

  const position = combinedTheme.position === 'left' ? 'left' : 'right';

  return (
    <AblyProvider workspaceId={workspaceId}>
      <ChatProvider workspaceId={workspaceId}>
        <ThemeProvider initialTheme={combinedTheme}>
          <MotionConfig>
            <div className={`fixed z-[9999] ${position === 'left' ? 'left-4' : 'right-4'}`}>
              {isOpen && (
                <Suspense fallback={
                  <div className="rounded-xl shadow-lg bg-white p-4 mb-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                }>
                  <div className="mb-4">
                    <ChatWidgetWrapper 
                      isOpen={isOpen}
                      position={position}
                      compact={Boolean(combinedTheme.compact)}
                    >
                      <ChatWidgetContainer 
                        onClose={() => setIsOpen(false)} 
                        workspaceId={workspaceId} 
                        position={position}
                        compact={Boolean(combinedTheme.compact)}
                      />
                    </ChatWidgetWrapper>
                  </div>
                </Suspense>
              )}
              <div className="bottom-4">
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
