
import React from 'react';
import { ChatMessage, TypingUser } from './types';
import { useThemeContext } from '@/context/ThemeContext';
import { Loader2 } from 'lucide-react';

interface MessageListProps {
  messages: ChatMessage[];
  typingUsers?: TypingUser[];
  isLoading?: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  typingUsers = [], 
  isLoading = false 
}) => {
  const { colors } = useThemeContext();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex justify-center items-center h-full text-gray-400">
        No messages yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div 
          key={message.id}
          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div 
            className={`max-w-[80%] rounded-lg px-4 py-2 ${
              message.sender === 'user'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-900'
            }`}
            style={{
              backgroundColor: message.sender === 'user' ? colors.userMessage : colors.agentMessage,
              color: message.sender === 'user' ? colors.userMessageText : colors.agentMessageText
            }}
          >
            {message.content}
            <div className="text-xs opacity-70 mt-1">
              {new Date(message.timestamp).toLocaleTimeString(undefined, { 
                hour: '2-digit', 
                minute: '2-digit'
              })}
              {message.status === 'read' && (
                <span className="ml-1">✓✓</span>
              )}
            </div>
          </div>
        </div>
      ))}
      
      {typingUsers.length > 0 && (
        <div className="flex items-center text-gray-500 text-sm">
          <div className="flex space-x-1 mr-2">
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          {typingUsers.length === 1 
            ? `${typingUsers[0].name || 'Someone'} is typing...` 
            : `${typingUsers.length} people are typing...`}
        </div>
      )}
    </div>
  );
};

export default MessageList;
