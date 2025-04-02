
import React from 'react';
import { useThemeContext } from '@/context/ThemeContext';

interface ChatWidgetWrapperProps {
  children: React.ReactNode;
  isOpen: boolean;
  position: 'left' | 'right';
  compact: boolean;
}

const ChatWidgetWrapper: React.FC<ChatWidgetWrapperProps> = ({
  children,
  isOpen,
  position,
  compact
}) => {
  const { colors } = useThemeContext();
  
  if (!isOpen) return null;
  
  return (
    <div 
      className={`rounded-xl shadow-lg overflow-hidden flex flex-col ${compact ? 'h-[480px]' : 'h-[560px]'}`}
      style={{ 
        backgroundColor: colors.background,
        border: `1px solid ${colors.border}`,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
      }}
    >
      {children}
    </div>
  );
};

export default ChatWidgetWrapper;
