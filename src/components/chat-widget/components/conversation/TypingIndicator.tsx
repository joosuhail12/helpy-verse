
import React from 'react';
import { useThemeContext } from '@/context/ThemeContext';

interface TypingIndicatorProps {
  agentName?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ agentName = 'Agent' }) => {
  const { colors } = useThemeContext();
  
  return (
    <div 
      className="flex items-center mb-4"
      style={{ color: colors.foreground }}
    >
      <div 
        className="bg-gray-200 p-3 rounded-lg flex items-center"
        style={{ backgroundColor: colors.agentMessage, color: colors.agentMessageText }}
      >
        <span className="text-sm mr-2">{agentName} is typing</span>
        <div className="flex space-x-1">
          <div className="w-2 h-2 rounded-full bg-current animate-pulse" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-current animate-pulse" style={{ animationDelay: '200ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-current animate-pulse" style={{ animationDelay: '400ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
