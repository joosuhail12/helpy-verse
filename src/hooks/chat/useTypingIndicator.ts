
import { useState, useEffect, useRef } from 'react';
import { useAbly } from '@/context/AblyContext';

export interface TypingUser {
  clientId: string;
  name?: string;
  timestamp: number;
}

/**
 * Hook to handle typing indicators in a chat
 */
export const useTypingIndicator = (conversationId: string) => {
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const { client, clientId, getChannelName } = useAbly();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const channelRef = useRef<any>(null);

  // Clear typing users after a timeout
  const TYPING_TIMEOUT = 3000;

  useEffect(() => {
    if (!client || !conversationId) return;

    // Initialize channel
    const channelName = getChannelName(conversationId);
    const channel = client.channels.get(channelName);
    channelRef.current = channel;

    // Handle typing start events
    const handleTypingStart = (message: any) => {
      const typingData = message.data as TypingUser;
      
      // Don't show our own typing indicator
      if (typingData.clientId === clientId) return;
      
      setTypingUsers(prevUsers => {
        // Check if this user is already in the typing users list
        const existingUserIndex = prevUsers.findIndex(user => user.clientId === typingData.clientId);
        
        if (existingUserIndex >= 0) {
          // Update existing user's timestamp
          const updatedUsers = [...prevUsers];
          updatedUsers[existingUserIndex] = {
            ...updatedUsers[existingUserIndex],
            timestamp: Date.now()
          };
          return updatedUsers;
        } else {
          // Add new typing user
          return [...prevUsers, { ...typingData, timestamp: Date.now() }];
        }
      });
    };

    // Handle typing stop events
    const handleTypingStop = (message: any) => {
      const { clientId: typingClientId } = message.data;
      
      setTypingUsers(prevUsers => 
        prevUsers.filter(user => user.clientId !== typingClientId)
      );
    };

    // Subscribe to typing events
    const startSubscription = channel.subscribe('typing:start', handleTypingStart);
    const stopSubscription = channel.subscribe('typing:stop', handleTypingStop);

    // Return cleanup function
    return () => {
      // First check if channelRef.current exists before trying to unsubscribe
      if (channelRef.current) {
        // Use try/catch to handle potential errors during cleanup
        try {
          channelRef.current.unsubscribe('typing:start', handleTypingStart);
          channelRef.current.unsubscribe('typing:stop', handleTypingStop);
        } catch (error) {
          console.error('Error unsubscribing from typing events:', error);
        }
      }
      
      // Clear any existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [client, clientId, conversationId, getChannelName]);

  // Clean up stale typing indicators
  useEffect(() => {
    if (typingUsers.length === 0) return;
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to check for stale typing indicators
    typingTimeoutRef.current = setTimeout(() => {
      const now = Date.now();
      setTypingUsers(prevUsers => 
        prevUsers.filter(user => (now - user.timestamp) < TYPING_TIMEOUT)
      );
    }, 1000);
    
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [typingUsers]);

  // Send typing indicator
  const sendTypingIndicator = (isTyping: boolean, name?: string) => {
    if (!channelRef.current || !clientId) return;
    
    try {
      const eventName = isTyping ? 'typing:start' : 'typing:stop';
      const payload = {
        clientId,
        name,
        timestamp: Date.now()
      };
      
      channelRef.current.publish(eventName, payload);
    } catch (error) {
      console.error('Error sending typing indicator:', error);
    }
  };

  // Utility function to check if there are active typing users
  const isUserTyping = (specificClientId?: string) => {
    if (specificClientId) {
      return typingUsers.some(user => user.clientId === specificClientId);
    }
    return typingUsers.length > 0;
  };

  return {
    typingUsers,
    sendTypingIndicator,
    isUserTyping
  };
};
