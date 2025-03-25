
import { useState, useCallback, useEffect } from 'react';
import { getAblyChannel, getWorkspaceChannelName } from '@/utils/ably';
import { useAbly } from '@/context/AblyContext';

export interface TypingUser {
  clientId: string;
  name?: string;
}

interface TypingIndicatorOptions {
  onTypingStatusChanged?: (typingStatuses: Record<string, boolean>) => void;
}

export const useTypingIndicator = (
  conversationId: string, 
  workspaceId: string,
  options?: TypingIndicatorOptions
) => {
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const { clientId } = useAbly();
  const [channel, setChannel] = useState<any>(null);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [subscription, setSubscription] = useState<any>(null);

  // Initialize channel
  useEffect(() => {
    const initChannel = async () => {
      const channelName = getWorkspaceChannelName(workspaceId, `conversations:${conversationId}:typing`);
      const ablyChannel = await getAblyChannel(channelName);
      
      setChannel(ablyChannel);
      
      // Subscribe to typing events
      const sub = ablyChannel.subscribe('typing', (message: any) => {
        const { clientId: typingClientId, isTyping } = message.data;
        
        setTypingUsers((prevUsers) => {
          // Update typing users list
          if (isTyping) {
            // Add user if not already in the list
            if (!prevUsers.some(user => user.clientId === typingClientId)) {
              return [...prevUsers, { clientId: typingClientId }];
            }
          } else {
            // Remove user from the list
            return prevUsers.filter(user => user.clientId !== typingClientId);
          }
          
          return prevUsers;
        });
        
        // Call the callback if provided
        if (options?.onTypingStatusChanged) {
          options.onTypingStatusChanged({ [typingClientId]: isTyping });
        }
      });
      
      setSubscription(sub);
    };
    
    initChannel();
    
    // Clean up subscription when component unmounts
    return () => {
      if (subscription) {
        try {
          subscription.unsubscribe();
        } catch (err) {
          console.error('Error unsubscribing from typing events:', err);
        }
      }
    };
  }, [conversationId, workspaceId, options, clientId]);

  // Start typing indicator
  const startTyping = useCallback(async () => {
    if (!channel) return;
    
    // Clear any existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    // Publish typing started event
    try {
      await channel.publish('typing', { clientId, isTyping: true });
      
      // Set timeout to automatically stop typing indicator after 5 seconds
      const timeout = setTimeout(async () => {
        if (channel) {
          await channel.publish('typing', { clientId, isTyping: false });
        }
      }, 5000);
      
      setTypingTimeout(timeout);
    } catch (error) {
      console.error('Error publishing typing indicator:', error);
    }
  }, [channel, clientId, typingTimeout]);

  // Stop typing indicator
  const stopTyping = useCallback(async () => {
    if (!channel) return;
    
    // Clear any existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
      setTypingTimeout(null);
    }
    
    // Publish typing stopped event
    try {
      await channel.publish('typing', { clientId, isTyping: false });
    } catch (error) {
      console.error('Error publishing typing stopped indicator:', error);
    }
  }, [channel, clientId, typingTimeout]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      
      // Try to stop typing indication when component unmounts
      if (channel) {
        channel.publish('typing', { clientId, isTyping: false }).catch((err: any) => {
          console.error('Error cleaning up typing indicator:', err);
        });
      }
    };
  }, [channel, clientId, typingTimeout]);

  return { typingUsers, startTyping, stopTyping };
};
