
/**
 * Enhanced presence functionality using Ably
 */
import * as Ably from 'ably';
import { getAblyChannel, getWorkspaceChannelName } from '../../ably';

export interface PresenceData {
  clientId: string;
  status: 'online' | 'away' | 'offline';
  lastActive: string;
  displayName?: string;
  metadata?: Record<string, any>;
}

/**
 * Enter presence on a channel
 */
export const enterPresence = async (
  workspaceId: string,
  conversationId: string,
  clientData: Partial<PresenceData>
): Promise<void> => {
  const channelName = getWorkspaceChannelName(workspaceId, `conversations:${conversationId}`);
  const channel = await getAblyChannel(channelName);
  
  try {
    const presenceData: PresenceData = {
      clientId: clientData.clientId || '',
      status: clientData.status || 'online',
      lastActive: new Date().toISOString(),
      displayName: clientData.displayName,
      metadata: clientData.metadata
    };
    
    await channel.presence.enter(presenceData);
  } catch (error) {
    console.error('Error entering presence:', error);
  }
};

/**
 * Subscribe to presence changes on a channel
 */
export const subscribeToPresence = (
  workspaceId: string,
  conversationId: string,
  onEnter: (member: PresenceData) => void,
  onLeave: (member: PresenceData) => void,
  onUpdate: (member: PresenceData) => void
): (() => void) => {
  const channelName = getWorkspaceChannelName(workspaceId, `conversations:${conversationId}`);
  
  let enterSubscription: Ably.Types.PresenceListener | null = null;
  let leaveSubscription: Ably.Types.PresenceListener | null = null;
  let updateSubscription: Ably.Types.PresenceListener | null = null;
  
  // Set up subscriptions asynchronously
  const setup = async () => {
    try {
      const channel = await getAblyChannel(channelName);
      
      enterSubscription = (member: Ably.Types.PresenceMessage) => {
        onEnter(member.data as PresenceData);
      };
      
      leaveSubscription = (member: Ably.Types.PresenceMessage) => {
        onLeave(member.data as PresenceData);
      };
      
      updateSubscription = (member: Ably.Types.PresenceMessage) => {
        onUpdate(member.data as PresenceData);
      };
      
      channel.presence.subscribe('enter', enterSubscription);
      channel.presence.subscribe('leave', leaveSubscription);
      channel.presence.subscribe('update', updateSubscription);
      
      // Get current members
      channel.presence.get((err, members) => {
        if (err) {
          console.error('Error getting presence members:', err);
          return;
        }
        
        if (members) {
          members.forEach(member => {
            onEnter(member.data as PresenceData);
          });
        }
      });
    } catch (error) {
      console.error('Error setting up presence subscriptions:', error);
    }
  };
  
  setup();
  
  // Return cleanup function
  return () => {
    const cleanup = async () => {
      try {
        const channel = await getAblyChannel(channelName);
        
        if (enterSubscription) {
          channel.presence.unsubscribe('enter', enterSubscription);
        }
        
        if (leaveSubscription) {
          channel.presence.unsubscribe('leave', leaveSubscription);
        }
        
        if (updateSubscription) {
          channel.presence.unsubscribe('update', updateSubscription);
        }
      } catch (error) {
        console.error('Error cleaning up presence subscriptions:', error);
      }
    };
    
    cleanup();
  };
};

/**
 * Update presence data on a channel
 */
export const updatePresence = async (
  workspaceId: string,
  conversationId: string,
  updates: Partial<PresenceData>
): Promise<void> => {
  const channelName = getWorkspaceChannelName(workspaceId, `conversations:${conversationId}`);
  
  try {
    const channel = await getAblyChannel(channelName);
    
    // Get current presence data
    const currentData = await new Promise<PresenceData | null>((resolve, reject) => {
      channel.presence.get((err, members) => {
        if (err) {
          reject(err);
          return;
        }
        
        const clientId = updates.clientId;
        const member = members?.find(m => m.clientId === clientId);
        
        if (member) {
          resolve(member.data as PresenceData);
        } else {
          resolve(null);
        }
      });
    });
    
    if (!currentData) {
      // Not present, so enter with the updates
      await enterPresence(workspaceId, conversationId, updates);
      return;
    }
    
    // Merge current data with updates
    const updatedData: PresenceData = {
      ...currentData,
      ...updates,
      lastActive: new Date().toISOString()
    };
    
    await channel.presence.update(updatedData);
  } catch (error) {
    console.error('Error updating presence:', error);
  }
};

/**
 * Get the presence data for a specific user
 */
export const getUserPresence = async (
  workspaceId: string,
  conversationId: string,
  clientId: string
): Promise<PresenceData | null> => {
  const channelName = getWorkspaceChannelName(workspaceId, `conversations:${conversationId}`);
  
  try {
    const channel = await getAblyChannel(channelName);
    
    return new Promise<PresenceData | null>((resolve) => {
      channel.presence.get((err, members) => {
        if (err || !members) {
          resolve(null);
          return;
        }
        
        const member = members.find(m => m.clientId === clientId);
        
        if (member) {
          resolve(member.data as PresenceData);
        } else {
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error('Error getting user presence:', error);
    return null;
  }
};

/**
 * Get all presence members in a conversation
 */
export const getAllPresenceMembers = async (
  workspaceId: string,
  conversationId: string
): Promise<PresenceData[]> => {
  const channelName = getWorkspaceChannelName(workspaceId, `conversations:${conversationId}`);
  
  try {
    const channel = await getAblyChannel(channelName);
    
    return new Promise<PresenceData[]>((resolve) => {
      channel.presence.get((err, members) => {
        if (err || !members) {
          resolve([]);
          return;
        }
        
        resolve(members.map(member => member.data as PresenceData));
      });
    });
  } catch (error) {
    console.error('Error getting all presence members:', error);
    return [];
  }
};
