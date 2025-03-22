
import { initializeAbly } from '../connection/connectionManager';
import { eventHandlers } from '../events/eventRegistry';
import { ChatMessage } from '../types';
import * as Ably from 'ably';

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
      const subscriptionHandler = (message: Ably.Types.Message) => {
        // Use requestAnimationFrame to handle messages in animation frame
        // for better UI performance when receiving rapid messages
        window.requestAnimationFrame(() => {
          onMessage(message.data as ChatMessage);
        });
      };
      
      channel.subscribe('message', subscriptionHandler);
      
      // Save subscription reference
      if (!eventHandlers[`conversation:${conversationId}`]) {
        eventHandlers[`conversation:${conversationId}`] = [];
      }
      
      // Store cleanup function
      const cleanup = () => {
        try {
          if (channel && channel.unsubscribe) {
            channel.unsubscribe('message', subscriptionHandler);
            channel.detach();
          }
        } catch (error) {
          console.error('Error during channel cleanup:', error);
        }
      };
      
      eventHandlers[`conversation:${conversationId}`].push(cleanup);
      
      // Return a cleanup function that properly handles both the event subscription
      // and the channel cleanup
      return cleanup;
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
