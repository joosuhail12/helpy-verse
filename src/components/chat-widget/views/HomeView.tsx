
import React from 'react';
import { useChat } from '@/hooks/chat/useChat';
import { View } from '../container/ChatWidgetContainer';

interface HomeViewProps {
  workspaceId: string;
  onClose: () => void;
  setActiveView: (view: View) => void;
  onSelectConversation: (conversationId: string) => void;
  onStartNewConversation: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ 
  onSelectConversation, 
  onStartNewConversation,
  onClose 
}) => {
  const { conversations } = useChat();

  const handleSelectConversation = (conversation: any) => {
    // Ensure we're passing the ID string, not the whole conversation object
    const conversationId = typeof conversation === 'string' ? conversation : conversation.id;
    onSelectConversation(conversationId);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-medium">Home</h2>
        <button 
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">RECENT CONVERSATIONS</h3>
          <div className="space-y-2">
            {conversations.length > 0 ? (
              conversations.map(conversation => (
                <button
                  key={conversation.id}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
                  onClick={() => handleSelectConversation(conversation.id)}
                >
                  <div className="font-medium">{conversation.title || "Untitled"}</div>
                  <div className="text-sm text-gray-500 truncate">{conversation.lastMessage || "No messages yet"}</div>
                </button>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                <p>No recent conversations</p>
              </div>
            )}
          </div>
        </div>
        
        <button
          onClick={onStartNewConversation}
          className="w-full py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
        >
          Start New Conversation
        </button>
      </div>
    </div>
  );
};

export default HomeView;
