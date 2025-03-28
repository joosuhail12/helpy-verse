
import React, { useState } from 'react';
import { ChatMessage } from './types';
import { formatRelativeTime } from '@/utils/helpers/helpers';
import { Check, CheckCheck, Clock, AlertCircle, Lock } from 'lucide-react';

export interface MessageItemProps {
  message: ChatMessage;
  encrypted?: boolean;
  showReadReceipt?: boolean;
  showReactions?: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  encrypted = false,
  showReadReceipt = false,
  showReactions = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isUser = message.sender === 'user';

  // Message status indicator
  const getStatusIndicator = () => {
    if (!isUser) return null;

    switch (message.status) {
      case 'sending':
        return <Clock className="h-3 w-3 text-gray-400" />;
      case 'sent':
        return <Check className="h-3 w-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      case 'failed':
        return <AlertCircle className="h-3 w-3 text-red-500" />;
      case 'queued':
        return <Clock className="h-3 w-3 text-amber-500" />;
      default:
        return null;
    }
  };

  return (
    <div 
      className={`px-1 py-2 flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`rounded-lg px-4 py-2 max-w-[80%] ${
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground'
        }`}
      >
        {message.content && (
          <div className="text-sm">
            {isExpanded 
              ? message.content 
              : message.content.length > 300 
                ? message.content.substring(0, 300) + '...' 
                : message.content
            }
            
            {message.content.length > 300 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="ml-1 text-xs underline"
              >
                {isExpanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        )}
        
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 space-y-1">
            {message.attachments.map(attachment => (
              <a
                key={attachment.id}
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-xs p-1 bg-black/10 rounded"
              >
                <span className="truncate max-w-[150px]">{attachment.name}</span>
                <span className="ml-1 text-xs opacity-70">
                  ({Math.round(attachment.size / 1024)} KB)
                </span>
              </a>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-end text-xs opacity-70 mt-1 space-x-1">
          {encrypted && <Lock className="h-3 w-3" />}
          <span>{formatRelativeTime(message.timestamp)}</span>
          
          {showReadReceipt && getStatusIndicator()}
        </div>
        
        {showReactions && message.metadata?.reactions && (
          <div className="mt-1 flex flex-wrap gap-1">
            {Object.entries(message.metadata.reactions || {}).map(([emoji, count]) => (
              <span key={emoji} className="text-xs bg-black/5 rounded-full px-2 py-0.5">
                {emoji} {String(count)}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
