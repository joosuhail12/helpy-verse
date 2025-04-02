
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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="w-full rounded-lg shadow-lg overflow-hidden"
          style={{ 
            borderColor: colors?.border,
            height: '500px',
            maxHeight: 'calc(100vh - 100px)',
            backgroundColor: colors?.background || 'white'
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatWidgetWrapper;
