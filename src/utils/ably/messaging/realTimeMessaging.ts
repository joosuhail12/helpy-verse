
import { initializeAbly } from '../connection/connectionManager';
import { ChatMessage, ParticipantInfo, PresenceEvent } from '../types';
import * as Ably from 'ably';

/**
 * Send a message to a conversation
 */
export const sendMessage = async (
  conversationId: string,
  text: string,
  sender: ParticipantInfo,
  messageId?: string
): Promise<void> => {
  try {
    const ably = await initializeAbly();
    const channel = ably.channels.get(`conversation:${conversationId}`);
    
    await channel.publish('message', {
      id: messageId || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      sender,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to send message:', error);
    throw error;
  }
};

/**
 * Subscribe to messages in a conversation
 */
export const subscribeToConversation = (
  conversationId: string,
  onMessage: (message: ChatMessage) => void
): (() => void) => {
  try {
    // Create subscription promise
    const subscriptionPromise = initializeAbly().then(ably => {
      const channel = ably.channels.get(`conversation:${conversationId}`);
      
      // Subscribe to messages
      const messageHandler = (message: Ably.Types.Message) => {
        onMessage(message.data as ChatMessage);
      };
      
      channel.subscribe('message', messageHandler);
      
      // Return cleanup function
      return () => {
        try {
          channel.unsubscribe('message', messageHandler);
        } catch (error) {
          console.error('Error unsubscribing from conversation:', error);
        }
      };
    }).catch(err => {
      console.error('Error creating subscription:', err);
      return () => {}; // Return no-op cleanup function on error
    });
    
    // Return a function that will call the cleanup when invoked
    return () => {
      subscriptionPromise.then(cleanup => cleanup()).catch(err => {
        console.error('Error cleaning up subscription:', err);
      });
    };
  } catch (error) {
    console.error('Failed to subscribe to conversation:', error);
    return () => {};
  }
};

/**
 * Monitor presence events in a conversation
 */
export const monitorEnhancedPresence = (
  conversationId: string,
  onParticipantsUpdate: (participants: ParticipantInfo[]) => void,
  onPresenceEvent?: (event: PresenceEvent) => void
): Promise<(() => void) | void> => {
  return initializeAbly().then(ably => {
    const presenceChannel = ably.channels.get(`presence:${conversationId}`);
    const participants: Record<string, ParticipantInfo> = {};
    
    // Handle presence messages
    const presenceHandler = (message: Ably.Types.PresenceMessage) => {
      const { action, clientId, data } = message;
      
      if (!clientId || !data) return;
      
      // Create presence event object
      const presenceEvent: PresenceEvent = {
        type: action === 'enter' ? 'enter' : 
              action === 'leave' ? 'leave' : 'update',
        participantId: clientId,
        participantName: data.name || 'Unknown',
        participantType: data.type || 'customer',
        timestamp: new Date().toISOString(),
        data: {
          status: data.status,
          isTyping: data.isTyping,
          lastActive: data.lastActive,
          currentViewingPage: data.currentViewingPage
        }
      };
      
      // Dispatch presence event
      if (onPresenceEvent) {
        onPresenceEvent(presenceEvent);
      }
      
      // Update participants list
      if (action === 'enter' || action === 'update') {
        participants[clientId] = {
          id: clientId,
          name: data.name || 'Unknown',
          type: data.type || 'customer',
          status: data.status || 'online',
          lastActive: data.lastActive,
          presence: {
            isTyping: data.isTyping,
            currentViewingPage: data.currentViewingPage,
            deviceInfo: data.deviceInfo
          }
        };
      } else if (action === 'leave') {
        delete participants[clientId];
      }
      
      // Dispatch updated participants list
      onParticipantsUpdate(Object.values(participants));
    };
    
    // Subscribe to presence events
    presenceChannel.presence.subscribe(presenceHandler);
    
    // Get current presence members
    presenceChannel.presence.get((err, members) => {
      if (err) {
        console.error('Error getting presence members:', err);
        return;
      }
      
      if (members && members.length > 0) {
        members.forEach(member => {
          const { clientId, data } = member;
          if (clientId && data) {
            participants[clientId] = {
              id: clientId,
              name: data.name || 'Unknown',
              type: data.type || 'customer',
              status: data.status || 'online',
              lastActive: data.lastActive,
              presence: {
                isTyping: data.isTyping,
                currentViewingPage: data.currentViewingPage,
                deviceInfo: data.deviceInfo
              }
            };
          }
        });
        
        onParticipantsUpdate(Object.values(participants));
      }
    });
    
    // Return unsubscribe function
    return () => {
      try {
        presenceChannel.presence.unsubscribe(presenceHandler);
      } catch (error) {
        console.error('Error unsubscribing from presence:', error);
      }
    };
  }).catch(err => {
    console.error('Error monitoring presence:', err);
  });
};
