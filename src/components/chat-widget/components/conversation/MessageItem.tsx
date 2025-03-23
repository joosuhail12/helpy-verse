
import React from 'react';
import { ChatMessage } from './types';
import { format } from 'date-fns';
import { useThemeContext } from '@/context/ThemeContext';

interface MessageItemProps {
  message: ChatMessage;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const { colors } = useThemeContext();
  const formattedTime = typeof message.timestamp === 'string' 
    ? format(new Date(message.timestamp), 'h:mm a')
    : format(message.timestamp, 'h:mm a');

  const isUser = message.sender === 'user';
  const isAgent = message.sender === 'agent';
  const isSystem = message.sender === 'system';

  if (isSystem) {
    return (
      <div className="text-center text-xs text-gray-500 my-2">
        {message.content}
      </div>
    );
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`relative max-w-[80%] px-3 py-2 rounded-lg ${
          isUser 
            ? 'rounded-br-none'
            : 'rounded-bl-none'
        }`}
        style={{
          backgroundColor: isUser ? colors.userMessage : colors.agentMessage,
          color: isUser ? colors.userMessageText : colors.agentMessageText
        }}
      >
        <div className="text-sm">{message.content}</div>
        <div className="text-xs mt-1" style={{ 
          color: isUser ? 
            `${colors.userMessageText}cc` : 
            `${colors.agentMessageText}99` 
        }}>
          {formattedTime}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
