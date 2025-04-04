
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, MessageSquare } from 'lucide-react';
import { ChatProvider } from '@/context/ChatContext';
import { AblyProvider } from '@/context/AblyContext';
import { ThemeProvider, ThemeConfig } from '@/context/ThemeContext';
import ChatWidgetContainer from './container/ChatWidgetContainer';

interface ChatWidgetProps {
  workspaceId: string;
  theme?: Partial<ThemeConfig>;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ workspaceId, theme = {} }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleWidget = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <AblyProvider workspaceId={workspaceId}>
      <ChatProvider workspaceId={workspaceId}>
        <ThemeProvider initialTheme={theme}>
          <div className={`fixed bottom-4 z-50 flex flex-col items-end`} 
            style={{ 
              [theme.position === 'left' ? 'left' : 'right']: '1rem',
              alignItems: theme.position === 'left' ? 'flex-start' : 'flex-end' 
            }}
          >
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`mb-3 ${theme.compact ? 'w-72' : 'w-80 sm:w-96'} h-[600px] bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200`}
                >
                  <ChatWidgetContainer 
                    onClose={() => setIsOpen(false)} 
                    workspaceId={workspaceId} 
                    position={theme.position === 'left' ? 'left' : 'right'} 
                    compact={Boolean(theme.compact)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            <button
              onClick={toggleWidget}
              className={`${
                isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'
              } w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors`}
              aria-label={isOpen ? 'Close chat' : 'Open chat'}
              style={{ 
                backgroundColor: isOpen ? '#ef4444' : theme.colors?.primary 
              }}
            >
              {isOpen ? (
                <X className="h-6 w-6 text-white" />
              ) : (
                <MessageSquare className="h-6 w-6 text-white" />
              )}
            </button>
          </div>
        </ThemeProvider>
      </ChatProvider>
    </AblyProvider>
  );
};
