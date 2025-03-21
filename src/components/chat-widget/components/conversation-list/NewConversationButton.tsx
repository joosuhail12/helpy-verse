
import React from 'react';

interface NewConversationButtonProps {
  onNewChat: () => void;
}

/**
 * Button to start a new conversation
 */
const NewConversationButton: React.FC<NewConversationButtonProps> = ({ onNewChat }) => {
  return (
    <button
      onClick={onNewChat}
      className="py-2 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors text-sm w-full"
    >
      Start New Conversation
    </button>
  );
};

export default NewConversationButton;
