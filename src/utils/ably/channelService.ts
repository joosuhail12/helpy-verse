
import { initializeAbly } from './connection/connectionManager';
import * as Ably from 'ably';

// Cache to store channel references
const channelCache: Record<string, Ably.Types.RealtimeChannelPromise> = {};

/**
 * Get or create an Ably channel with proper channel name formatting
 * @param channelName Base name for the channel
 * @param options Optional channel parameters
 * @returns Promise resolving to the channel object
 */
export const getAblyChannel = async (
  channelName: string,
  options?: Ably.Types.ChannelOptions
): Promise<Ably.Types.RealtimeChannelPromise> => {
  try {
    // Format channel name according to Ably best practices
    // Prefix public channels for clarity
    const formattedName = channelName.startsWith('ticket:') || 
                         channelName.startsWith('conversation:') || 
                         channelName.startsWith('presence:') ? 
                         channelName : `conversation:${channelName}`;
    
    // Return cached channel if exists
    if (channelCache[formattedName]) {
      return channelCache[formattedName];
    }
    
    // Create new channel
    const ably = await initializeAbly();
    const channel = ably.channels.get(formattedName, options);
    
    // Cache the channel
    channelCache[formattedName] = channel;
    
    return channel;
  } catch (error) {
    console.error(`Error getting Ably channel '${channelName}':`, error);
    throw error;
  }
};

/**
 * Subscribe to a channel with event handling
 * @param channelName Name of the channel to subscribe to
 * @param eventName Event to listen for
 * @param callback Function to call when event is received
 * @returns Promise resolving to an unsubscribe function
 */
export const subscribeToChannel = async (
  channelName: string,
  eventName: string,
  callback: (message: Ably.Types.Message) => void
): Promise<() => void> => {
  const channel = await getAblyChannel(channelName);
  
  // Use correct method to subscribe
  channel.subscribe(eventName, callback);
  
  // Return unsubscribe function
  return () => {
    channel.unsubscribe(eventName, callback);
  };
};

/**
 * Publish a message to a channel
 * @param channelName Name of the channel to publish to
 * @param eventName Event name
 * @param data Data to publish
 * @returns Promise that resolves when message is published
 */
export const publishToChannel = async (
  channelName: string,
  eventName: string,
  data: any
): Promise<void> => {
  const channel = await getAblyChannel(channelName);
  
  return new Promise((resolve, reject) => {
    channel.publish(eventName, data, (err) => {
      if (err) {
        console.error(`Error publishing to channel ${channelName}:`, err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

/**
 * Enter presence on a channel
 * @param channelName Name of the channel
 * @param clientData Client data to send with presence
 * @returns Promise resolving when presence is entered
 */
export const enterChannelPresence = async (
  channelName: string,
  clientData: any
): Promise<void> => {
  const channel = await getAblyChannel(channelName);
  
  return new Promise((resolve, reject) => {
    channel.presence.enter(clientData, (err) => {
      if (err) {
        console.error(`Error entering presence on channel ${channelName}:`, err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

/**
 * Subscribe to presence events on a channel
 * @param channelName Name of the channel
 * @param callback Function to call when presence changes
 * @returns Promise resolving to an unsubscribe function
 */
export const subscribeToPresence = async (
  channelName: string,
  callback: (presenceMessage: Ably.Types.PresenceMessage) => void
): Promise<() => void> => {
  const channel = await getAblyChannel(channelName);
  
  channel.presence.subscribe(callback);
  
  // Return unsubscribe function
  return () => {
    channel.presence.unsubscribe(callback);
  };
};

/**
 * Clean up channel and remove from cache
 * @param channelName Name of the channel to clean up
 */
export const cleanupChannel = async (channelName: string): Promise<void> => {
  // Format the channel name the same way as getAblyChannel
  const formattedName = channelName.startsWith('ticket:') || 
                        channelName.startsWith('conversation:') || 
                        channelName.startsWith('presence:') ? 
                        channelName : `conversation:${channelName}`;
  
  if (channelCache[formattedName]) {
    const channel = channelCache[formattedName];
    
    // Detach to release resources on the Ably side
    try {
      await new Promise<void>((resolve, reject) => {
        channel.detach((err) => {
          if (err) {
            console.error(`Error detaching channel ${formattedName}:`, err);
            reject(err);
          } else {
            resolve();
          }
        });
      });
    } catch (error) {
      console.error(`Error cleaning up channel ${formattedName}:`, error);
    }
    
    // Remove from cache
    delete channelCache[formattedName];
  }
};
