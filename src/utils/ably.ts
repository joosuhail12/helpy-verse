
/**
 * Simple Ably channel manager for realtime messaging
 * This is a stub implementation that allows the app to compile
 * without actual Ably functionality
 */

// Mock channel interface
interface AblyChannel {
  subscribe: (eventName: string, callback: (message: any) => void) => void;
  unsubscribe: (eventName?: string) => void;
  publish: (eventName: string, data: any) => Promise<void>;
  presence: {
    enter: (data: any) => Promise<void>;
    leave: () => Promise<void>;
    get: () => Promise<any[]>;
    subscribe: (event: string, callback: (member: any) => void) => void;
    unsubscribe: () => void;
  };
}

// Get a channel from Ably
export const getAblyChannel = async (channelName: string): Promise<AblyChannel> => {
  console.log(`Creating mock Ably channel: ${channelName}`);
  
  // Return a mock implementation
  return {
    subscribe: (eventName, callback) => {
      console.log(`Subscribed to ${eventName} on channel ${channelName}`);
    },
    unsubscribe: (eventName) => {
      console.log(`Unsubscribed from ${eventName || 'all events'} on channel ${channelName}`);
    },
    publish: async (eventName, data) => {
      console.log(`Published to ${eventName} on channel ${channelName}:`, data);
    },
    presence: {
      enter: async (data) => {
        console.log(`Entered presence on channel ${channelName} with data:`, data);
      },
      leave: async () => {
        console.log(`Left presence on channel ${channelName}`);
      },
      get: async () => {
        console.log(`Getting presence members on channel ${channelName}`);
        return [];
      },
      subscribe: (event, callback) => {
        console.log(`Subscribed to presence ${event} on channel ${channelName}`);
      },
      unsubscribe: () => {
        console.log(`Unsubscribed from presence on channel ${channelName}`);
      }
    }
  };
};

// Mock realtime connection status
export const getRealtimeConnectionStatus = () => {
  return {
    isConnected: true,
    lastConnected: new Date().toISOString(),
  };
};
