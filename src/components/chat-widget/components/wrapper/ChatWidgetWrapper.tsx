
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
      className={`fixed bottom-4 z-50 flex flex-col items-end`} 
      style={{ 
        [position === 'left' ? 'left' : 'right']: '1rem',
        alignItems: position === 'left' ? 'flex-start' : 'flex-end' 
      }}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`mb-3 ${compact ? 'w-72' : 'w-80 sm:w-96'} h-[600px] bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200`}
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
