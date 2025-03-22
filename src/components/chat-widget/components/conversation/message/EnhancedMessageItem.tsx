
import React, { useState } from 'react';
import { Check, CheckCheck, Clock, AlertCircle, Smile, FileIcon, Image } from 'lucide-react';

interface MessageItemProps {
  message: {
    id: string;
    text?: string;
    sender: string;
    timestamp: string;
    status?: string;
    reactions?: Record<string, string[]>;
    attachments?: Array<{
      url: string;
      type: string;
      name: string;
      size?: number;
    }>;
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
  onReact?: (messageId: string, emoji: string) => void;
}

/**
 * Enhanced message bubble with status indicators, reactions and responsive design
 */
const EnhancedMessageItem: React.FC<MessageItemProps> = ({
  message,
  isCurrentUser,
  previousMessage,
  nextMessage,
  isMobile = false,
  onReact
}) => {
  const [showReactions, setShowReactions] = useState(false);
  
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
      case 'delivered':
        return <Check className="h-3 w-3 text-green-500" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-green-500" />;
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
  
  // Common emoji reactions
  const availableReactions = ['👍', '❤️', '😂', '😊', '😮', '👏', '🙏'];
  
  // Handle reaction click
  const handleReaction = (emoji: string) => {
    if (onReact) {
      onReact(message.id, emoji);
    }
    setShowReactions(false);
  };
  
  // Render message attachments
  const renderAttachments = () => {
    if (!message.attachments || message.attachments.length === 0) return null;
    
    return (
      <div className="mt-1 space-y-1">
        {message.attachments.map((attachment, index) => (
          <a 
            key={index} 
            href={attachment.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {attachment.type.startsWith('image/') ? (
              <div className="w-full">
                <div className="flex items-center mb-1">
                  <Image className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-xs text-gray-500 truncate">{attachment.name}</span>
                </div>
                <img 
                  src={attachment.url} 
                  alt={attachment.name} 
                  className="max-h-48 max-w-full rounded object-contain"
                />
              </div>
            ) : (
              <div className="flex items-center w-full">
                <FileIcon className="h-4 w-4 mr-2 text-gray-500" />
                <div className="flex-1 truncate">
                  <span className="text-xs text-gray-700 dark:text-gray-300">{attachment.name}</span>
                  {attachment.size && (
                    <span className="text-xs text-gray-500 ml-1">
                      ({Math.round(attachment.size / 1024)} KB)
                    </span>
                  )}
                </div>
              </div>
            )}
          </a>
        ))}
      </div>
    );
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
          
          {/* Attachments */}
          {renderAttachments()}
        </div>
        
        {/* Reactions display */}
        {message.reactions && Object.keys(message.reactions).length > 0 && (
          <div className={`flex mt-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
            <div className="flex flex-wrap bg-white rounded-full px-1 py-0.5 shadow-sm border border-gray-100">
              {Object.entries(message.reactions).map(([emoji, users]) => (
                <button
                  key={emoji}
                  className="text-xs mx-0.5 px-1 rounded-full hover:bg-gray-100"
                  onClick={() => handleReaction(emoji)}
                >
                  <span>{emoji} {users.length > 1 ? users.length : ''}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Time and status */}
        <div className={`flex items-center mt-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
          {/* Add reaction button */}
          {onReact && (
            <div className="relative">
              <button 
                onClick={() => setShowReactions(!showReactions)}
                className="text-gray-400 hover:text-gray-600 mr-1 p-0.5 rounded focus:outline-none"
              >
                <Smile className="h-3 w-3" />
              </button>
              
              {/* Reaction picker */}
              {showReactions && (
                <div className="absolute bottom-6 left-0 z-10 flex bg-white rounded-full shadow-md border border-gray-200 p-1">
                  {availableReactions.map(emoji => (
                    <button
                      key={emoji}
                      className="text-sm mx-0.5 hover:bg-gray-100 px-1 rounded"
                      onClick={() => handleReaction(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          
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
