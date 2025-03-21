
import React from 'react';
import { Message } from '../types';
import { useTheme } from '../../../theme/ThemeContext';

interface MessageItemProps {
  message: Message;
  formatTimestamp: (timestamp: string) => string;
}

/**
 * Component to render an individual message in the conversation
 */
const MessageItem: React.FC<MessageItemProps> = ({ message, formatTimestamp }) => {
  const isUserMessage = message.sender === 'user';
  const { theme } = useTheme();
  
  return (
    <div className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'} mb-3`}>
      <div 
        className={`max-w-[80%] p-3 rounded-lg ${
          isUserMessage 
            ? 'text-white rounded-br-none' 
            : 'text-gray-800 border border-gray-100 rounded-bl-none shadow-sm'
        }`}
        style={{
          backgroundColor: isUserMessage ? theme.colors.primary : theme.colors.background,
          color: isUserMessage ? theme.colors.headerText : theme.colors.text,
        }}
      >
        <p className="text-sm">{message.text}</p>
        <span className={`text-xs mt-1 block text-right ${
          isUserMessage ? 'text-gray-300' : 'text-gray-400'
        }`}>
          {formatTimestamp(message.timestamp)}
        </span>
      </div>
    </div>
  );
};

export default MessageItem;
