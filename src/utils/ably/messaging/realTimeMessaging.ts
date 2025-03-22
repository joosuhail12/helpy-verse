
/**
 * Real-time messaging functionality using Ably
 */
import { v4 as uuidv4 } from 'uuid';
import * as Ably from 'ably';
import { ChatMessage, ParticipantInfo } from '../types';
import { getAblyChannel, publishToChannel, subscribeToChannel, enterChannelPresence, subscribeToPresence } from '../channelService';

/**
 * Send a message to a conversation
 */
export const sendMessage = async (
  conversationId: string,
  text: string,
  sender: any,
  messageId?: string
): Promise<{ id: string }> => {
  // Create message ID if not provided
  const id = messageId || uuidv4();
  
  // Create formatted message
  const message: ChatMessage = {
    id,
    text,
    sender,
    timestamp: new Date().toISOString()
  };
  
  try {
    // Send message through Ably channel
    await publishToChannel(
      `conversation:${conversationId}`,
      'message',
      message
    );
    
    // Return message ID for tracking
    return { id };
  } catch (error) {
    console.error(`Error sending message to conversation ${conversationId}:`, error);
    throw error;
  }
};

/**
 * Subscribe to messages in a conversation
 */
export const subscribeToConversation = async (
  conversationId: string,
  onMessage: (message: ChatMessage) => void
): Promise<() => void> => {
  try {
    // Subscribe to the conversation channel
    const unsubscribe = await subscribeToChannel(
      `conversation:${conversationId}`,
      'message',
      (message: Ably.Types.Message) => {
        onMessage(message.data as ChatMessage);
      }
    );
    
    return unsubscribe;
  } catch (error) {
    console.error(`Error subscribing to conversation ${conversationId}:`, error);
    
    // Return no-op function in case of error
    return () => {};
  }
};

/**
 * Subscribe to ticket updates
 */
export const subscribeToTicket = async (
  ticketId: string,
  onUpdate: (data: any) => void
): Promise<() => void> => {
  try {
    // Subscribe to the ticket channel
    const unsubscribe = await subscribeToChannel(
      `ticket:${ticketId}`,
      'update',
      (message: Ably.Types.Message) => {
        onUpdate(message.data);
      }
    );
    
    return unsubscribe;
  } catch (error) {
    console.error(`Error subscribing to ticket ${ticketId}:`, error);
    
    // Return no-op function in case of error
    return () => {};
  }
};

/**
 * Monitor presence of participants in a conversation
 */
export const monitorEnhancedPresence = async (
  conversationId: string,
  onParticipantsUpdate: (participants: ParticipantInfo[]) => void,
  onPresenceEvent?: (event: { 
    type: 'enter' | 'leave' | 'update'; 
    participantId: string;
    participantName: string; 
  }) => void
): Promise<() => void> => {
  try {
    // Get the channel
    const channel = await getAblyChannel(`conversation:${conversationId}`);
    
    // Function to get all present members
    const getParticipants = async (): Promise<ParticipantInfo[]> => {
      return new Promise((resolve) => {
        channel.presence.get((err, members) => {
          if (err) {
            console.error(`Error getting presence for conversation ${conversationId}:`, err);
            resolve([]);
            return;
          }
          
          // Convert presence data to participant info
          const participants: ParticipantInfo[] = members?.map(member => ({
            id: member.clientId,
            name: member.data?.name || 'Unknown',
            type: member.data?.type || 'user',
            status: 'online'
          })) || [];
          
          resolve(participants);
        });
      });
    };
    
    // Initial participants list
    const initialParticipants = await getParticipants();
    onParticipantsUpdate(initialParticipants);
    
    // Subscribe to presence events
    const unsubscribe = await subscribeToPresence(
      `conversation:${conversationId}`,
      (presenceMessage: Ably.Types.PresenceMessage) => {
        // Handle presence event
        if (onPresenceEvent) {
          onPresenceEvent({
            type: presenceMessage.action as 'enter' | 'leave' | 'update',
            participantId: presenceMessage.clientId,
            participantName: presenceMessage.data?.name || 'Unknown'
          });
        }
        
        // Update participants list
        getParticipants().then(participants => {
          onParticipantsUpdate(participants);
        });
      }
    );
    
    // Enter presence to announce our own presence
    const clientId = localStorage.getItem('user-id') || `user-${uuidv4()}`;
    const userName = localStorage.getItem('user-name') || 'Customer';
    
    await enterChannelPresence(
      `conversation:${conversationId}`,
      {
        name: userName,
        type: 'customer' 
      }
    );
    
    return unsubscribe;
  } catch (error) {
    console.error(`Error monitoring presence for conversation ${conversationId}:`, error);
    
    return () => {};
  }
};
