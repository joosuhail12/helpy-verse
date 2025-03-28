
import React from 'react';
import { useThemeContext } from '@/context/ThemeContext';
import { TypingUser, TypingIndicatorProps } from './types';

interface EnhancedTypingIndicatorProps extends TypingIndicatorProps {
  agentName?: string;
  compact?: boolean;
}

const TypingIndicator: React.FC<EnhancedTypingIndicatorProps> = ({ 
  users, 
  agentName, 
  compact,
  className
}) => {
  const { colors } = useThemeContext();
  
  if (users.length === 0 && !agentName) return null;
  
  // Create a readable string of who's typing
  const getTypingText = () => {
    if (agentName) {
      return `${agentName} is typing...`;
    }
    
    if (users.length === 1) {
      return `${typeof users[0] === 'string' ? users[0] : (users[0].name || 'Someone')} is typing...`;
    } else if (users.length === 2) {
      const firstName = typeof users[0] === 'string' ? users[0] : (users[0].name || 'Someone');
      const secondName = typeof users[1] === 'string' ? users[1] : (users[1].name || 'someone');
      return `${firstName} and ${secondName} are typing...`;
    } else {
      return `${users.length} people are typing...`;
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
