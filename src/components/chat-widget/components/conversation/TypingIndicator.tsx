
import React from 'react';
import { useTheme } from '../../theme/ThemeContext';

interface TypingIndicatorProps {
  agentName?: string;
}

/**
 * Displays a typing indicator when an agent is typing
 */
const TypingIndicator: React.FC<TypingIndicatorProps> = ({ agentName = 'Agent' }) => {
  const { theme } = useTheme();
  
  return (
    <div className="flex items-start mb-3 max-w-[80%]">
      <div 
        className="p-3 rounded-lg rounded-bl-none border border-gray-100 shadow-sm bg-white"
        style={{ color: theme.colors.text }}
      >
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">{agentName} is typing</span>
          <div className="flex space-x-1">
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '300ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '600ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
