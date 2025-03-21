
import React, { useEffect, useRef } from 'react';
import EnhancedMessageItem from './EnhancedMessageItem';
import { Message } from '../types';

interface EnhancedMessageListProps {
  messages: Message[];
  loading: boolean;
  formatTimestamp: (timestamp: string) => string;
}

/**
 * Enhanced component to display the list of messages with additional features
 */
const EnhancedMessageList: React.FC<EnhancedMessageListProps> = ({ 
  messages, 
  loading,
  formatTimestamp 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading && messages.length === 0) {
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
      {loading && messages.length > 0 && (
        <div className="text-center py-2">
          <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent text-gray-400"></div>
          <span className="ml-2 text-xs text-gray-500">Loading more messages...</span>
        </div>
      )}
      
      {messages.map((msg, index) => (
        <EnhancedMessageItem 
          key={msg.id} 
          message={msg} 
          formatTimestamp={formatTimestamp} 
          isRead={msg.sender === 'user' && index < messages.length - 2}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default EnhancedMessageList;
