
import React from 'react';
import { useThemeContext } from '@/context/ThemeContext';
import { AnimatePresence, motion } from 'framer-motion';

interface ChatWidgetWrapperProps {
  isOpen: boolean;
  position?: 'left' | 'right';
  compact?: boolean;
  children: React.ReactNode;
}

/**
 * Wrapper component that handles positioning and animation of the chat widget
 */
const ChatWidgetWrapper: React.FC<ChatWidgetWrapperProps> = ({ 
  isOpen, 
  position = 'right',
  compact = false,
  children 
}) => {
  const { colors } = useThemeContext();

  return (
    <div 
      className={`chat-widget-container ${position === 'left' 
        ? 'chat-widget-container-left' 
        : 'chat-widget-container-right'}`}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`chat-widget-main ${compact ? 'chat-widget-main-compact' : 'chat-widget-main-full'}`}
            style={{ borderColor: colors?.border }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatWidgetWrapper;
