
/**
 * Typing indicator functionality using Ably
 */
import { getAblyChannel, getWorkspaceChannelName } from '../../ably';

export interface TypingData {
  clientId: string;
  username?: string;
  isTyping: boolean;
  timestamp: string;
}

export const sendTypingIndicator = async (
  workspaceId: string,
  conversationId: string,
  isTyping: boolean,
  username?: string
): Promise<void> => {
  const channelName = getWorkspaceChannelName(workspaceId, `conversations:${conversationId}`);
  
  // Get client ID from localStorage or generate if needed
  const clientId = localStorage.getItem('ably_client_id') || 'anonymous-user';
  
  const data: TypingData = {
    clientId,
    username,
    isTyping,
    timestamp: new Date().toISOString()
  };
  
  // Publish typing indicator
  const channel = await getAblyChannel(channelName);
  await channel.publish(isTyping ? 'typing:start' : 'typing:stop', data);
};

export const subscribeToTypingIndicators = async (
  workspaceId: string,
  conversationId: string,
  callback: (typingData: TypingData) => void
): Promise<() => void> => {
  const channelName = getWorkspaceChannelName(workspaceId, `conversations:${conversationId}`);
  
  // Get channel
  const channel = await getAblyChannel(channelName);
  
  // Subscribe to typing indicators
  const startSubscription = channel.subscribe('typing:start', (message) => {
    callback(message.data as TypingData);
  });
  
  const stopSubscription = channel.subscribe('typing:stop', (message) => {
    callback(message.data as TypingData);
  });
  
  // Return unsubscribe function
  return () => {
    startSubscription.unsubscribe();
    stopSubscription.unsubscribe();
  };
};
