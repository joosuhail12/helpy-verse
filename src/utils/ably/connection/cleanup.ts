
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
      // We need to manually iterate through channels since 'all' is not a property
      // but a method in the current Ably SDK version
      const channelNames: string[] = [];
      
      // Get all channel instances
      for (const channelName in channels) {
        if (Object.prototype.hasOwnProperty.call(channels, channelName)) {
          try {
            channelNames.push(channelName);
          } catch (error) {
            console.error(`Error accessing channel ${channelName}:`, error);
          }
        }
      }
      
      // Detach each channel
      for (const channelName of channelNames) {
        try {
          const channel = channels.get(channelName);
          channel.detach();
        } catch (error) {
          console.error(`Error detaching channel ${channelName}:`, error);
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
