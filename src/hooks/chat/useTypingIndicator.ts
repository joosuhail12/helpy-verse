
import { useState, useEffect, useCallback } from 'react';
import { useChannel } from '@ably-labs/react-hooks';

export const useTypingIndicator = (channelId: string, userId: string) => {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  
  // Subscribe to typing indicators on the channel
  const { channel } = useChannel(`${channelId}:typing`, (message) => {
    if (message.name === 'typing') {
      const { userName, isTyping, userId: typingUserId } = message.data;
      
      // Ignore our own typing indicators
      if (typingUserId === userId) return;
      
      if (isTyping) {
        // Add user to typing list if not already there
        setTypingUsers(prev => 
          prev.includes(userName) ? prev : [...prev, userName]
        );
        
        // Auto-remove typing indicator after 3 seconds
        setTimeout(() => {
          setTypingUsers(prev => prev.filter(name => name !== userName));
        }, 3000);
      } else {
        // Remove user from typing list
        setTypingUsers(prev => prev.filter(name => name !== userName));
      }
    }
  });
  
  // Send typing indicator
  const sendTypingIndicator = useCallback(() => {
    if (channel) {
      channel.publish('typing', {
        userId,
        userName: 'You',
        isTyping: true
      });
    }
  }, [channel, userId]);
  
  // Send stopped typing indicator
  const sendStoppedTypingIndicator = useCallback(() => {
    if (channel) {
      channel.publish('typing', {
        userId,
        userName: 'You',
        isTyping: false
      });
    }
  }, [channel, userId]);
  
  return {
    typingUsers,
    sendTypingIndicator,
    sendStoppedTypingIndicator
  };
};

export default useTypingIndicator;
