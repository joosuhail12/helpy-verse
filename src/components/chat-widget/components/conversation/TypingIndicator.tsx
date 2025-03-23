
import React from 'react';

interface TypingIndicatorProps {
  agentName: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ agentName }) => {
  return (
    <div className="flex items-center text-gray-500 text-sm">
      <div className="mr-2">{agentName} is typing</div>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
      </div>
    </div>
  );
};

export default TypingIndicator;
