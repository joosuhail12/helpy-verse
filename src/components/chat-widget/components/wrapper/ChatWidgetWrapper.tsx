
import React from 'react';
import { useThemeContext } from '@/context/ThemeContext';
import { motion } from 'framer-motion';

interface ChatWidgetWrapperProps {
  children: React.ReactNode;
  isOpen: boolean;
  position: 'left' | 'right';
  compact?: boolean;
}

const ChatWidgetWrapper: React.FC<ChatWidgetWrapperProps> = ({ 
  children, 
  isOpen, 
  position,
  compact = false
}) => {
  const { colors } = useThemeContext();
  
  const variants = {
    open: { 
      opacity: 1, 
      y: 0,
      scale: 1
    },
    closed: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
  };
  
  return (
    <motion.div
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      variants={variants}
      transition={{ duration: 0.2 }}
      className="overflow-hidden rounded-xl shadow-lg"
      style={{ 
        width: compact ? '320px' : '380px',
        maxWidth: '100%',
        height: compact ? '500px' : '600px',
        maxHeight: '80vh',
        backgroundColor: colors.background,
        border: `1px solid ${colors.border}`,
      }}
    >
      {children}
    </motion.div>
  );
};

export default ChatWidgetWrapper;
