
import React from 'react';
import { ChatMessage } from './types';
import { cn } from '@/lib/utils';
import { CheckCheck, Check, Clock, AlertTriangle, Lock } from 'lucide-react';
import UserAvatar from '../user/UserAvatar';
import { format } from 'date-fns';
import { useThemeContext } from '@/context/ThemeContext';

interface MessageItemProps {
  message: ChatMessage;
  showAvatar?: boolean;
  encrypted?: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ 
  message, 
  showAvatar = false,
  encrypted = false
}) => {
  const { colors } = useThemeContext();
  const isUser = message.sender === 'user';
  const isSystem = message.sender === 'system';
  
  // Format timestamp
  const formatTime = (timestamp: Date | string) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return format(date, 'h:mm a');
  };
  
  // Get status icon based on message status
  const getStatusIcon = () => {
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
        return <AlertTriangle className="h-3 w-3 text-red-500" />;
      default:
        return null;
    }
  };
  
  return (
    <div
      className={cn(
        'flex px-4 py-2 gap-2',
        isUser ? 'justify-end' : 'justify-start',
        isSystem && 'justify-center'
      )}
    >
      {!isUser && showAvatar && !isSystem && (
        <div className="flex-shrink-0 mt-1">
          <UserAvatar
            userId={`agent-${message.id.substring(0, 5)}`}
            name="Agent"
            color="#4F46E5"
          />
        </div>
      )}
      
      <div className={cn('max-w-[75%] flex flex-col', isUser ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'px-3 py-2 rounded-lg',
            isUser
              ? 'bg-primary text-primary-foreground rounded-br-none'
              : isSystem
              ? 'bg-muted text-muted-foreground text-center text-sm py-1 max-w-md'
              : 'bg-secondary text-secondary-foreground rounded-bl-none',
            message.status === 'failed' && 'bg-red-500 text-white'
          )}
          style={
            isUser
              ? { background: colors.primary, color: colors.primaryForeground }
              : isSystem
              ? { background: colors.muted, color: colors.mutedForeground }
              : { background: colors.secondary, color: colors.secondaryForeground }
          }
        >
          {message.content}
          
          {/* If message is encrypted, show a small lock icon */}
          {encrypted && (
            <span className="inline-flex items-center ml-1">
              <Lock className="h-3 w-3 opacity-70" />
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
          <span>{formatTime(message.timestamp)}</span>
          {getStatusIcon()}
        </div>
      </div>
      
      {isUser && showAvatar && !isSystem && (
        <div className="flex-shrink-0 mt-1">
          <UserAvatar userId="user" name="You" />
        </div>
      )}
    </div>
  );
};

export default MessageItem;
