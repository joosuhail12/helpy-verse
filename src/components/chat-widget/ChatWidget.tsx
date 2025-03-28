
import React, { useState, useEffect } from 'react';
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
  
  // Apply theme CSS variables
  useEffect(() => {
    if (theme) {
      const root = document.documentElement;
      
      // Set colors as CSS variables
      if (theme.colors) {
        root.style.setProperty('--primary-color', theme.colors.primary);
        root.style.setProperty('--primary-foreground-color', theme.colors.primaryForeground);
        root.style.setProperty('--background-color', theme.colors.background);
        root.style.setProperty('--foreground-color', theme.colors.foreground);
        root.style.setProperty('--border-color', theme.colors.border);
        root.style.setProperty('--user-message-color', theme.colors.userMessage);
        root.style.setProperty('--user-message-text-color', theme.colors.userMessageText);
        root.style.setProperty('--agent-message-color', theme.colors.agentMessage);
        root.style.setProperty('--agent-message-text-color', theme.colors.agentMessageText);
        root.style.setProperty('--input-background-color', theme.colors.inputBackground);
        root.style.setProperty('--primary-dark-color', theme.colors.primaryDark);
        
        if (theme.colors.headerBackground) {
          root.style.setProperty('--header-background-color', theme.colors.headerBackground);
        }
        if (theme.colors.headerForeground) {
          root.style.setProperty('--header-foreground-color', theme.colors.headerForeground);
        }
        if (theme.colors.navigationBackground) {
          root.style.setProperty('--navigation-background-color', theme.colors.navigationBackground);
        }
        if (theme.colors.navigationForeground) {
          root.style.setProperty('--navigation-foreground-color', theme.colors.navigationForeground);
        }
        if (theme.colors.error) {
          root.style.setProperty('--error-color', theme.colors.error);
        }
        if (theme.colors.errorForeground) {
          root.style.setProperty('--error-foreground-color', theme.colors.errorForeground);
        }
      }
      
      // Set radius
      if (theme.radius) {
        let radiusValue = '0.5rem';
        switch (theme.radius) {
          case 'none': radiusValue = '0'; break;
          case 'sm': radiusValue = 'var(--radius-sm)'; break;
          case 'md': radiusValue = 'var(--radius-md)'; break;
          case 'lg': radiusValue = 'var(--radius-lg)'; break;
          case 'full': radiusValue = '9999px'; break;
        }
        root.style.setProperty('--radius-value', radiusValue);
      }
      
      // Set shadow
      if (theme.shadow) {
        let shadowValue = '0 4px 12px rgba(0, 0, 0, 0.15)';
        switch (theme.shadow) {
          case 'none': shadowValue = 'none'; break;
          case 'sm': shadowValue = 'var(--shadow-sm)'; break;
          case 'md': shadowValue = 'var(--shadow-md)'; break;
          case 'lg': shadowValue = 'var(--shadow-lg)'; break;
          case 'xl': shadowValue = '0 20px 25px rgba(0, 0, 0, 0.15)'; break;
        }
        root.style.setProperty('--shadow-value', shadowValue);
      }
      
      // Set animation speed
      if (theme.animation?.speed) {
        let animationDuration = '0.3s';
        switch (theme.animation.speed) {
          case 'slow': animationDuration = 'var(--animation-slow)'; break;
          case 'normal': animationDuration = 'var(--animation-normal)'; break;
          case 'fast': animationDuration = 'var(--animation-fast)'; break;
        }
        root.style.setProperty('--animation-duration', animationDuration);
        root.style.setProperty('--animation-speed', animationDuration);
      }
      
      // Set custom font
      if (theme.fontFamily) {
        root.style.setProperty('--font-family', theme.fontFamily);
      }
    }
    
    return () => {
      // Clean up custom CSS variables when component unmounts
      const root = document.documentElement;
      root.style.removeProperty('--primary-color');
      root.style.removeProperty('--primary-foreground-color');
      root.style.removeProperty('--background-color');
      root.style.removeProperty('--foreground-color');
      root.style.removeProperty('--border-color');
      root.style.removeProperty('--user-message-color');
      root.style.removeProperty('--user-message-text-color');
      root.style.removeProperty('--agent-message-color');
      root.style.removeProperty('--agent-message-text-color');
      root.style.removeProperty('--input-background-color');
      root.style.removeProperty('--primary-dark-color');
      root.style.removeProperty('--header-background-color');
      root.style.removeProperty('--header-foreground-color');
      root.style.removeProperty('--navigation-background-color');
      root.style.removeProperty('--navigation-foreground-color');
      root.style.removeProperty('--error-color');
      root.style.removeProperty('--error-foreground-color');
      root.style.removeProperty('--radius-value');
      root.style.removeProperty('--shadow-value');
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--animation-speed');
      root.style.removeProperty('--font-family');
    };
  }, [theme]);

  const toggleWidget = () => {
    setIsOpen((prev) => !prev);
  };

  // Determine animation type based on theme settings
  const getAnimationProps = () => {
    const animationType = theme.animation?.type || 'fade';
    
    switch (animationType) {
      case 'slide':
        return {
          initial: { x: theme.position === 'left' ? -20 : 20, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: theme.position === 'left' ? -20 : 20, opacity: 0 },
        };
      case 'scale':
        return {
          initial: { scale: 0.95, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.95, opacity: 0 },
        };
      case 'none':
        return {
          initial: { opacity: 1 },
          animate: { opacity: 1 },
          exit: { opacity: 1 },
        };
      case 'fade':
      default:
        return {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 20 },
        };
    }
  };

  const animationProps = getAnimationProps();
  const animationDuration = theme.animation?.speed === 'slow' ? 0.5 : 
                            theme.animation?.speed === 'fast' ? 0.15 : 0.2;

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
                  {...animationProps}
                  transition={{ duration: animationDuration }}
                  className={`mb-3 ${theme.compact ? 'w-72' : 'w-80 sm:w-96'} h-[600px] rounded-xl shadow-2xl overflow-hidden border`}
                  style={{ 
                    borderColor: theme.colors?.border,
                    backgroundColor: theme.colors?.background,
                    boxShadow: `0 10px 25px rgba(0, 0, 0, 0.1)`
                  }}
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
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors`}
              aria-label={isOpen ? 'Close chat' : 'Open chat'}
              style={{ 
                backgroundColor: isOpen ? (theme.colors?.error || '#ef4444') : theme.colors?.primary 
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
