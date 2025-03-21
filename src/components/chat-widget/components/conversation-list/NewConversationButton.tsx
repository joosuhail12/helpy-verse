
import React from 'react';

interface NewConversationButtonProps {
  onNewChat: () => void;
}

/**
 * Button to start a new conversation
 */
const NewConversationButton: React.FC<NewConversationButtonProps> = ({ onNewChat }) => {
  return (
    <div className="border-t p-4">
      <button
        onClick={onNewChat}
        className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
      >
        Start New Conversation
      </button>
    </div>
  );
};

export default NewConversationButton;
