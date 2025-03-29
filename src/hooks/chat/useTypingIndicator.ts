import { useState, useEffect, useCallback } from 'react';
import { useMessageSubscription } from './useMessageSubscription';

interface TypingUser {
  userId: string;
  username: string;
  timestamp: number;
}

/**
 * Hook to manage typing indicators in chat
 */
export const useTypingIndicator = (conversationId: string) => {
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  
  // Set up subscription for typing indicators
  const { publishTypingStatus } = useMessageSubscription(
    conversationId,
    'typing',
    {
      onTyping: ({ userId, username, isTyping }) => {
        if (isTyping) {
          // Add user to typing users list
          setTypingUsers(prev => {
            // If user already in list, update their timestamp
            if (prev.some(u => u.userId === userId)) {
              return prev.map(u => u.userId === userId ? {
                ...u,
                timestamp: Date.now()
              } : u);
            }
            
            // Otherwise add them
            return [...prev, {
              userId,
              username,
              timestamp: Date.now()
            }];
          });
        } else {
          // Remove user from typing users list
          setTypingUsers(prev => prev.filter(u => u.userId !== userId));
        }
      }
    }
  );
  
  // Send typing indicator
  const sendTypingIndicator = useCallback(
    (isTyping: boolean, username?: string) => {
      // Generate a unique user ID if not already set
      const userId = localStorage.getItem('chat_user_id') || `user-${Date.now()}`;
      if (!localStorage.getItem('chat_user_id')) {
        localStorage.setItem('chat_user_id', userId);
      }
      
      publishTypingStatus(
        userId,
        username || 'User',
        isTyping
      );
    },
    [publishTypingStatus]
  );
  
  // Check if a specific user is typing
  const isUserTyping = useCallback(
    (userId: string): boolean => {
      return typingUsers.some(u => u.userId === userId);
    },
    [typingUsers]
  );
  
  // Clean up expired typing indicators
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setTypingUsers(prev => prev.filter(user => {
        // Remove users who have been "typing" for more than 5 seconds
        return now - user.timestamp < 5000;
      }));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return {
    typingUsers,
    sendTypingIndicator,
    isUserTyping
  };
};
