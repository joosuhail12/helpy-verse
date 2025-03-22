import { initializeAbly, eventHandlers } from './ablyConnection';
import { ChatMessage } from './types';
import { throttle } from '@/utils/performance/performanceUtils';

/**
 * Subscribe to messages in a conversation with optimized handling
 */
export const subscribeToConversation = (
  conversationId: string,
  onMessage: (message: ChatMessage) => void
): (() => void) => {
  try {
    // Optimize by not awaiting connection - this speeds up subscription
    const subscriptionPromise = initializeAbly().then(ably => {
      const channel = ably.channels.get(`conversation:${conversationId}`);
      
      // Subscribe with optimized message handling
      const unsubscribe = channel.subscribe('message', (message) => {
        // Use requestAnimationFrame to handle messages in animation frame
        // for better UI performance when receiving rapid messages
        window.requestAnimationFrame(() => {
          onMessage(message.data as ChatMessage);
        });
      });
      
      // Save subscription reference
      if (!eventHandlers[`conversation:${conversationId}`]) {
        eventHandlers[`conversation:${conversationId}`] = [];
      }
      
      // Make sure we only store function type callbacks
      if (typeof unsubscribe === 'function') {
        eventHandlers[`conversation:${conversationId}`].push(unsubscribe);
      }
      
      // Return the unsubscribe function
      return () => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      };
    }).catch(err => {
      console.error('Error subscribing to conversation:', err);
      // Return a no-op function in case of error
      return () => {};
    });
    
    // Return unsubscribe function that properly handles promises
    return () => {
      subscriptionPromise.then(unsubscribeFn => {
        if (typeof unsubscribeFn === 'function') {
          unsubscribeFn();
        }
      }).catch(err => {
        console.error('Error unsubscribing:', err);
      });
    };
  } catch (error) {
    console.error('Failed to subscribe to conversation:', error);
    return () => {};
  }
};

/**
 * Monitor typing indicators with performance optimization
 */
export const monitorTypingIndicators = (
  conversationId: string,
  onTypingStatusChange: (users: string[]) => void
): () => void => {
  try {
    initializeAbly().then(ably => {
      const channel = ably.channels.get(`conversation:${conversationId}`);
      
      channel.presence.subscribe('update', (member) => {
        if (member.data?.isTyping !== undefined) {
          // Get all current presence data to determine who's typing
          channel.presence.get((err, members) => {
            if (err) {
              console.error('Error getting presence data:', err);
              return;
            }
            
            // Extract typing users
            const typingUsers = members
              .filter(m => m.data?.isTyping)
              .map(m => m.data.name || 'Unknown');
            
            onTypingStatusChange(typingUsers);
          });
        }
      });
    }).catch(err => {
      console.error('Error monitoring typing indicators:', err);
    });
    
    return () => {
      initializeAbly().then(ably => {
        const channel = ably.channels.get(`conversation:${conversationId}`);
        channel.presence.unsubscribe();
      }).catch(err => {
        console.error('Error cleaning up typing indicators:', err);
      });
    };
  } catch (error) {
    console.error('Failed to monitor typing indicators:', error);
    return () => {};
  }
};

/**
 * Update typing status with debouncing
 */
export const updateTypingStatus = throttle(async (
  conversationId: string,
  userId: string,
  userName: string,
  isTyping: boolean
): Promise<void> => {
  try {
    const ably = await initializeAbly();
    const channel = ably.channels.get(`conversation:${conversationId}`);
    
    await channel.presence.enter({
      userId,
      name: userName,
      isTyping,
      lastActive: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to update typing status:', error);
  }
}, 500); // Throttle to 2 updates per second
