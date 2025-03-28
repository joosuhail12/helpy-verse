
import React from 'react';
import { useThemeContext } from '@/context/ThemeContext';
import { TypingUser, TypingIndicatorProps } from './types';

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ 
  typingUsers, 
  agentName, 
  compact,
  className
}) => {
  const { colors } = useThemeContext();
  
  if (typingUsers.length === 0 && !agentName) return null;
  
  // Create a readable string of who's typing
  const getTypingText = () => {
    if (agentName) {
      return `${agentName} is typing...`;
    }
    
    if (typingUsers.length === 1) {
      return `${typeof typingUsers[0] === 'string' ? typingUsers[0] : (typingUsers[0].name || 'Someone')} is typing...`;
    } else if (typingUsers.length === 2) {
      const firstName = typeof typingUsers[0] === 'string' ? typingUsers[0] : (typingUsers[0].name || 'Someone');
      const secondName = typeof typingUsers[1] === 'string' ? typingUsers[1] : (typingUsers[1].name || 'someone');
      return `${firstName} and ${secondName} are typing...`;
    } else {
      return `${typingUsers.length} people are typing...`;
    }
  };
  
  return (
    <div className={`flex items-center py-2 ${className || ''}`}>
      <div className={`flex justify-center items-center px-3 py-1 rounded-full bg-opacity-10 ${compact ? 'text-xs' : ''}`} 
        style={{ backgroundColor: `${colors.agentMessage}50` }}>
        <div className="flex space-x-1 mr-2 items-end">
          <div className="w-2 h-2 rounded-full animate-bounce" 
               style={{ 
                 backgroundColor: colors.primary, 
                 animationDelay: '0ms',
                 animationDuration: '0.6s' 
               }} 
          />
          <div className="w-2 h-2 rounded-full animate-bounce" 
               style={{ 
                 backgroundColor: colors.primary, 
                 animationDelay: '150ms',
                 animationDuration: '0.6s' 
               }} 
          />
          <div className="w-2 h-2 rounded-full animate-bounce" 
               style={{ 
                 backgroundColor: colors.primary, 
                 animationDelay: '300ms',
                 animationDuration: '0.6s' 
               }} 
          />
        </div>
        <span className="text-xs opacity-75">{getTypingText()}</span>
      </div>
    </div>
  );
};

export default TypingIndicator;
