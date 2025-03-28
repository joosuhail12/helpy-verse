
import React from 'react';
import { User } from 'lucide-react';
import { cn } from '@/utils/helpers/cn';
import { EnhancedTypingIndicatorProps, TypingUser } from './types';

const TypingIndicator: React.FC<EnhancedTypingIndicatorProps> = ({
  typingUsers,
  agentName = 'Agent',
  compact = false,
  className = ''
}) => {
  if (!typingUsers || typingUsers.length === 0) {
    return null;
  }

  const getNameText = () => {
    if (typingUsers.length === 1) {
      return typingUsers[0].name || agentName;
    } else if (typingUsers.length === 2) {
      return `${typingUsers[0].name || agentName} and ${typingUsers[1].name || 'another agent'}`;
    } else {
      return `${typingUsers[0].name || agentName} and ${typingUsers.length - 1} others`;
    }
  };

  return (
    <div 
      className={cn(
        "flex items-center p-2 text-xs text-gray-500",
        compact ? "py-1" : "py-2",
        className
      )}
    >
      <div className="mr-2 bg-gray-100 p-1 rounded-full">
        <User className="h-3 w-3" />
      </div>
      
      <div className="flex items-center">
        <span>{getNameText()} is typing</span>
        <span className="flex ml-1">
          <span className="animate-bounce mx-0.5 delay-0">.</span>
          <span className="animate-bounce mx-0.5 delay-150">.</span>
          <span className="animate-bounce mx-0.5 delay-300">.</span>
        </span>
      </div>
    </div>
  );
};

export default TypingIndicator;
