
import React, { useRef, useEffect } from 'react';
import { useThemeContext } from '@/context/ThemeContext';
import { ChatMessage } from './types';
import MessageItem from './MessageItemWithPlugins';

interface MessageListProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  conversationId: string;
  actionExtensions?: React.ReactNode[] | null;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  isLoading = false,
  conversationId,
  actionExtensions
}) => {
  const { labels, colors } = useThemeContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="animate-spin h-8 w-8 border-4 border-t-transparent rounded-full" 
          style={{ borderColor: colors.primary, borderTopColor: 'transparent' }}></div>
      </div>
    );
  }
  
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <div 
          className="bg-gray-100 p-4 rounded-full mb-3"
          style={{ backgroundColor: colors.background }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
            />
          </svg>
        </div>
        <p className="text-gray-500">{labels.noMessagesText || "No messages yet. Start a conversation!"}</p>
      </div>
    );
  }
  
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((message) => (
        <MessageItem 
          key={message.id} 
          message={message} 
          actionExtensions={actionExtensions}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
