
import React from 'react';
import { X, MessageSquare } from 'lucide-react';
import { useThemeContext } from '@/context/ThemeContext';

interface ToggleButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

/**
 * Button component to toggle the chat widget open/closed
 */
const ToggleButton: React.FC<ToggleButtonProps> = ({ isOpen, onClick }) => {
  const { colors } = useThemeContext();
  
  return (
    <button
      onClick={onClick}
      className={`${
        isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'
      } w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors`}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
      style={{ 
        backgroundColor: isOpen ? '#ef4444' : colors?.primary 
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
