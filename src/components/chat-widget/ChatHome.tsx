
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
        
        {/* Featured content card similar to the report shown in Intercom */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="relative">
            <img 
              src="/lovable-uploads/fb0e736e-b1ab-4544-9f52-f5da970109b3.png" 
              alt="2025 Customer Service Report" 
              className="w-full h-40 object-cover"
            />
            <div className="absolute top-2 right-2 bg-white/90 w-6 h-6 rounded-md flex items-center justify-center">
              <svg viewBox="0 0 28 28" fill="currentColor" className="w-4 h-4 text-gray-900">
                <path d="M14 2C7.373 2 2 7.373 2 14s5.373 12 12 12 12-5.373 12-12S20.627 2 14 2zm5.595 9.812l-4.83 7.583a.805.805 0 0 1-1.134.186l-3.525-2.804a.803.803 0 0 1-.103-1.128.804.804 0 0 1 1.128-.103l2.847 2.266 4.303-6.752a.803.803 0 0 1 1.116-.214.804.804 0 0 1 .198 1.116z" />
              </svg>
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="font-bold text-gray-900">The 2025 Customer Service Transformation Report is here</h3>
            <p className="text-gray-600 text-sm mt-2">
              Learn how AI has transformed customer service from the ground up—rewriting its economics, expanding its capabilities, and reshaping the everyday work of customer service teams.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHome;
