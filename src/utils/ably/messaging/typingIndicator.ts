
/**
 * Typing indicator functionality for real-time chat
 */
import { getAblyChannel } from '../index';

// Event names
const TYPING_START = 'typing:start';
const TYPING_STOP = 'typing:stop';

// Debounce duration for typing events (ms)
const TYPING_DEBOUNCE = 1000;

interface TypingIndicatorOptions {
  throttleInterval?: number;
  typingTimeout?: number;
}

/**
 * Manages typing indicators in a conversation
 */
export const setupTypingIndicator = async (
  channelName: string,
  clientId: string,
  options: TypingIndicatorOptions = {},
  callbacks: {
    onTypingStarted?: (clientId: string, data?: any) => void;
    onTypingStopped?: (clientId: string, data?: any) => void;
  }
) => {
  // Default options
  const throttleMs = options.throttleInterval || TYPING_DEBOUNCE;
  const typingTimeoutMs = options.typingTimeout || (TYPING_DEBOUNCE * 2);
  
  let typingTimeout: ReturnType<typeof setTimeout> | null = null;
  let lastTypingEvent = 0;
  
  try {
    const channel = await getAblyChannel(channelName);
    
    // Subscribe to typing events
    const startSubscription = channel.subscribe(TYPING_START, (message) => {
      // Ignore own typing events
      if (message.clientId === clientId) return;
      
      if (callbacks.onTypingStarted) {
        callbacks.onTypingStarted(message.clientId, message.data);
      }
    });
    
    const stopSubscription = channel.subscribe(TYPING_STOP, (message) => {
      // Ignore own typing events
      if (message.clientId === clientId) return;
      
      if (callbacks.onTypingStopped) {
        callbacks.onTypingStopped(message.clientId, message.data);
      }
    });
    
    // Method to signal typing start
    const signalTypingStart = () => {
      const now = Date.now();
      
      // Check if we should throttle
      if ((now - lastTypingEvent) < throttleMs) {
        return;
      }
      
      // Update last event time
      lastTypingEvent = now;
      
      // Send typing start event
      channel.publish(TYPING_START, {
        clientId,
        timestamp: now
      });
      
      // Clear any existing timeout
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      
      // Set timeout to automatically stop typing
      typingTimeout = setTimeout(() => {
        signalTypingStop();
      }, typingTimeoutMs);
    };
    
    // Method to signal typing stop
    const signalTypingStop = () => {
      // Clear any existing timeout
      if (typingTimeout) {
        clearTimeout(typingTimeout);
        typingTimeout = null;
      }
      
      // Send typing stop event
      channel.publish(TYPING_STOP, {
        clientId,
        timestamp: Date.now()
      });
    };
    
    // Return methods and cleanup function
    return {
      signalTypingStart,
      signalTypingStop,
      cleanup: () => {
        if (startSubscription && typeof startSubscription.unsubscribe === 'function') {
          startSubscription.unsubscribe();
        }
        if (stopSubscription && typeof stopSubscription.unsubscribe === 'function') {
          stopSubscription.unsubscribe();
        }
        if (typingTimeout) {
          clearTimeout(typingTimeout);
        }
      }
    };
  } catch (error) {
    console.error('Error setting up typing indicator:', error);
    
    // Return dummy methods if setup fails
    return {
      signalTypingStart: () => {},
      signalTypingStop: () => {},
      cleanup: () => {}
    };
  }
};
