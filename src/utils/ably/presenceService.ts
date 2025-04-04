
/**
 * User presence management service using Ably
 */
import { getAblyChannel } from '../ably';

export interface PresenceData {
  clientId: string;
  username?: string;
  status?: 'online' | 'away' | 'typing';
  lastSeen?: string;
  metadata?: Record<string, any>;
}

export const enterPresence = async (
  workspaceId: string,
  conversationId: string,
  presenceData: PresenceData
): Promise<void> => {
  const channelName = `${workspaceId}:conversations:${conversationId}`;
  
  // Enter presence
  const channel = await getAblyChannel(channelName);
  await channel.presence.enter(presenceData);
};

export const updatePresence = async (
  workspaceId: string,
  conversationId: string,
  presenceData: PresenceData
): Promise<void> => {
  const channelName = `${workspaceId}:conversations:${conversationId}`;
  
  // Use enter instead of update since our mock implementation doesn't have update
  const channel = await getAblyChannel(channelName);
  await channel.presence.enter(presenceData);
};

export const leavePresence = async (
  workspaceId: string,
  conversationId: string
): Promise<void> => {
  const channelName = `${workspaceId}:conversations:${conversationId}`;
  
  // Leave presence
  const channel = await getAblyChannel(channelName);
  await channel.presence.leave();
};

export const getPresent = async (
  workspaceId: string,
  conversationId: string
): Promise<PresenceData[]> => {
  const channelName = `${workspaceId}:conversations:${conversationId}`;
  
  // Get present clients
  const channel = await getAblyChannel(channelName);
  
  return new Promise((resolve, reject) => {
    channel.presence.get((err, members) => {
      if (err) {
        reject(err);
        return;
      }
      
      if (members) {
        resolve(members.map(member => member.data as PresenceData));
      } else {
        resolve([]);
      }
    });
  });
};
