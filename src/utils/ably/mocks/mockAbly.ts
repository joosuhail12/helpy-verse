
import * as Ably from 'ably';
import { eventHandlers } from '../events/eventRegistry';

/**
 * Create a mock Ably client for development and testing
 */
export function createMockAbly(): Ably.Realtime {
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
          },
          unsubscribe: () => {
            console.log(`Unsubscribed from presence on ${channelName}`);
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
        },
        unsubscribe: () => {
          console.log(`Unsubscribed from channel ${channelName}`);
        },
        detach: () => {
          console.log(`Detached from channel ${channelName}`);
          return Promise.resolve();
        }
      })
    },
    close: () => {
      console.log('Mock Ably connection closed');
      const { setAblyInstance } = require('../connection/connectionManager');
      setAblyInstance(null);
    }
  } as unknown as Ably.Realtime;
}
