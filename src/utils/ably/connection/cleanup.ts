
import { getAblyInstance, setAblyInstance } from './connectionManager';
import { cleanupAllHandlers } from '../events/eventRegistry';

/**
 * Clean up Ably connection and all subscribers
 */
export const cleanupAblyConnection = async (): Promise<void> => {
  try {
    // Get the current Ably instance
    const ably = getAblyInstance();
    
    if (ably) {
      // Clean up all event handlers
      cleanupAllHandlers();
      
      // Close all channels
      const channels = ably.channels;
      // Get all channel names through iterating
      for (const channelName in channels.all) {
        if (Object.prototype.hasOwnProperty.call(channels.all, channelName)) {
          try {
            const channel = channels.get(channelName);
            channel.detach();
          } catch (error) {
            console.error(`Error detaching channel ${channelName}:`, error);
          }
        }
      }
      
      // Close the connection
      await new Promise<void>((resolve) => {
        ably.connection.once('closed', () => {
          resolve();
        });
        
        ably.close();
      });
      
      // Clear the instance
      setAblyInstance(null);
      
      console.log('Ably connection cleaned up successfully');
    }
  } catch (error) {
    console.error('Error cleaning up Ably connection:', error);
  }
};
