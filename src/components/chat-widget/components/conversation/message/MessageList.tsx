
import React, { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
import { Message } from '../types';

interface MessageListProps {
  messages: Message[];
  loading: boolean;
  formatTimestamp: (timestamp: string) => string;
}

/**
 * Component to display the list of messages in a conversation
 */
const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  loading,
  formatTimestamp 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-pulse space-y-4 w-full max-w-md">
          <div className="h-10 bg-gray-200 rounded-md w-3/4"></div>
          <div className="h-20 bg-gray-200 rounded-md w-full"></div>
          <div className="h-16 bg-gray-200 rounded-md w-5/6 ml-auto"></div>
          <div className="h-14 bg-gray-200 rounded-md w-4/5"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 px-1">
      {messages.map((msg) => (
        <MessageItem 
          key={msg.id} 
          message={msg} 
          formatTimestamp={formatTimestamp} 
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
