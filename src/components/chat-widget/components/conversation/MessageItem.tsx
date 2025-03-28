
import React from 'react';
import { ChatMessage, UserAvatarProps } from './types';
import { cn } from '@/lib/utils';
import { CheckCheck, Check, Clock, AlertTriangle, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { useThemeContext } from '@/context/ThemeContext';

interface MessageItemProps {
  message: ChatMessage;
  showAvatar?: boolean;
  encrypted?: boolean;
}

// Create a placeholder UserAvatar component that matches the expected props
const UserAvatar: React.FC<UserAvatarProps> = ({ name, userId, color, avatarUrl, size = 'md', status }) => {
  const initials = name
    ? name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : 'U';

  return (
    <div 
      className={cn(
        "rounded-full flex items-center justify-center text-white text-sm font-medium",
        size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8',
        status && 'relative'
      )}
      style={{ backgroundColor: color || '#4F46E5' }}
    >
      {avatarUrl ? (
        <img src={avatarUrl} alt={name} className="w-full h-full object-cover rounded-full" />
      ) : (
        initials
      )}
      
      {status && (
        <span 
          className={cn(
            "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white",
            status === 'online' ? 'bg-green-500' : 
            status === 'away' ? 'bg-yellow-500' : 
            status === 'busy' ? 'bg-red-500' : 'bg-gray-400'
          )} 
        />
      )}
    </div>
  );
};

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

  // Use fallback colors if theme doesn't provide them
  const mutedBg = colors.muted || colors.backgroundSecondary || '#f3f4f6';
  const mutedFg = colors.mutedForeground || colors.foreground || '#6b7280';
  const secondaryBg = colors.secondary || colors.backgroundSecondary || '#f3f4f6';
  const secondaryFg = colors.secondaryForeground || colors.foreground || '#1f2937';
  
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
              ? { background: mutedBg, color: mutedFg }
              : { background: secondaryBg, color: secondaryFg }
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
