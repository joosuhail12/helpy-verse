
import { getAblyInstance, setAblyInstance } from './connectionManager';
import { clearAllEventHandlers } from '../events/eventRegistry';

/**
 * Clean up Ably connection and event handlers
 */
export const cleanupAblyConnection = (): void => {
  const ablyInstance = getAblyInstance();
  
  if (ablyInstance) {
    try {
      ablyInstance.close();
      setAblyInstance(null);
      
      // Clean up all event handlers
      clearAllEventHandlers();
      
      console.log('Ably connection and event handlers cleaned up');
    } catch (error) {
      console.error('Error during Ably cleanup:', error);
    }
  }
};
