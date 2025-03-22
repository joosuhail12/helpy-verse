
import { initializeAbly } from '../connection/connectionManager';
import { throttle } from '@/utils/performance/performanceUtils';
import { ParticipantInfo, PresenceEvent } from '../types';

/**
 * Enhanced presence monitoring with participant status tracking
 */
export const monitorEnhancedPresence = (
  conversationId: string,
  onParticipantsChange: (participants: ParticipantInfo[]) => void,
  onPresenceEvent?: (event: PresenceEvent) => void
): (() => void) => {
  try {
    initializeAbly().then(ably => {
      const channel = ably.channels.get(`conversation:${conversationId}`);
      
      // Enter presence when monitoring starts
      channel.presence.enter({ status: 'online', lastActive: new Date().toISOString() });
      
      // Track participants based on presence events
      const updateParticipants = () => {
        channel.presence.get((err, members) => {
          if (err) {
            console.error('Error getting presence data:', err);
            return;
          }
          
          // Transform presence data to our participant format
          const participants: ParticipantInfo[] = members.map(member => ({
            id: member.clientId,
            name: member.data?.name || 'Unknown',
            type: member.data?.userType || 'customer',
            status: member.data?.status || 'online',
            lastActive: member.data?.lastActive,
            presence: {
              isTyping: member.data?.isTyping,
              currentViewingPage: member.data?.currentViewingPage,
              deviceInfo: member.data?.deviceInfo
            }
          }));
          
          onParticipantsChange(participants);
        });
      };
      
      // Initial participants list
      updateParticipants();
      
      // Subscribe to presence events
      channel.presence.subscribe('enter', (member) => {
        updateParticipants();
        
        if (onPresenceEvent) {
          onPresenceEvent({
            type: 'enter',
            participantId: member.clientId,
            participantName: member.data?.name || 'Unknown',
            participantType: member.data?.userType || 'customer',
            timestamp: new Date().toISOString(),
            data: {
              status: member.data?.status,
              isTyping: member.data?.isTyping,
              lastActive: member.data?.lastActive,
              currentViewingPage: member.data?.currentViewingPage
            }
          });
        }
      });
      
      channel.presence.subscribe('leave', (member) => {
        updateParticipants();
        
        if (onPresenceEvent) {
          onPresenceEvent({
            type: 'leave',
            participantId: member.clientId,
            participantName: member.data?.name || 'Unknown',
            participantType: member.data?.userType || 'customer',
            timestamp: new Date().toISOString(),
          });
        }
      });
      
      channel.presence.subscribe('update', (member) => {
        updateParticipants();
        
        if (onPresenceEvent) {
          onPresenceEvent({
            type: 'update',
            participantId: member.clientId,
            participantName: member.data?.name || 'Unknown',
            participantType: member.data?.userType || 'customer',
            timestamp: new Date().toISOString(),
            data: {
              status: member.data?.status,
              isTyping: member.data?.isTyping,
              lastActive: member.data?.lastActive,
              currentViewingPage: member.data?.currentViewingPage
            }
          });
        }
      });
    }).catch(err => {
      console.error('Error monitoring enhanced presence:', err);
    });
    
    return () => {
      initializeAbly().then(ably => {
        const channel = ably.channels.get(`conversation:${conversationId}`);
        channel.presence.leave();
        channel.presence.unsubscribe();
      }).catch(err => {
        console.error('Error cleaning up enhanced presence:', err);
      });
    };
  } catch (error) {
    console.error('Failed to monitor enhanced presence:', error);
    return () => {};
  }
};

/**
 * Update participant's presence data with throttling for performance
 */
export const updateParticipantPresence = throttle(async (
  conversationId: string,
  userId: string,
  userName: string,
  userType: 'customer' | 'agent',
  presenceData: {
    isTyping?: boolean;
    status?: 'online' | 'away' | 'offline';
    currentViewingPage?: string;
    deviceInfo?: {
      browser: string;
      os: string;
      device: string;
    };
  }
): Promise<void> => {
  try {
    const ably = await initializeAbly();
    const channel = ably.channels.get(`conversation:${conversationId}`);
    
    await channel.presence.enter({
      userId,
      name: userName,
      userType,
      ...presenceData,
      lastActive: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to update participant presence:', error);
  }
}, 250); // Throttle to 4 updates per second
