
/**
 * Enhanced presence functionality using Ably
 */
import { getAblyChannel } from '../../ably';

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
  const channelName = `${workspaceId}:conversations:${conversationId}`;
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
  const channelName = `${workspaceId}:conversations:${conversationId}`;
  
  // Create properly typed callbacks
  let enterCallback: (member: any) => void = null;
  let leaveCallback: (member: any) => void = null;
  let updateCallback: (member: any) => void = null;
  
  // Set up subscriptions asynchronously
  const setup = async () => {
    try {
      const channel = await getAblyChannel(channelName);
      
      enterCallback = (member: any) => {
        onEnter(member.data as PresenceData);
      };
      
      leaveCallback = (member: any) => {
        onLeave(member.data as PresenceData);
      };
      
      updateCallback = (member: any) => {
        onUpdate(member.data as PresenceData);
      };
      
      channel.presence.subscribe('enter', enterCallback);
      channel.presence.subscribe('leave', leaveCallback);
      channel.presence.subscribe('update', updateCallback);
      
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
        
        if (enterCallback) {
          channel.presence.unsubscribe('enter', enterCallback);
        }
        
        if (leaveCallback) {
          channel.presence.unsubscribe('leave', leaveCallback);
        }
        
        if (updateCallback) {
          channel.presence.unsubscribe('update', updateCallback);
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
  const channelName = `${workspaceId}:conversations:${conversationId}`;
  
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
    
    // Use enter instead of update since our mock implementation doesn't have update
    await channel.presence.enter(updatedData);
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
  const channelName = `${workspaceId}:conversations:${conversationId}`;
  
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
  const channelName = `${workspaceId}:conversations:${conversationId}`;
  
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
