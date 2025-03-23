
import React, { useState, useEffect } from 'react';
import { useChat } from '@/hooks/chat/useChat';
import ConversationView from '../components/conversation/ConversationView';
import ChatHeader from '../components/header/ChatHeader';

interface ChatWidgetContainerProps {
  onClose: () => void;
  workspaceId: string;
}

const ChatWidgetContainer: React.FC<ChatWidgetContainerProps> = ({ onClose, workspaceId }) => {
  const { conversations, currentConversation, createNewConversation } = useChat();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeChat = async () => {
      if (!currentConversation && conversations.length === 0) {
        await createNewConversation(`Conversation ${Date.now()}`);
      }
      setIsLoading(false);
    };

    initializeChat();
  }, [currentConversation, conversations, createNewConversation]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <ChatHeader onClose={onClose} title="Chat Support" />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ChatHeader onClose={onClose} title="Chat Support" />
      {currentConversation && (
        <ConversationView 
          conversationId={currentConversation.id} 
          workspaceId={workspaceId} 
        />
      )}
    </div>
  );
};

export default ChatWidgetContainer;
