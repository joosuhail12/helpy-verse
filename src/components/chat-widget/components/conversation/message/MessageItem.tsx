
import React from 'react';
import { Message } from '../types';

interface MessageItemProps {
  message: Message;
  formatTimestamp: (timestamp: string) => string;
}

/**
 * Component to render an individual message in the conversation
 */
const MessageItem: React.FC<MessageItemProps> = ({ message, formatTimestamp }) => {
  const isUserMessage = message.sender === 'user';
  
  return (
    <div className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[80%] p-3 rounded-lg ${
          isUserMessage 
            ? 'bg-indigo-600 text-white rounded-br-none' 
            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none shadow-sm'
        }`}
      >
        <p className="text-sm">{message.text}</p>
        <span className={`text-xs mt-1 block text-right ${
          isUserMessage ? 'text-indigo-100' : 'text-gray-400'
        }`}>
          {formatTimestamp(message.timestamp)}
        </span>
      </div>
    </div>
  );
};

export default MessageItem;
