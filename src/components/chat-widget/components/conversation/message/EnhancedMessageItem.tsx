
import React from 'react';
import { Check, Clock, AlertCircle } from 'lucide-react';

interface MessageItemProps {
  message: {
    id: string;
    text?: string;
    sender: string;
    timestamp: string;
    status?: string;
  };
  isCurrentUser: boolean;
  previousMessage?: {
    sender: string;
    timestamp: string;
  };
  nextMessage?: {
    sender: string;
    timestamp: string;
  };
  isMobile?: boolean;
}

/**
 * Enhanced message bubble with status indicators and responsive design
 */
const EnhancedMessageItem: React.FC<MessageItemProps> = ({
  message,
  isCurrentUser,
  previousMessage,
  nextMessage,
  isMobile = false
}) => {
  // Determine if this message is part of a group
  const isFirstInGroup = !previousMessage || previousMessage.sender !== message.sender;
  const isLastInGroup = !nextMessage || nextMessage.sender !== message.sender;
  
  // Format timestamp for display
  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };
  
  // Get status icon based on message status
  const getStatusIcon = () => {
    if (!message.status) return null;
    
    switch (message.status) {
      case 'sent':
        return <Check className="h-3 w-3 text-green-500" />;
      case 'queued':
        return <Clock className="h-3 w-3 text-gray-400" />;
      case 'sending':
        return <div className="h-3 w-3 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-3 w-3 text-red-500" />;
      default:
        return null;
    }
  };
  
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] ${isMobile ? 'max-w-[85%]' : ''}`}>
        {/* Message bubble */}
        <div
          className={`p-2 md:p-3 rounded-lg ${isCurrentUser
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-gray-900'
          } ${isFirstInGroup
            ? isCurrentUser
              ? 'rounded-tr-lg'
              : 'rounded-tl-lg'
            : isCurrentUser
              ? 'rounded-tr-sm'
              : 'rounded-tl-sm'
          } ${isLastInGroup
            ? isCurrentUser
              ? 'rounded-br-sm'
              : 'rounded-bl-sm'
            : isCurrentUser
              ? 'rounded-br-lg'
              : 'rounded-bl-lg'
          }`}
        >
          <div className={`${isMobile ? 'text-sm' : 'text-base'}`}>
            {message.text}
          </div>
        </div>
        
        {/* Time and status */}
        <div className={`flex items-center mt-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
          <span className="text-xs text-gray-500 mr-1">
            {formatTime(message.timestamp)}
          </span>
          
          {isCurrentUser && getStatusIcon()}
        </div>
      </div>
    </div>
  );
};

export default EnhancedMessageItem;
