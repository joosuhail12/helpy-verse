
import React from 'react';
import { ChatMessage } from './types';
import MessageItem from './MessageItem';

export interface MessageListProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  error?: Error | null;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  isLoading = false,
  error = null 
}) => {
  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>Error loading messages: {error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center text-gray-500 py-8">
        <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
        <p>Loading messages...</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No messages yet. Start a conversation!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
    </div>
  );
};

export default MessageList;
