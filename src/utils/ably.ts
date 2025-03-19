
/**
 * Utility functions for working with Ably real-time messaging
 */

// Mock implementation for development
let channels: Record<string, any> = {};

export const getAblyChannel = async (channelName: string) => {
  // In a real implementation, this would connect to Ably
  if (!channels[channelName]) {
    channels[channelName] = {
      subscribe: (eventName: string, callback: Function) => {
        console.log(`Subscribed to ${eventName} on channel ${channelName}`);
        // Mock implementation
        return () => {
          console.log(`Unsubscribed from ${eventName} on channel ${channelName}`);
        };
      },
      unsubscribe: () => {
        console.log(`Unsubscribed from channel ${channelName}`);
      },
      publish: async (eventName: string, data: any) => {
        console.log(`Published ${eventName} to channel ${channelName}`, data);
        return Promise.resolve();
      },
      presence: {
        enter: (data: any) => {
          console.log(`Entered presence on channel ${channelName}`, data);
          return Promise.resolve();
        },
        leave: () => {
          console.log(`Left presence on channel ${channelName}`);
          return Promise.resolve();
        },
        subscribe: (event: string, callback: Function) => {
          console.log(`Subscribed to presence ${event} on channel ${channelName}`);
          return () => {
            console.log(`Unsubscribed from presence ${event} on channel ${channelName}`);
          };
        },
        unsubscribe: () => {
          console.log(`Unsubscribed from presence on channel ${channelName}`);
        },
        get: () => {
          return Promise.resolve([]);
        }
      }
    };
  }
  return channels[channelName];
};

export const cleanupAblyChannels = () => {
  // In a real implementation, this would clean up Ably connections
  Object.keys(channels).forEach(channelName => {
    console.log(`Cleaning up channel ${channelName}`);
  });
  channels = {};
};
