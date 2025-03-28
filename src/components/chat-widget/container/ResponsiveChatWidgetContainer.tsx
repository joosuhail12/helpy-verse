
import React, { useState, useEffect } from 'react';
import { useChat } from '@/context/ChatContext';
import ResponsiveConversationView from '../components/conversation/ResponsiveConversationView';
import ChatHeader from '../components/header/ChatHeader';

interface ResponsiveChatWidgetContainerProps {
  onClose: () => void;
  workspaceId: string;
}

const ResponsiveChatWidgetContainer: React.FC<ResponsiveChatWidgetContainerProps> = ({ 
  onClose,
  workspaceId,
}) => {
  const { 
    conversations, 
    currentConversation, 
    createNewConversation: createConversation, 
    selectConversation: setSelectedConversation 
  } = useChat();
  
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'list' | 'conversation'>('list');

  useEffect(() => {
    const initializeChat = async () => {
      if (!currentConversation && conversations.length === 0) {
        await createConversation(`New Conversation ${Date.now()}`);
      }
      setIsLoading(false);
    };

    initializeChat();
  }, [currentConversation, conversations, createConversation]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <ChatHeader title="Chat Support" onBackClick={null} onClose={onClose} />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {view === 'list' && (
        <>
          <ChatHeader title="Chat Support" onBackClick={null} onClose={onClose} />
          <div className="flex-1 p-4 overflow-y-auto">
            <h3 className="font-medium mb-3">Your conversations</h3>
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => {
                    setSelectedConversation(conversation.id);
                    setView('conversation');
                  }}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition"
                >
                  <h4 className="font-medium">{conversation.title || "New Conversation"}</h4>
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.lastMessage || "No messages yet"}
                  </p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-400">
                      {new Date(conversation.lastMessageTimestamp).toLocaleString()}
                    </span>
                    {conversation.unreadCount > 0 && (
                      <span className="bg-primary text-white text-xs rounded-full px-2 py-0.5">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
      
      {view === 'conversation' && currentConversation && (
        <ResponsiveConversationView 
          conversationId={currentConversation.id}
          onBack={() => setView('list')}
        />
      )}
    </div>
  );
};

export default ResponsiveChatWidgetContainer;
