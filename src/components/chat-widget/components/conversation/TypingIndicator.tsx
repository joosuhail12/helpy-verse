
import React from 'react';
import { useThemeContext } from '@/context/ThemeContext';

interface TypingUser {
  clientId?: string;
  name?: string;
  timestamp?: number;
}

interface TypingIndicatorProps {
  users: TypingUser[] | string[];
  agentName?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ users, agentName }) => {
  const { colors } = useThemeContext();
  
  if ((users.length === 0 && !agentName) || !users) return null;
  
  // Create a readable string of who's typing
  const getTypingText = () => {
    if (agentName) {
      return `${agentName} is typing...`;
    }
    
    if (users.length === 1) {
      const user = users[0];
      const name = typeof user === 'string' ? user : user.name || 'Someone';
      return `${name} is typing...`;
    } else if (users.length === 2) {
      const user1 = users[0];
      const user2 = users[1];
      const name1 = typeof user1 === 'string' ? user1 : user1.name || 'Someone';
      const name2 = typeof user2 === 'string' ? user2 : user2.name || 'someone';
      return `${name1} and ${name2} are typing...`;
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
