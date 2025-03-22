
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
      
      // Return a cleanup function that properly handles both the event subscription
      // and the channel cleanup
      return () => {
        // First handle the event unsubscription if it's a function
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
        
        // Then handle the channel cleanup
        try {
          if (channel) {
            channel.unsubscribe();
            channel.detach();
          }
        } catch (error) {
          console.error('Error during channel cleanup:', error);
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
