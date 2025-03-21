
import React from 'react';
import WelcomeHeader from './components/WelcomeHeader';
import StartConversationCard from './components/StartConversationCard';
import ResponseTime from './components/ResponseTime';

interface ChatHomeProps {
  onNewChat: () => void;
}

/**
 * Home page for the chat widget showing welcome message and start conversation button
 */
const ChatHome = ({ onNewChat }: ChatHomeProps) => {
  return (
    <div className="flex flex-col h-full">
      {/* Modern welcome header */}
      <WelcomeHeader />
      
      {/* Content area */}
      <div className="px-4 py-4 flex-1 bg-white">
        {/* Main action card */}
        <StartConversationCard onClick={onNewChat} />
      </div>

      <ResponseTime />
    </div>
  );
};

export default ChatHome;
