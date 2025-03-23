import React from 'react';

interface TypingIndicatorProps {
  typingUsers?: string[];
  className?: string;
  agentName?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ 
  typingUsers = [], 
  className = '',
  agentName
}) => {
  // If we have an agentName, show that specific agent is typing
  if (agentName) {
    return (
      <div className={className || "text-sm text-gray-400 italic"}>
        {agentName} is typing
        <span className="inline-block">
          <span className="animate-pulse">.</span>
          <span className="animate-pulse animation-delay-200">.</span>
          <span className="animate-pulse animation-delay-400">.</span>
        </span>
      </div>
    );
  }

  // Otherwise show standard typing indicator with multiple users support
  if (typingUsers.length === 0) return null;

  return (
    <div className={className || "text-sm text-gray-400 italic"}>
      {typingUsers.length === 1 
        ? `${typingUsers[0]} is typing...` 
        : `${typingUsers.length} people are typing...`}
      <span className="inline-block">
        <span className="animate-pulse">.</span>
        <span className="animate-pulse animation-delay-200">.</span>
        <span className="animate-pulse animation-delay-400">.</span>
      </span>
    </div>
  );
};

export default TypingIndicator;
