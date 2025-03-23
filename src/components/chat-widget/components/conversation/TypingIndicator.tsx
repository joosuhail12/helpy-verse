
import React from 'react';

export interface TypingIndicatorProps {
  typingUsers: string[];
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ typingUsers }) => {
  if (typingUsers.length === 0) return null;

  let message = '';
  if (typingUsers.length === 1) {
    message = `${typingUsers[0]} is typing...`;
  } else if (typingUsers.length === 2) {
    message = `${typingUsers[0]} and ${typingUsers[1]} are typing...`;
  } else {
    message = `${typingUsers[0]} and ${typingUsers.length - 1} others are typing...`;
  }

  return (
    <div className="text-xs text-gray-500 animate-pulse h-5 mt-2">
      {message}
      <span className="inline-flex">
        <span className="animate-bounce">.</span>
        <span className="animate-bounce animation-delay-200">.</span>
        <span className="animate-bounce animation-delay-400">.</span>
      </span>
    </div>
  );
};

export default TypingIndicator;
