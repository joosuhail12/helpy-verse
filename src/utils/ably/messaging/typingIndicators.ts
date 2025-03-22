
import { initializeAbly } from '../connection/connectionManager';

/**
 * Monitor typing indicators for a conversation
 */
export const monitorTypingIndicators = (
  conversationId: string, 
  onTypingUsersChange: (typingUsers: string[]) => void
): (() => void) => {
  try {
    // Create subscription promise
    const subscriptionPromise = initializeAbly().then(ably => {
      const channel = ably.channels.get(`typing:${conversationId}`);
      const typingUsers: Record<string, { name: string; timestamp: number }> = {};
      
      // Function to update typing users list
      const updateTypingUsersList = () => {
        const now = Date.now();
        const activeUsers = Object.entries(typingUsers)
          .filter(([_, data]) => now - data.timestamp < 5000) // Consider typing expired after 5 seconds
          .map(([_, data]) => data.name);
        
        onTypingUsersChange(activeUsers);
      };
      
      // Set up interval to clean up expired typing indicators
      const cleanupInterval = setInterval(() => {
        updateTypingUsersList();
      }, 1000);
      
      // Subscribe to typing events
      const typingHandler = (message: any) => {
        const { userId, userName, isTyping } = message.data;
        
        if (!userId || !userName) return;
        
        if (isTyping) {
          typingUsers[userId] = { name: userName, timestamp: Date.now() };
        } else {
          delete typingUsers[userId];
        }
        
        updateTypingUsersList();
      };
      
      channel.subscribe('typing', typingHandler);
      
      // Return cleanup function
      return () => {
        try {
          clearInterval(cleanupInterval);
          channel.unsubscribe('typing', typingHandler);
        } catch (error) {
          console.error('Error unsubscribing from typing indicators:', error);
        }
      };
    }).catch(err => {
      console.error('Error setting up typing indicators:', err);
      return () => {}; // Return no-op cleanup function on error
    });
    
    // Return a function that will call the cleanup when invoked
    return () => {
      subscriptionPromise.then(cleanup => cleanup()).catch(err => {
        console.error('Error cleaning up typing subscription:', err);
      });
    };
  } catch (error) {
    console.error('Failed to monitor typing indicators:', error);
    return () => {};
  }
};

/**
 * Update typing status for a user
 */
export const updateTypingStatus = async (
  conversationId: string,
  userId: string,
  userName: string,
  isTyping: boolean
): Promise<void> => {
  try {
    const ably = await initializeAbly();
    const channel = ably.channels.get(`typing:${conversationId}`);
    
    await channel.publish('typing', {
      userId,
      userName,
      isTyping,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Failed to update typing status:', error);
  }
};
