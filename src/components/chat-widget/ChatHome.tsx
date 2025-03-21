
import React from 'react';
import WelcomeHeader from './components/WelcomeHeader';
import StartConversationCard from './components/StartConversationCard';

interface ChatHomeProps {
  onNewChat: () => void;
  workspaceId?: string;
}

/**
 * Home screen of the chat widget
 * Styled after Intercom's home screen
 */
const ChatHome: React.FC<ChatHomeProps> = ({ onNewChat, workspaceId }) => {
  return (
    <div className="flex flex-col h-full">
      <WelcomeHeader />
      
      <div className="p-4 flex-1 overflow-y-auto bg-gray-50">
        <div className="mt-2 mb-4">
          <StartConversationCard onClick={onNewChat} />
        </div>
        
        {/* Featured content removed as requested */}
      </div>
    </div>
  );
};

export default ChatHome;
