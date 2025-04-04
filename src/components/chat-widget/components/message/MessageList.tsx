
import React, { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
import { ChatMessage } from '../../types';

interface MessageListProps {
  messages: ChatMessage[];
  conversationId?: string;
  showAvatars?: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages,
  conversationId,
  showAvatars = false
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages come in
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col space-y-4 p-2">
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          showAvatar={showAvatars}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
