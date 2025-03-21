
import React from 'react';
import WelcomeHeader from './components/WelcomeHeader';
import ProTip from './components/ProTip';
import QuickLinks from './components/QuickLinks';
import StartConversationCard from './components/StartConversationCard';

interface ChatHomeProps {
  onNewChat: () => void;
  workspaceId?: string;
}

/**
 * Home screen of the chat widget
 */
const ChatHome: React.FC<ChatHomeProps> = ({ onNewChat, workspaceId }) => {
  return (
    <div className="p-4 flex flex-col h-full">
      <WelcomeHeader />
      
      <div className="mt-4 mb-6">
        <ProTip />
      </div>
      
      <div className="flex-grow">
        <QuickLinks />
        
        <div className="mt-6">
          <StartConversationCard onClick={onNewChat} />
        </div>
      </div>
    </div>
  );
};

export default ChatHome;
