
import { initializeAbly } from './ablyConnection';

/**
 * Get or create an Ably channel with the specified name
 * @param channelName Name of the channel to get or create
 * @returns A promise that resolves to the channel object
 */
export const getAblyChannel = async (channelName: string) => {
  try {
    const ably = await initializeAbly();
    const channel = ably.channels.get(channelName);
    
    return channel;
  } catch (error) {
    console.error(`Error getting Ably channel '${channelName}':`, error);
    
    // Create a mock channel for development/fallback purposes
    return {
      subscribe: (eventName: string, callback: Function) => {
        console.log(`[MOCK] Subscribed to ${eventName} on channel ${channelName}`);
        return () => {
          console.log(`[MOCK] Unsubscribed from ${eventName} on channel ${channelName}`);
        };
      },
      unsubscribe: () => {
        console.log(`[MOCK] Unsubscribed from channel ${channelName}`);
      },
      publish: async (eventName: string, data: any) => {
        console.log(`[MOCK] Published ${eventName} to channel ${channelName}`, data);
        return Promise.resolve();
      },
      presence: {
        enter: (data: any) => {
          console.log(`[MOCK] Entered presence on channel ${channelName}`, data);
          return Promise.resolve();
        },
        leave: () => {
          console.log(`[MOCK] Left presence on channel ${channelName}`);
          return Promise.resolve();
        },
        subscribe: (event: string, callback: Function) => {
          console.log(`[MOCK] Subscribed to presence ${event} on channel ${channelName}`);
          return () => {
            console.log(`[MOCK] Unsubscribed from presence ${event} on channel ${channelName}`);
          };
        },
        unsubscribe: () => {
          console.log(`[MOCK] Unsubscribed from presence on channel ${channelName}`);
        },
        get: () => {
          return Promise.resolve([]);
        }
      }
    };
  }
};
