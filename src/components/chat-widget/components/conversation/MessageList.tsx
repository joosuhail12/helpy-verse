
import React from 'react';
import { ChatMessage, TypingUser } from './types';
import { useThemeContext } from '@/context/ThemeContext';
import { Loader2 } from 'lucide-react';
import MessageItem from './MessageItem';

interface MessageListProps {
  messages: ChatMessage[];
  typingUsers?: TypingUser[];
  isLoading?: boolean;
  showAvatars?: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  typingUsers = [], 
  isLoading = false,
  showAvatars = false
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
        <MessageItem 
          key={message.id} 
          message={message} 
          showAvatar={showAvatars}
        />
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
