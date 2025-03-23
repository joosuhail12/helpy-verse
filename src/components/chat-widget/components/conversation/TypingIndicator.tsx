
import React from 'react';

export interface TypingIndicatorProps {
  isTyping?: boolean;
  agentName?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ 
  isTyping = false, 
  agentName = 'Agent' 
}) => {
  if (!isTyping) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 text-gray-500 text-sm p-2">
      <div className="flex space-x-1">
        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      <span>{agentName} is typing...</span>
    </div>
  );
};

export default TypingIndicator;
