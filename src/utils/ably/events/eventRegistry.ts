
/**
 * Registry for event handlers to manage cleanup
 */

// Store cleanup functions by channel name
export const eventHandlers: Record<string, (() => void)[]> = {};

/**
 * Register a cleanup function for a channel
 */
export const registerCleanup = (channelName: string, cleanup: () => void): void => {
  if (!eventHandlers[channelName]) {
    eventHandlers[channelName] = [];
  }
  
  eventHandlers[channelName].push(cleanup);
};

/**
 * Clean up all handlers for a channel
 */
export const cleanupChannel = (channelName: string): void => {
  if (eventHandlers[channelName]) {
    eventHandlers[channelName].forEach(cleanup => {
      try {
        cleanup();
      } catch (error) {
        console.error(`Error during channel cleanup for ${channelName}:`, error);
      }
    });
    
    delete eventHandlers[channelName];
  }
};

/**
 * Clean up all handlers
 */
export const cleanupAllHandlers = (): void => {
  Object.keys(eventHandlers).forEach(channelName => {
    cleanupChannel(channelName);
  });
};
