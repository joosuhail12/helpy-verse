
/**
 * Extended presence functionality for Ably
 */
import { getAblyChannel, getWorkspaceChannelName } from '../../ably';

export interface ExtendedPresenceData {
  clientId: string;
  username?: string;
  status: 'online' | 'away' | 'offline' | 'typing';
  lastSeen: string;
  metadata?: Record<string, any>;
}

// Enter chat with extended presence data
export const enterChat = async (
  workspaceId: string,
  conversationId: string,
  username?: string,
  metadata: Record<string, any> = {}
): Promise<void> => {
  const channelName = getWorkspaceChannelName(workspaceId, `conversations:${conversationId}`);
  
  // Get client ID from localStorage or generate if needed
  const clientId = localStorage.getItem('ably_client_id') || 'anonymous-user';
  
  const presenceData: ExtendedPresenceData = {
    clientId,
    username,
    status: 'online',
    lastSeen: new Date().toISOString(),
    metadata
  };
  
  // Enter presence
  const channel = await getAblyChannel(channelName);
  await channel.presence.enter(presenceData);
};

// Update status in presence
export const updateStatus = async (
  workspaceId: string,
  conversationId: string,
  status: 'online' | 'away' | 'offline' | 'typing'
): Promise<void> => {
  const channelName = getWorkspaceChannelName(workspaceId, `conversations:${conversationId}`);
  
  // Get channel
  const channel = await getAblyChannel(channelName);
  
  // Get current presence data
  const presence = await new Promise<any>((resolve) => {
    channel.presence.get((err, members) => {
      if (err) {
        resolve(null);
        return;
      }
      
      // Find own presence
      const clientId = localStorage.getItem('ably_client_id') || 'anonymous-user';
      const ownPresence = members.find(member => member.clientId === clientId);
      resolve(ownPresence);
    });
  });
  
  if (presence) {
    const updatedData: ExtendedPresenceData = {
      ...presence.data,
      status,
      lastSeen: new Date().toISOString()
    };
    
    // Update presence
    await channel.presence.update(updatedData);
  }
};

// Leave chat
export const leaveChat = async (
  workspaceId: string,
  conversationId: string
): Promise<void> => {
  const channelName = getWorkspaceChannelName(workspaceId, `conversations:${conversationId}`);
  
  // Leave presence
  const channel = await getAblyChannel(channelName);
  await channel.presence.leave();
};

// Get all present users
export const getPresentUsers = async (
  workspaceId: string,
  conversationId: string
): Promise<ExtendedPresenceData[]> => {
  const channelName = getWorkspaceChannelName(workspaceId, `conversations:${conversationId}`);
  
  // Get channel
  const channel = await getAblyChannel(channelName);
  
  // Get present users
  return new Promise((resolve, reject) => {
    channel.presence.get((err, members) => {
      if (err) {
        reject(err);
        return;
      }
      
      resolve(members.map(member => member.data as ExtendedPresenceData));
    });
  });
};

// Subscribe to presence changes
export const subscribeToPresence = async (
  workspaceId: string,
  conversationId: string,
  callback: (action: string, presenceData: ExtendedPresenceData) => void
): Promise<() => void> => {
  const channelName = getWorkspaceChannelName(workspaceId, `conversations:${conversationId}`);
  
  // Get channel
  const channel = await getAblyChannel(channelName);
  
  // Subscribe to presence
  const enterSubscription = channel.presence.subscribe('enter', (member) => {
    callback('enter', member.data as ExtendedPresenceData);
  });
  
  const updateSubscription = channel.presence.subscribe('update', (member) => {
    callback('update', member.data as ExtendedPresenceData);
  });
  
  const leaveSubscription = channel.presence.subscribe('leave', (member) => {
    callback('leave', member.data as ExtendedPresenceData);
  });
  
  // Return unsubscribe function
  return () => {
    enterSubscription.unsubscribe();
    updateSubscription.unsubscribe();
    leaveSubscription.unsubscribe();
  };
};
