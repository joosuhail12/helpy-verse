
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, MessageSquare } from 'lucide-react';
import { ChatProvider } from '@/context/ChatContext';
import { AblyProvider } from '@/context/AblyContext';
import { ThemeProvider, ThemeConfig } from '@/context/ThemeContext';
import ChatWidgetContainer from './container/ChatWidgetContainer';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';

interface ChatWidgetProps {
  workspaceId: string;
  theme?: Partial<ThemeConfig>;
  settings?: Partial<ChatWidgetSettings>;
  isPreview?: boolean;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ 
  workspaceId, 
  theme = {}, 
  settings,
  isPreview = false
}) => {
  const [isOpen, setIsOpen] = useState(isPreview);

  const combinedTheme: ThemeConfig = {
    position: settings?.position || theme.position || 'right',
    compact: settings?.compact || theme.compact || false,
    colors: {
      primary: settings?.primaryColor || theme.colors?.primary || '#9b87f5',
      background: settings?.colors?.background || theme.colors?.background || '#ffffff',
      backgroundSecondary: settings?.colors?.backgroundSecondary || theme.colors?.backgroundSecondary || '#f9f9f9',
      foreground: settings?.colors?.foreground || theme.colors?.foreground || '#1A1F2C',
      border: settings?.colors?.border || theme.colors?.border || '#eaeaea',
      userMessage: settings?.colors?.userMessage?.background || theme.colors?.userMessage || '#9b87f5',
      userMessageText: settings?.colors?.userMessage?.text || theme.colors?.userMessageText || '#ffffff',
      agentMessage: settings?.colors?.agentMessage?.background || theme.colors?.agentMessage || '#f1f1f1',
      agentMessageText: settings?.colors?.agentMessage?.text || theme.colors?.agentMessageText || '#1A1F2C',
      inputBackground: settings?.colors?.input?.background || theme.colors?.inputBackground || '#ffffff',
      primaryForeground: settings?.colors?.button?.text || '#ffffff',
    },
    typography: {
      fontFamily: settings?.typography?.fontFamily || theme.typography?.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
      fontSize: {
        small: settings?.typography?.fontSize?.small || theme.typography?.fontSize?.small || '12px',
        medium: settings?.typography?.fontSize?.medium || theme.typography?.fontSize?.medium || '14px',
        large: settings?.typography?.fontSize?.large || theme.typography?.fontSize?.large || '16px',
      },
    },
    layout: {
      borderRadius: {
        small: settings?.layout?.borderRadius?.small || theme.layout?.borderRadius?.small || '4px',
        medium: settings?.layout?.borderRadius?.medium || theme.layout?.borderRadius?.medium || '8px',
        large: settings?.layout?.borderRadius?.large || theme.layout?.borderRadius?.large || '12px',
      },
      spacing: {
        small: settings?.layout?.spacing?.small || theme.layout?.spacing?.small || '4px',
        medium: settings?.layout?.spacing?.medium || theme.layout?.spacing?.medium || '8px',
        large: settings?.layout?.spacing?.large || theme.layout?.spacing?.large || '16px',
      },
    },
    labels: {
      welcomeTitle: settings?.welcomeTitle || theme.labels?.welcomeTitle || 'Hello there.',
      welcomeSubtitle: settings?.welcomeSubtitle || theme.labels?.welcomeSubtitle || 'How can we help?',
      askQuestionButton: theme.labels?.askQuestionButton || 'Ask a question',
      recentMessagesTitle: theme.labels?.recentMessagesTitle || 'Recent Messages',
      noMessagesText: theme.labels?.noMessagesText || 'No messages yet',
    },
  };

  const toggleWidget = () => {
    setIsOpen((prev) => !prev);
  };

  const previewStyles = isPreview ? {
    position: 'relative' as const,
    bottom: 'auto',
    right: 'auto',
    left: 'auto',
    zIndex: 10,
  } : {};

  return (
    <AblyProvider workspaceId={workspaceId}>
      <ChatProvider workspaceId={workspaceId}>
        <ThemeProvider initialTheme={combinedTheme}>
          <div 
            className={`${isPreview ? '' : 'fixed bottom-4'} z-50 flex flex-col items-end`} 
            style={{ 
              [combinedTheme.position === 'left' ? 'left' : 'right']: isPreview ? 'auto' : '1rem',
              alignItems: combinedTheme.position === 'left' ? 'flex-start' : 'flex-end',
              ...previewStyles,
              width: isPreview ? '100%' : 'auto',
              height: isPreview ? '100%' : 'auto',
            }}
          >
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`mb-3 ${combinedTheme.compact ? 'w-72' : 'w-80 sm:w-96'} h-[600px] bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200`}
                  style={{ 
                    height: isPreview ? '100%' : '600px',
                    width: isPreview ? '100%' : combinedTheme.compact ? '18rem' : '24rem',
                    backgroundColor: combinedTheme.colors?.background || 'white',
                    borderColor: combinedTheme.colors?.border || '#eaeaea'
                  }}
                >
                  <ChatWidgetContainer 
                    onClose={() => setIsOpen(false)} 
                    workspaceId={workspaceId} 
                    position={combinedTheme.position} 
                    compact={combinedTheme.compact}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            {!isPreview && (
              <button
                onClick={toggleWidget}
                className={`${
                  isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'
                } w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors`}
                aria-label={isOpen ? 'Close chat' : 'Open chat'}
                style={{ 
                  backgroundColor: isOpen ? '#ef4444' : combinedTheme.colors?.primary 
                }}
              >
                {isOpen ? (
                  <X className="h-6 w-6 text-white" />
                ) : (
                  <MessageSquare className="h-6 w-6 text-white" />
                )}
              </button>
            )}
          </div>
        </ThemeProvider>
      </ChatProvider>
    </AblyProvider>
  );
};
