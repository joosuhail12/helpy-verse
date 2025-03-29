
import React from 'react';
import { X, MessageSquare } from 'lucide-react';
import { useThemeContext } from '@/context/ThemeContext';
import { ToggleButtonProps } from '../../types';

/**
 * Button component to toggle the chat widget open/closed
 */
const ToggleButton: React.FC<ToggleButtonProps> = ({ isOpen, onClick }) => {
  const { colors } = useThemeContext();
  
  return (
    <button
      onClick={onClick}
      className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105"
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
      style={{ 
        backgroundColor: isOpen ? '#ef4444' : colors?.primary || '#9b87f5',
      }}
    >
      {isOpen ? (
        <X className="h-6 w-6 text-white" />
      ) : (
        <MessageSquare className="h-6 w-6 text-white" />
      )}
    </button>
  );
};

export default ToggleButton;
