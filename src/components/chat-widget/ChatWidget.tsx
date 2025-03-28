
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

  const combinedTheme: Partial<ThemeConfig> = {
    ...theme,
    position: settings?.position || theme.position,
    compact: settings?.compact || theme.compact,
    colors: {
      ...theme.colors,
      primary: settings?.primaryColor || theme.colors?.primary,
      background: settings?.colors?.background || theme.colors?.background,
      backgroundSecondary: settings?.colors?.backgroundSecondary || theme.colors?.backgroundSecondary,
      foreground: settings?.colors?.foreground || theme.colors?.foreground,
      border: settings?.colors?.border || theme.colors?.border,
      userMessage: settings?.colors?.userMessage?.background || theme.colors?.userMessage,
      userMessageText: settings?.colors?.userMessage?.text || theme.colors?.userMessageText,
      agentMessage: settings?.colors?.agentMessage?.background || theme.colors?.agentMessage,
      agentMessageText: settings?.colors?.agentMessage?.text || theme.colors?.agentMessageText,
      inputBackground: settings?.colors?.input?.background || theme.colors?.inputBackground,
    }
  };

  // Add typography and layout from settings if available
  if (settings?.typography) {
    combinedTheme.typography = {
      ...theme.typography,
      fontFamily: settings.typography.fontFamily || theme.typography?.fontFamily,
      fontSize: settings.typography.fontSize || theme.typography?.fontSize,
    };
  }

  if (settings?.layout) {
    combinedTheme.layout = {
      ...theme.layout,
      borderRadius: settings.layout.borderRadius || theme.layout?.borderRadius,
      spacing: settings.layout.spacing || theme.layout?.spacing,
    };
  }

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
                    position={combinedTheme.position === 'left' ? 'left' : 'right'} 
                    compact={Boolean(combinedTheme.compact)}
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
