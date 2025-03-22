
import { getAblyChannel } from '../channelService';

/**
 * Update the typing status of a user
 */
export const updateTypingStatus = async (
  channelName: string,
  userId: string,
  isTyping: boolean
): Promise<void> => {
  const channel = await getAblyChannel(channelName);
  
  await channel.presence.update({
    userId,
    isTyping,
    timestamp: Date.now()
  });
};

/**
 * Monitor typing indicators from users in a channel
 */
export const monitorTypingIndicators = async (
  channelName: string,
  callback: (typingUsers: string[]) => void
): Promise<() => void> => {
  const channel = await getAblyChannel(channelName);
  
  // Track who is currently typing
  const typingUsers = new Map<string, { name: string, timestamp: number }>();
  
  // Cleanup timeout for stale typing indicators
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    let changed = false;
    
    // Remove typing indicators older than 3 seconds
    typingUsers.forEach((data, userId) => {
      if (now - data.timestamp > 3000) {
        typingUsers.delete(userId);
        changed = true;
      }
    });
    
    if (changed) {
      callback(Array.from(typingUsers.values()).map(data => data.name));
    }
  }, 1000);
  
  // Handle presence updates
  const handlePresence = (presenceMessage: any) => {
    const { clientId, data } = presenceMessage;
    
    if (data?.isTyping) {
      typingUsers.set(clientId, {
        name: data.name || clientId,
        timestamp: Date.now()
      });
    } else {
      typingUsers.delete(clientId);
    }
    
    callback(Array.from(typingUsers.values()).map(data => data.name));
  };
  
  channel.presence.subscribe(handlePresence);
  
  // Return cleanup function
  return () => {
    clearInterval(cleanupInterval);
    channel.presence.unsubscribe(handlePresence);
  };
};
