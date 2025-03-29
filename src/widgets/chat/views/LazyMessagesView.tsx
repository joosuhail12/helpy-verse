
import React from 'react';
import { useChat } from '@/hooks/chat/useChat';

interface LazyMessagesViewProps {
  onSelectConversation: () => void;
  onClose: () => void;
}

const LazyMessagesView: React.FC<LazyMessagesViewProps> = ({
  onSelectConversation,
  onClose
}) => {
  const { conversations, selectConversation } = useChat();
  
  const handleSelectConversation = (id: string) => {
    selectConversation(id);
    onSelectConversation();
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">Your Conversations</h2>
        <button 
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-1">No conversations yet</h3>
            <p className="text-sm text-muted-foreground">
              Start a new conversation to get help from our team
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => handleSelectConversation(conversation.id)}
                className="w-full text-left p-3 border rounded-lg hover:bg-gray-50"
              >
                <h3 className="font-medium">{conversation.title}</h3>
                <p className="text-sm text-muted-foreground truncate">
                  {conversation.lastMessage || "No messages yet"}
                </p>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>
                    {new Date(conversation.lastMessageTimestamp || Date.now()).toLocaleDateString()}
                  </span>
                  {conversation.unreadCount > 0 && (
                    <span className="bg-primary text-white px-2 py-0.5 rounded-full">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LazyMessagesView;
