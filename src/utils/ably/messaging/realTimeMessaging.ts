
import { getAblyChannel } from '../channelService';
import { ChatMessage } from '../types';

/**
 * Subscribe to a ticket channel for updates
 */
export const subscribeToTicket = async (
  ticketId: string,
  onUpdate: (data: any) => void
): Promise<() => void> => {
  const channel = await getAblyChannel(`ticket:${ticketId}`);
  
  const handleTicketUpdate = (message: any) => {
    onUpdate(message.data);
  };
  
  channel.subscribe('update', handleTicketUpdate);
  
  return () => {
    channel.unsubscribe('update', handleTicketUpdate);
  };
};

/**
 * Subscribe to a conversation for real-time messages
 */
export const subscribeToConversation = async (
  conversationId: string,
  onMessage: (message: ChatMessage) => void
): Promise<() => void> => {
  const channel = await getAblyChannel(`conversation:${conversationId}`);
  
  const handleMessage = (message: any) => {
    onMessage(message.data);
  };
  
  channel.subscribe('message', handleMessage);
  
  return () => {
    channel.unsubscribe('message', handleMessage);
  };
};

/**
 * Send a message to a specific conversation
 */
export const sendMessage = async (
  conversationId: string,
  messageText: string,
  sender: any
): Promise<void> => {
  const channel = await getAblyChannel(`conversation:${conversationId}`);
  
  const message: ChatMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    text: messageText,
    sender,
    timestamp: new Date().toISOString(),
    conversationId,
    userId: sender.id
  };
  
  await channel.publish('message', message);
};

/**
 * Monitor enhanced presence information like typing, online status, etc.
 */
export const monitorEnhancedPresence = async (
  conversationId: string,
  onPresenceUpdate: (presence: any) => void
): Promise<() => void> => {
  const channel = await getAblyChannel(`conversation:${conversationId}`);
  
  const handlePresenceUpdate = (presenceMessage: any) => {
    onPresenceUpdate({
      clientId: presenceMessage.clientId,
      data: presenceMessage.data,
      action: presenceMessage.action
    });
  };
  
  channel.presence.subscribe(handlePresenceUpdate);
  
  return () => {
    channel.presence.unsubscribe(handlePresenceUpdate);
  };
};
