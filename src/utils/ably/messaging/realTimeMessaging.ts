
/**
 * Real-time messaging functionality using Ably
 */
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, ParticipantInfo } from '../types';

/**
 * Send a message to a conversation
 */
export const sendMessage = async (
  conversationId: string,
  text: string,
  sender: any,
  messageId?: string
): Promise<{ id: string }> => {
  // In a real implementation, this would send via Ably SDK
  console.log(`Sending message to conversation ${conversationId}:`, { text, sender });
  
  // Return message ID
  return { id: messageId || uuidv4() };
};

/**
 * Subscribe to messages in a conversation
 */
export const subscribeToConversation = async (
  conversationId: string,
  onMessage: (message: ChatMessage) => void
): Promise<() => void> => {
  // In a real implementation, this would use Ably subscription
  console.log(`Subscribed to conversation ${conversationId}`);
  
  return () => {
    console.log(`Unsubscribed from conversation ${conversationId}`);
  };
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
  // In a real implementation, this would use Ably presence
  console.log(`Monitoring presence for conversation ${conversationId}`);
  
  // Send initial mock participants
  setTimeout(() => {
    onParticipantsUpdate([
      {
        id: 'agent-1',
        name: 'Support Agent',
        type: 'agent',
        status: 'online'
      }
    ]);
    
    if (onPresenceEvent) {
      onPresenceEvent({
        type: 'enter',
        participantId: 'agent-1',
        participantName: 'Support Agent'
      });
    }
  }, 1000);
  
  return () => {
    console.log(`Stopped monitoring presence for conversation ${conversationId}`);
  };
};
