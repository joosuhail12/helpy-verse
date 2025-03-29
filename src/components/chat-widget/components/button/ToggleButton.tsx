
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
      className={`chat-toggle-button ${isOpen ? 'chat-toggle-button-open' : 'chat-toggle-button-closed'}`}
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
