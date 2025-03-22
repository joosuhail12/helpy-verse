
import { getAblyChannel, publishToChannel, subscribeToChannel } from '../channelService';
import * as Ably from 'ably';

// Cache for typing status to avoid redundant updates
const typingStatusCache: Record<string, boolean> = {};

/**
 * Update typing status in a conversation
 */
export const updateTypingStatus = async (
  conversationId: string,
  userId: string,
  isTyping: boolean
): Promise<void> => {
  // Check cache to avoid redundant updates
  const cacheKey = `${conversationId}-${userId}`;
  if (typingStatusCache[cacheKey] === isTyping) {
    return;
  }
  
  // Update cache
  typingStatusCache[cacheKey] = isTyping;
  
  try {
    // Publish typing status
    await publishToChannel(
      `conversation:${conversationId}`,
      'typing',
      {
        userId,
        isTyping,
        timestamp: new Date().toISOString()
      }
    );
  } catch (error) {
    console.error(`Error updating typing status for conversation ${conversationId}:`, error);
    
    // Reset cache on error
    typingStatusCache[cacheKey] = !isTyping;
    throw error;
  }
};

/**
 * Monitor typing indicators in a conversation
 */
export const monitorTypingIndicators = async (
  conversationId: string,
  onTypingUpdated: (typingUsers: string[]) => void
): Promise<() => void> => {
  // Store active typing users with expiration timestamps
  const typingUsers: Record<string, { name: string; expiresAt: number }> = {};
  
  // Interval to clean up expired typing indicators
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    let updated = false;
    
    // Remove expired typing statuses
    Object.keys(typingUsers).forEach(userId => {
      if (typingUsers[userId].expiresAt <= now) {
        delete typingUsers[userId];
        updated = true;
      }
    });
    
    if (updated) {
      // Return only the names of users who are typing
      onTypingUpdated(Object.values(typingUsers).map(user => user.name));
    }
  }, 1000);
  
  try {
    // Subscribe to typing events
    const unsubscribe = await subscribeToChannel(
      `conversation:${conversationId}`,
      'typing',
      (message: Ably.Types.Message) => {
        const data = message.data;
        const userId = data.userId;
        const userName = data.userName || userId;
        
        if (data.isTyping) {
          // Add or update typing user with 3 second expiration
          typingUsers[userId] = {
            name: userName,
            expiresAt: Date.now() + 3000
          };
        } else {
          // Remove typing user
          delete typingUsers[userId];
        }
        
        // Return only the names of users who are typing
        onTypingUpdated(Object.values(typingUsers).map(user => user.name));
      }
    );
    
    // Return cleanup function
    return () => {
      clearInterval(cleanupInterval);
      unsubscribe();
    };
  } catch (error) {
    console.error(`Error monitoring typing indicators for conversation ${conversationId}:`, error);
    
    // Clean up interval on error
    clearInterval(cleanupInterval);
    
    return () => {};
  }
};
