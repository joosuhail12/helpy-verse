
import { useState, useEffect, useCallback } from 'react';
import { useAbly } from '@/context/AblyContext';
import { debounce } from 'lodash';

export const useTypingIndicator = (conversationId: string, workspaceId: string) => {
  const { client, clientId, getChannelName } = useAbly();
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [channel, setChannel] = useState<any>(null);

  // Initialize channel
  useEffect(() => {
    if (!client) return;
    
    const channelName = getChannelName(conversationId);
    const channelInstance = client.channels.get(channelName);
    
    setChannel({ channel: channelInstance });
    
    return () => {
      client.channels.release(channelName);
    };
  }, [client, conversationId, getChannelName]);

  // Subscribe to typing indicators
  useEffect(() => {
    if (!channel) return;
    
    const handleTypingStart = (message: any) => {
      const { userId, username } = message.data;
      
      // Ignore own typing indicators
      if (userId === clientId) return;
      
      setIsTyping(true);
      setTypingUser(username || 'Someone');
    };
    
    const handleTypingStop = (message: any) => {
      const { userId } = message.data;
      
      // Ignore own typing indicators
      if (userId === clientId) return;
      
      setIsTyping(false);
      setTypingUser(null);
    };
    
    // Subscribe to typing indicators
    const startSubscription = channel.channel.subscribe('typing:start', handleTypingStart);
    const stopSubscription = channel.channel.subscribe('typing:stop', handleTypingStop);
    
    return () => {
      startSubscription.unsubscribe();
      stopSubscription.unsubscribe();
    };
  }, [channel, clientId]);

  // Send typing indicator with debounce
  const debouncedStopTyping = useCallback(
    debounce(() => {
      if (channel && channel.channel) {
        channel.channel.publish('typing:stop', { userId: clientId });
      }
    }, 1000),
    [channel, clientId]
  );

  // Start typing
  const startTyping = useCallback(() => {
    if (channel && channel.channel) {
      channel.channel.publish('typing:start', { 
        userId: clientId,
        username: 'User' 
      });
    }
    
    // Cancel any pending stop typing
    debouncedStopTyping.cancel();
    
    // Schedule stop typing after inactivity
    debouncedStopTyping();
  }, [channel, clientId, debouncedStopTyping]);

  // Stop typing
  const stopTyping = useCallback(() => {
    debouncedStopTyping.cancel();
    
    if (channel && channel.channel) {
      channel.channel.publish('typing:stop', { userId: clientId });
    }
  }, [channel, clientId, debouncedStopTyping]);

  return {
    isTyping,
    typingUser,
    startTyping,
    stopTyping
  };
};
