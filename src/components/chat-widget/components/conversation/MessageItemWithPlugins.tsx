
import React from 'react';
import { useThemeContext } from '@/context/ThemeContext';
import { ChatMessage } from './types';
import { formatDistanceToNow } from 'date-fns';

interface MessageItemProps {
  message: ChatMessage;
  actionExtensions?: React.ReactNode[] | null;
}

const MessageItem: React.FC<MessageItemProps> = ({ 
  message,
  actionExtensions
}) => {
  const { colors } = useThemeContext();
  const isUser = message.sender === 'user';
  const isAgent = message.sender === 'agent';
  const isSystem = message.sender === 'system';
  
  // Format timestamp
  const timeString = message.timestamp
    ? formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })
    : '';
    
  // Determine if message has sentiment data (from plugins)
  const hasSentiment = message.metadata?.sentiment;
  const sentimentEmoji = hasSentiment 
    ? message.metadata.sentiment === 'positive'
      ? '😊'
      : message.metadata.sentiment === 'negative'
        ? '😟'
        : '😐'
    : null;
  
  return (
    <div className={`flex group ${isUser ? 'justify-end' : 'justify-start'} my-2`}>
      <div 
        className={`relative max-w-[80%] rounded-lg p-3 ${
          isUser 
            ? 'bg-primary text-white rounded-br-none' 
            : isAgent
              ? 'bg-gray-100 text-gray-900 rounded-bl-none'
              : 'bg-gray-200 text-gray-900'
        }`}
        style={isUser ? { backgroundColor: colors.primary } : {}}
      >
        {/* Sentiment indicator */}
        {sentimentEmoji && (
          <div className="absolute -top-5 -right-2 text-lg">
            {sentimentEmoji}
          </div>
        )}
        
        {/* Message content */}
        <div>
          {message.content}
        </div>
        
        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 space-y-1">
            {message.attachments.map(attachment => (
              <div 
                key={attachment.id} 
                className={`text-sm p-2 rounded ${isUser ? 'bg-primary-darker' : 'bg-gray-200'}`}
                style={isUser ? { backgroundColor: colors.primaryDark || 'rgba(0,0,0,0.1)' } : {}}
              >
                <div className="flex items-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 mr-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" 
                    />
                  </svg>
                  <a 
                    href={attachment.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="truncate"
                  >
                    {attachment.name}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Timestamp and status */}
        <div className={`text-xs mt-1 ${isUser ? 'text-gray-200' : 'text-gray-500'}`}>
          {timeString}
          {message.status && message.status !== 'sent' && (
            <span className="ml-2">{message.status}</span>
          )}
        </div>
        
        {/* Action extensions from plugins */}
        {actionExtensions && actionExtensions.length > 0 && (
          <div className="absolute right-0 top-0 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity flex">
            {actionExtensions}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
