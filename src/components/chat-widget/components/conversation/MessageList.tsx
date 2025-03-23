
import React, { useEffect, useRef } from 'react';
import { useChat } from '@/hooks/chat/useChat';
import MessageItem from './MessageItem';
import { useThemeContext } from '@/context/ThemeContext';

interface MessageListProps {
  conversationId?: string;
}

const MessageList: React.FC<MessageListProps> = ({ conversationId }) => {
  const { colors } = useThemeContext();
  const { messages } = useChat();
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Filter messages by conversation ID if provided
  const filteredMessages = conversationId
    ? messages.filter(msg => msg.conversationId === conversationId)
    : messages;

  return (
    <div className="space-y-4">
      {filteredMessages.length === 0 ? (
        <div 
          className="text-center py-6 text-gray-500"
          style={{ color: `${colors.foreground}88` }}
        >
          No messages yet. Start a conversation!
        </div>
      ) : (
        filteredMessages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default MessageList;
