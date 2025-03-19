
/**
 * Utility functions for working with Ably real-time messaging
 */
import { createClient, Types as AblyTypes } from 'ably';

// Store connected channels to avoid recreating them
let ablyClient: any = null;
let channels: Record<string, any> = {};

/**
 * Initialize the Ably client
 */
export const initializeAbly = async (): Promise<any> => {
  try {
    if (ablyClient) return ablyClient;
    
    // In production, get token from server
    const tokenResponse = await fetch(`${process.env.REACT_APP_API_URL}/ably-token`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!tokenResponse.ok) {
      console.error('Failed to get Ably token');
      throw new Error('Failed to get Ably token');
    }
    
    const { token } = await tokenResponse.json();
    
    ablyClient = createClient({ token: token });
    console.log('Ably client initialized');
    return ablyClient;
  } catch (error) {
    console.error('Error initializing Ably client:', error);
    
    // Fallback to connection-less mode for development
    console.warn('Using mock Ably implementation for development');
    return {
      connection: {
        state: 'connected'
      },
      channels: {
        get: (channelName: string) => getMockChannel(channelName)
      }
    };
  }
};

const getMockChannel = (channelName: string) => {
  if (!channels[channelName]) {
    channels[channelName] = createMockChannel(channelName);
  }
  return channels[channelName];
};

const createMockChannel = (channelName: string) => {
  return {
    subscribe: (eventName: string, callback: Function) => {
      console.log(`Mock: Subscribed to ${eventName} on channel ${channelName}`);
      return () => {
        console.log(`Mock: Unsubscribed from ${eventName} on channel ${channelName}`);
      };
    },
    unsubscribe: () => {
      console.log(`Mock: Unsubscribed from channel ${channelName}`);
    },
    publish: async (eventName: string, data: any) => {
      console.log(`Mock: Published ${eventName} to channel ${channelName}`, data);
      return Promise.resolve();
    },
    presence: {
      enter: (data: any) => {
        console.log(`Mock: Entered presence on channel ${channelName}`, data);
        return Promise.resolve();
      },
      leave: () => {
        console.log(`Mock: Left presence on channel ${channelName}`);
        return Promise.resolve();
      },
      subscribe: (event: string, callback: Function) => {
        console.log(`Mock: Subscribed to presence ${event} on channel ${channelName}`);
        return () => {
          console.log(`Mock: Unsubscribed from presence ${event} on channel ${channelName}`);
        };
      },
      unsubscribe: () => {
        console.log(`Mock: Unsubscribed from presence on channel ${channelName}`);
      },
      get: () => {
        return Promise.resolve([]);
      }
    }
  };
};

/**
 * Get or create an Ably channel with the given name
 */
export const getAblyChannel = async (channelName: string) => {
  try {
    const client = await initializeAbly();
    
    if (!channels[channelName]) {
      channels[channelName] = client.channels.get(channelName);
      console.log(`Subscribed to Ably channel: ${channelName}`);
    }
    
    return channels[channelName];
  } catch (error) {
    console.error(`Error getting Ably channel ${channelName}:`, error);
    return getMockChannel(channelName);
  }
};

/**
 * Clean up Ably connections and channels
 */
export const cleanupAblyChannels = () => {
  Object.keys(channels).forEach(channelName => {
    try {
      channels[channelName].unsubscribe();
      console.log(`Cleaned up channel ${channelName}`);
    } catch (error) {
      console.error(`Error cleaning up channel ${channelName}:`, error);
    }
  });
  
  channels = {};
  
  if (ablyClient && ablyClient.close) {
    try {
      ablyClient.close();
      ablyClient = null;
      console.log('Closed Ably client connection');
    } catch (error) {
      console.error('Error closing Ably client:', error);
    }
  }
};
