
/**
 * Simple Ably channel manager for realtime messaging
 * This is a stub implementation that allows the app to compile
 * without actual Ably functionality
 */

// Mock channel interface
interface AblyChannel {
  subscribe: (eventName: string, callback: (message: any) => void) => void;
  unsubscribe: (eventName?: string, callback?: (message: any) => void) => void;
  publish: (eventName: string, data: any) => Promise<void>;
  presence: {
    enter: (data: any) => Promise<void>;
    leave: () => Promise<void>;
    get: (callback: (err: Error | null, members?: any[]) => void) => void;
    subscribe: (event: string, callback: (member: any) => void) => void;
    unsubscribe: (event?: string, callback?: (member: any) => void) => void;
  };
}

// Get a workspace-specific channel name
export const getWorkspaceChannelName = (workspaceId: string, channelName: string): string => {
  return `${workspaceId}:${channelName}`;
};

// Get a channel from Ably
export const getAblyChannel = async (channelName: string): Promise<AblyChannel> => {
  console.log(`Creating mock Ably channel: ${channelName}`);
  
  // Return a mock implementation
  return {
    subscribe: (eventName, callback) => {
      console.log(`Subscribed to ${eventName} on channel ${channelName}`);
    },
    unsubscribe: (eventName, callback) => {
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
      get: (callback) => {
        console.log(`Getting presence members on channel ${channelName}`);
        callback(null, []);
      },
      subscribe: (event, callback) => {
        console.log(`Subscribed to presence ${event} on channel ${channelName}`);
      },
      unsubscribe: (event, callback) => {
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
