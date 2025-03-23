
import { useState, useEffect, useCallback } from 'react';
import { useChannel } from '@ably-labs/react-hooks';

interface TypingUser {
  id: string;
  name: string;
  isTyping: boolean;
  lastTyped: number;
}

export const useTypingIndicator = (channelId: string, userId: string, userName: string) => {
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  
  // Connect to typing indicator channel
  const { channel } = useChannel(`${channelId}:typing`, (message) => {
    if (message.name === 'typing') {
      const typingData = message.data as TypingUser;
      
      // Don't process own typing events
      if (typingData.id === userId) return;
      
      if (typingData.isTyping) {
        // Add or update typing user
        setTypingUsers(prev => {
          const exists = prev.some(user => user.id === typingData.id);
          if (exists) {
            return prev.map(user => 
              user.id === typingData.id 
                ? { ...user, isTyping: true, lastTyped: Date.now() } 
                : user
            );
          } else {
            return [...prev, { ...typingData, lastTyped: Date.now() }];
          }
        });
      } else {
        // Remove typing user
        setTypingUsers(prev => prev.filter(user => user.id !== typingData.id));
      }
    }
  });
  
  // Send typing indicator
  const sendTypingStart = useCallback(() => {
    if (!channel) return;
    
    try {
      console.log('User started typing');
      
      // In a real implementation, publish to the typing channel
      // channel.publish('typing', { id: userId, name: userName, isTyping: true });
    } catch (error) {
      console.error('Error sending typing indicator:', error);
    }
  }, [channel, userId, userName]);
  
  // Send typing end
  const sendTypingEnd = useCallback(() => {
    if (!channel) return;
    
    try {
      console.log('User stopped typing');
      
      // In a real implementation, publish to the typing channel
      // channel.publish('typing', { id: userId, name: userName, isTyping: false });
    } catch (error) {
      console.error('Error sending typing indicator:', error);
    }
  }, [channel, userId, userName]);
  
  // Clean up typing users who haven't typed for a while
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setTypingUsers(prev => 
        prev.filter(user => (now - user.lastTyped) < 10000) // 10 seconds timeout
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return {
    typingUsers,
    sendTypingStart,
    sendTypingEnd,
  };
};

export default useTypingIndicator;
