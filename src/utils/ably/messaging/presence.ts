
/**
 * Presence functionality for real-time chat
 */
import { getAblyChannel } from '../index';

/**
 * Enters channel presence and monitors other clients
 */
export const monitorPresence = async (
  channelName: string,
  clientId: string,
  callbacks: {
    onEnter?: (clientId: string, data?: any) => void;
    onLeave?: (clientId: string, data?: any) => void;
    onUpdate?: (clientId: string, data?: any) => void;
  }
) => {
  try {
    const channel = await getAblyChannel(channelName);
    
    // Enter presence on the channel
    await channel.presence.enter({ clientId, status: 'active' });
    
    // Subscribe to presence events
    const onEnterSubscription = channel.presence.subscribe('enter', (member) => {
      if (member.clientId !== clientId && callbacks.onEnter) {
        callbacks.onEnter(member.clientId, member.data);
      }
    });
    
    const onLeaveSubscription = channel.presence.subscribe('leave', (member) => {
      if (member.clientId !== clientId && callbacks.onLeave) {
        callbacks.onLeave(member.clientId, member.data);
      }
    });
    
    const onUpdateSubscription = channel.presence.subscribe('update', (member) => {
      if (member.clientId !== clientId && callbacks.onUpdate) {
        callbacks.onUpdate(member.clientId, member.data);
      }
    });
    
    // Return cleanup function
    return () => {
      if (onEnterSubscription && typeof onEnterSubscription.unsubscribe === 'function') {
        onEnterSubscription.unsubscribe();
      }
      if (onLeaveSubscription && typeof onLeaveSubscription.unsubscribe === 'function') {
        onLeaveSubscription.unsubscribe();
      }
      if (onUpdateSubscription && typeof onUpdateSubscription.unsubscribe === 'function') {
        onUpdateSubscription.unsubscribe();
      }
      channel.presence.leave();
    };
  } catch (error) {
    console.error('Error setting up presence:', error);
    return () => {}; // Return empty cleanup function
  }
};

/**
 * Monitors enhanced presence with additional metadata
 */
export const monitorEnhancedPresence = async (
  channelName: string,
  clientId: string,
  callbacks: {
    onEnter?: (clientId: string, data?: any) => void;
    onLeave?: (clientId: string, data?: any) => void;
    onUpdate?: (clientId: string, data?: any) => void;
    onPresenceData?: (members: any[]) => void;
  }
) => {
  try {
    const channel = await getAblyChannel(channelName);
    
    // Enter presence with metadata
    await channel.presence.enter({
      clientId,
      status: 'active',
      lastActive: new Date().toISOString(),
      metadata: {
        agent: navigator.userAgent,
        device: detectDeviceType(),
      }
    });
    
    // Get and process initial members
    channel.presence.get((err, members) => {
      if (!err && members && callbacks.onPresenceData) {
        callbacks.onPresenceData(members);
      }
    });
    
    // Subscribe to presence events
    const onEnterSubscription = channel.presence.subscribe('enter', (member) => {
      if (callbacks.onEnter) {
        callbacks.onEnter(member.clientId, member.data);
      }
      
      // Update the full presence list
      if (callbacks.onPresenceData) {
        channel.presence.get((err, members) => {
          if (!err && members) {
            callbacks.onPresenceData(members);
          }
        });
      }
    });
    
    const onLeaveSubscription = channel.presence.subscribe('leave', (member) => {
      if (callbacks.onLeave) {
        callbacks.onLeave(member.clientId, member.data);
      }
      
      // Update the full presence list
      if (callbacks.onPresenceData) {
        channel.presence.get((err, members) => {
          if (!err && members) {
            callbacks.onPresenceData(members);
          }
        });
      }
    });
    
    const onUpdateSubscription = channel.presence.subscribe('update', (member) => {
      if (callbacks.onUpdate) {
        callbacks.onUpdate(member.clientId, member.data);
      }
    });
    
    // Return cleanup function
    return () => {
      if (onEnterSubscription && typeof onEnterSubscription.unsubscribe === 'function') {
        onEnterSubscription.unsubscribe();
      }
      if (onLeaveSubscription && typeof onLeaveSubscription.unsubscribe === 'function') {
        onLeaveSubscription.unsubscribe();
      }
      if (onUpdateSubscription && typeof onUpdateSubscription.unsubscribe === 'function') {
        onUpdateSubscription.unsubscribe();
      }
      channel.presence.leave();
    };
  } catch (error) {
    console.error('Error setting up enhanced presence:', error);
    return () => {}; // Return empty cleanup function
  }
};

// Helper function to detect device type
const detectDeviceType = () => {
  const userAgent = navigator.userAgent;
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    return 'mobile';
  }
  return 'desktop';
};
