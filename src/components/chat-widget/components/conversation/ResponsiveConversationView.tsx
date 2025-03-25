
import React, { useState, useEffect } from 'react';
import { useRealtimeChat } from '@/hooks/chat/useRealtimeChat';
import { useMessageSubscription } from '@/hooks/chat/useMessageSubscription';
import { useTypingIndicator } from '@/hooks/chat/useTypingIndicator';
import ChatHeader from '../header/ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { ChatMessage } from './types';

export interface ResponsiveConversationViewProps {
  conversationId: string;
  workspaceId: string;
  onBack?: () => void;
}

const ResponsiveConversationView: React.FC<ResponsiveConversationViewProps> = ({
  conversationId,
  workspaceId,
  onBack
}) => {
  const { messages, sendMessage, isLoading } = useRealtimeChat(conversationId, workspaceId);
  const [typingUsers, setTypingUsers] = useState<{ clientId: string; name?: string }[]>([]);
  const { publishMessage } = useMessageSubscription(conversationId, workspaceId, {
    onMessage: (message: ChatMessage) => {
      // Handle new messages if needed
    }
  });

  const { startTyping, stopTyping } = useTypingIndicator({
    conversationId,
    workspaceId,
    onTypingStatusChanged: (typingStatuses) => {
      setTypingUsers(
        Object.entries(typingStatuses)
          .filter(([_, isTyping]) => isTyping)
          .map(([clientId]) => ({ clientId }))
      );
    }
  });

  const handleSendMessage = async (content: string) => {
    stopTyping();
    await sendMessage(content);
  };

  const handleMessageInputChange = (text: string) => {
    if (text.trim()) {
      startTyping();
    } else {
      stopTyping();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ChatHeader 
        title="Conversation" 
        onBackClick={onBack} 
        workspaceId={workspaceId}
        conversationId={conversationId}
      />
      <div className="flex-1 overflow-hidden flex flex-col">
        <MessageList messages={messages} isLoading={isLoading} />
        <div className="px-4 pb-2">
          <TypingIndicator users={typingUsers} agentName={typingUsers.length === 1 ? "Support agent" : undefined} />
          <MessageInput 
            onSendMessage={handleSendMessage} 
            onChange={handleMessageInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ResponsiveConversationView;
