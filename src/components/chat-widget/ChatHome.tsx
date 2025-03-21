
import React from 'react';
import WelcomeHeader from './components/WelcomeHeader';
import StartConversationCard from './components/StartConversationCard';
import QuickLinks from './components/QuickLinks';
import ProTip from './components/ProTip';
import ResponseTime from './components/ResponseTime';

interface ChatHomeProps {
  onNewChat: () => void;
}

/**
 * Home page for the chat widget showing welcome message and personalization options
 */
const ChatHome = ({ onNewChat }: ChatHomeProps) => {
  return (
    <div className="flex flex-col h-full">
      {/* Modern welcome header */}
      <WelcomeHeader />
      
      {/* Content area */}
      <div className="px-6 py-6 flex-1">
        {/* Main action card */}
        <StartConversationCard onClick={onNewChat} />

        {/* Modern quick links */}
        <QuickLinks />

        {/* Personalized tip with modern design */}
        <ProTip />
      </div>

      <ResponseTime />
    </div>
  );
};

export default ChatHome;
