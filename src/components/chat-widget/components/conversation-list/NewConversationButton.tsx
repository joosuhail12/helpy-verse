
import React from 'react';
import { useTheme } from '../../theme/ThemeContext';

interface NewConversationButtonProps {
  onNewChat: () => void;
}

/**
 * Button to start a new conversation
 */
const NewConversationButton: React.FC<NewConversationButtonProps> = ({ onNewChat }) => {
  const { theme } = useTheme();
  
  return (
    <button
      onClick={onNewChat}
      className="py-2 px-4 text-white rounded-lg font-medium transition-colors text-sm w-full"
      style={{ 
        backgroundColor: theme.colors.primary,
        color: theme.colors.headerText
      }}
    >
      Start New Conversation
    </button>
  );
};

export default NewConversationButton;
