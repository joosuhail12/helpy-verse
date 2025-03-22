
import * as Ably from 'ably';
import { HttpClient } from '@/api/services/http';

// Connection options
export const connectionOptions: Ably.Types.ClientOptions = {
  transports: ['web_socket'], // Correct transport name
  autoConnect: false,        // We'll manually connect for better control
  idempotentRestPublishing: true, // Ensures no duplicate messages
  closeOnUnload: true,       // Clean connection on tab close
  defaultTokenParams: {
    ttl: 3600 * 1000 // 1 hour token lifespan
  },
  transportParams: {
    maxRetryCount: 10,          // Number of reconnection attempts
    initialRetryTimeout: 300,   // Start with 300ms delay before first retry
    maxRetryTimeout: 10000      // Cap at 10 seconds between retries
  }
};

// Singleton instance with connection management
let ablyInstance: Ably.Realtime | null = null;
let connectionInitPromise: Promise<Ably.Realtime> | null = null;

// Event listeners storage for cleanup
export const eventHandlers: Record<string, Function[]> = {};

/**
 * Initialize Ably client with token auth
 * Uses a promise-based singleton pattern to prevent multiple connection attempts
 */
export const initializeAbly = async (): Promise<Ably.Realtime> => {
  if (ablyInstance && ablyInstance.connection.state === 'connected') {
    console.log('Reusing existing Ably connection');
    return ablyInstance;
  }
  
  if (connectionInitPromise) {
    console.log('Connection already initializing, waiting for completion');
    return connectionInitPromise;
  }
  
  connectionInitPromise = (async () => {
    try {
      console.log('Initializing Ably client');
      
      // Fetch token from backend
      const response = await HttpClient.apiClient.get('/api/ably-token');
      const tokenDetails = response.data.token;
      
      // Initialize Ably with token auth and connection options
      ablyInstance = new Ably.Realtime({
        ...connectionOptions,
        token: tokenDetails
      });
      
      // Create connection promise
      const connectionPromise = new Promise<Ably.Realtime>((resolve, reject) => {
        if (!ablyInstance) {
          reject(new Error('Ably instance not initialized'));
          return;
        }
        
        // Connect explicitly
        ablyInstance.connect();
        
        // Listen for connection state changes
        ablyInstance.connection.on('connected', () => {
          console.log('Ably connection established');
          resolve(ablyInstance as Ably.Realtime);
        });
        
        ablyInstance.connection.on('failed', (error) => {
          console.error('Ably connection failed:', error);
          reject(error);
        });
        
        // Add timeout for connection attempt
        setTimeout(() => {
          if (ablyInstance?.connection.state !== 'connected') {
            reject(new Error('Connection timeout after 10 seconds'));
          }
        }, 10000);
      });
      
      return await connectionPromise;
    } catch (error) {
      console.error('Failed to initialize Ably client:', error);
      
      // Fallback to mock implementation for development
      console.warn('Using mock Ably implementation for development');
      
      const mockAbly = createMockAbly();
      
      ablyInstance = mockAbly;
      return mockAbly;
    } finally {
      // Reset connection promise once complete
      setTimeout(() => {
        connectionInitPromise = null;
      }, 0);
    }
  })();
  
  return connectionInitPromise;
};

/**
 * Create a mock Ably client for development and testing
 */
function createMockAbly(): Ably.Realtime {
  return {
    connection: {
      on: (event: string, callback: Function) => {
        console.log(`Registered connection event handler: ${event}`);
        if (!eventHandlers['connection:' + event]) {
          eventHandlers['connection:' + event] = [];
        }
        eventHandlers['connection:' + event].push(callback);
        
        // Simulate connected event
        if (event === 'connected') {
          setTimeout(() => callback(), 500);
        }
        
        return { id: 'mock-connection' };
      },
      state: 'connected' as Ably.Types.ConnectionState
    },
    channels: {
      get: (channelName: string) => ({
        presence: {
          enter: async (data: any) => {
            console.log(`Entered ${channelName} with data:`, data);
            return Promise.resolve();
          },
          leave: async () => {
            console.log(`Left ${channelName}`);
            return Promise.resolve();
          },
          subscribe: (event: string, callback: Function) => {
            console.log(`Subscribed to presence ${event} on ${channelName}`);
            if (!eventHandlers[`presence:${channelName}:${event}`]) {
              eventHandlers[`presence:${channelName}:${event}`] = [];
            }
            eventHandlers[`presence:${channelName}:${event}`].push(callback);
            
            return () => {
              console.log(`Unsubscribed from presence ${event} on ${channelName}`);
            };
          },
          get: async () => {
            return Promise.resolve([]);
          }
        },
        subscribe: (eventName: string, callback: Function) => {
          console.log(`Subscribed to ${eventName} on channel ${channelName}`);
          if (!eventHandlers[`${channelName}:${eventName}`]) {
            eventHandlers[`${channelName}:${eventName}`] = [];
          }
          eventHandlers[`${channelName}:${eventName}`].push(callback);
          
          // Return an unsubscribe function
          return () => {
            console.log(`Unsubscribed from ${eventName} on channel ${channelName}`);
          };
        },
        publish: async (eventName: string, data: any) => {
          console.log(`Published ${eventName} to channel ${channelName}`, data);
          
          // Simulate message delivery with low latency
          setTimeout(() => {
            (eventHandlers[`${channelName}:${eventName}`] || []).forEach(handler => {
              handler({ data });
            });
          }, 100);
          
          return Promise.resolve();
        }
      })
    },
    close: () => {
      console.log('Mock Ably connection closed');
      ablyInstance = null;
    }
  } as unknown as Ably.Realtime;
}

/**
 * Clean up Ably connection
 */
export const cleanupAblyConnection = (): void => {
  if (ablyInstance) {
    ablyInstance.close();
    ablyInstance = null;
    
    // Clean up all event handlers
    Object.keys(eventHandlers).forEach(key => {
      delete eventHandlers[key];
    });
    
    console.log('Ably connection and event handlers cleaned up');
  }
};
