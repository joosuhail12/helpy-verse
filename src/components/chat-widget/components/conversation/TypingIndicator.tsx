
import React, { useState, useEffect } from 'react';

interface TypingIndicatorProps {
  className?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ className = '' }) => {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [showIndicator, setShowIndicator] = useState(false);
  
  // This is a placeholder for actual typing indicator logic
  // In a real implementation, this would connect to the Ably presence channel
  useEffect(() => {
    // Simulate random typing for demo purposes
    const randomTyping = () => {
      const shouldType = Math.random() > 0.7;
      
      if (shouldType && !showIndicator) {
        setTypingUsers(['Agent']);
        setShowIndicator(true);
        
        // Stop typing after 2-5 seconds
        const timeout = 2000 + Math.random() * 3000;
        setTimeout(() => {
          setTypingUsers([]);
          setShowIndicator(false);
        }, timeout);
      }
    };
    
    // Set up interval
    const interval = setInterval(randomTyping, 10000);
    
    return () => {
      clearInterval(interval);
    };
  }, [showIndicator]);

  if (!showIndicator) return null;

  return (
    <div className={className}>
      {typingUsers.length === 1 ? (
        <div className="flex items-center">
          <span>{typingUsers[0]} is typing</span>
          <span className="ml-1 flex">
            <span className="animate-bounce mx-0.5">.</span>
            <span className="animate-bounce animation-delay-200 mx-0.5">.</span>
            <span className="animate-bounce animation-delay-400 mx-0.5">.</span>
          </span>
        </div>
      ) : typingUsers.length > 1 ? (
        <div>Several people are typing...</div>
      ) : null}
    </div>
  );
};

export default TypingIndicator;
