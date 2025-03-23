
import React from 'react';

interface TypingIndicatorProps {
  typingUsers?: string[];
  className?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ typingUsers = [], className = '' }) => {
  if (typingUsers.length === 0) return null;

  return (
    <div className={className}>
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
