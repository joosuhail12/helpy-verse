
import React from 'react';
import { useChat } from '@/hooks/chat/useChat';
import { useThemeContext } from '@/context/ThemeContext';

interface HomeViewProps {
  onClose: () => void;
  onViewMessages: () => void;
  onStartConversation: (message: string) => Promise<void>;
  workspaceId: string;
}

const HomeView: React.FC<HomeViewProps> = ({
  onClose,
  onViewMessages,
  onStartConversation,
  workspaceId
}) => {
  const { colors, labels } = useThemeContext();
  
  const handleQuickStart = async () => {
    await onStartConversation("Hi, I need some help");
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-medium text-lg">Support</h2>
        <button 
          onClick={onClose}
          className="p-1 rounded-md hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div className="p-6 flex-1">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold mb-2">
            {labels?.welcomeTitle || "Welcome to our Support"}
          </h1>
          <p className="text-gray-600">
            {labels?.welcomeSubtitle || "How can we help you today?"}
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={handleQuickStart}
            className="w-full p-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Start a conversation
          </button>
          
          <button
            onClick={onViewMessages}
            className="w-full p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            View past conversations
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
