
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
      ably.channels.all().forEach(channel => {
        try {
          channel.detach();
        } catch (error) {
          console.error(`Error detaching channel ${channel.name}:`, error);
        }
      });
      
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
