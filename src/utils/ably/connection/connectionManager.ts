import * as Ably from 'ably';
import { v4 as uuidv4 } from 'uuid';

// Store the Ably instance
let ablyInstance: Ably.Realtime | null = null;

// Connection options with sensible defaults
export const connectionOptions: Ably.Types.ClientOptions = {
  authUrl: '/api/get-ably-token',
  clientId: `user-${uuidv4()}`,
  echoMessages: false,
  autoConnect: true,
  logLevel: 3 // Warning level for production
};

/**
 * Initialize Ably client with proper error handling
 * @returns Promise that resolves to the Ably client
 */
export const initializeAbly = async (): Promise<Ably.Realtime> => {
  if (ablyInstance && ablyInstance.connection.state === 'connected') {
    console.log('Reusing existing Ably connection');
    return ablyInstance;
  }

  try {
    // Create a new Ably instance
    console.log('Creating new Ably connection');
    
    // If we have a custom auth endpoint from the backend, use it
    const authEndpoint = import.meta.env.VITE_ABLY_AUTH_ENDPOINT || '/api/get-ably-token';
    const clientId = localStorage.getItem('user-id') || `user-${uuidv4()}`;
    
    // Store the client ID for consistent identification
    if (!localStorage.getItem('user-id')) {
      localStorage.setItem('user-id', clientId);
    }
    
    const ably = new Ably.Realtime({
      ...connectionOptions,
      authUrl: authEndpoint,
      clientId
    });

    // Return a promise that resolves when connected or rejects on failure
    return new Promise((resolve, reject) => {
      const onStateChange = (stateChange: Ably.Types.ConnectionStateChange) => {
        console.log(`Ably connection state changed to: ${stateChange.current}`);
        
        if (stateChange.current === 'connected') {
          ably.connection.off(onStateChange);
          ablyInstance = ably;
          resolve(ably);
        } else if (stateChange.current === 'failed' || stateChange.current === 'suspended') {
          ably.connection.off(onStateChange);
          reject(new Error(`Ably connection ${stateChange.current}: ${stateChange.reason}`));
        }
      };

      // If already connected, resolve immediately
      if (ably.connection.state === 'connected') {
        ablyInstance = ably;
        resolve(ably);
        return;
      }

      // Otherwise wait for connection
      ably.connection.on(onStateChange);
      
      // Set a timeout to prevent hanging indefinitely
      setTimeout(() => {
        if (ably.connection.state !== 'connected') {
          ably.connection.off(onStateChange);
          reject(new Error('Ably connection timeout after 10 seconds'));
        }
      }, 10000);
    });
  } catch (error) {
    console.error('Error initializing Ably:', error);
    throw error;
  }
};

/**
 * Get the existing Ably instance or create a new one
 */
export const getAblyInstance = (): Ably.Realtime | null => {
  return ablyInstance;
};

/**
 * Set the Ably instance (useful for testing)
 */
export const setAblyInstance = (instance: Ably.Realtime | null): void => {
  ablyInstance = instance;
};
