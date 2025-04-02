
import React from 'react';
import { useChat } from '@/hooks/chat/useChat';
import ChatHeader from '../header/ChatHeader';
import { Loader2 } from 'lucide-react';

interface MessagesViewProps {
  onBack: () => void;
  onClose: () => void;
  workspaceId: string;
}

const MessagesView: React.FC<MessagesViewProps> = ({
  onBack,
  onClose,
  workspaceId
}) => {
  const chatContext = useChat();
  const { conversations, selectConversation, loading } = chatContext || {
    conversations: [],
    selectConversation: () => {},
    loading: false
  };
  
  const handleSelectConversation = (conversationId: string) => {
    selectConversation(conversationId);
  };
  
  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <ChatHeader title="Recent Conversations" onBack={onBack} onClose={onClose} />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      <ChatHeader title="Recent Conversations" onBack={onBack} onClose={onClose} />
      
      <div className="flex-1 overflow-y-auto p-4">
        {conversations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No conversations yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={() => handleSelectConversation(conversation.id)}
              >
                <div className="font-medium">{conversation.title || "Conversation"}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {conversation.lastMessage || "No messages"}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {typeof conversation.lastMessageTimestamp === 'string' 
                    ? new Date(conversation.lastMessageTimestamp).toLocaleString() 
                    : ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesView;
