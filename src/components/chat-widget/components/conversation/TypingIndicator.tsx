
import React from 'react';
import { useThemeContext } from '@/context/ThemeContext';

interface TypingUser {
  clientId: string;
  name?: string;
}

interface TypingIndicatorProps {
  users: TypingUser[];
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ users }) => {
  const { colors } = useThemeContext();
  
  if (users.length === 0) return null;
  
  // Create a readable string of who's typing
  const getTypingText = () => {
    if (users.length === 1) {
      return `${users[0].name || 'Someone'} is typing...`;
    } else if (users.length === 2) {
      return `${users[0].name || 'Someone'} and ${users[1].name || 'someone'} are typing...`;
    } else {
      return `${users.length} people are typing...`;
    }
  };
  
  return (
    <div className="flex items-center py-2">
      <div className="flex justify-center items-center px-3 py-1 rounded-full bg-opacity-10" 
        style={{ backgroundColor: `${colors.agentMessage}50` }}>
        <div className="flex space-x-1 mr-2">
          <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: colors.primary, animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: colors.primary, animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: colors.primary, animationDelay: '300ms' }} />
        </div>
        <span className="text-xs opacity-75">{getTypingText()}</span>
      </div>
    </div>
  );
};

export default TypingIndicator;
