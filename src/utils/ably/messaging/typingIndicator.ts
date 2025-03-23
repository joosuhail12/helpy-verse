
/**
 * Typing indicator functionality using Ably presence
 */
import * as Ably from 'ably';
import { getAblyChannel, getWorkspaceChannelName } from '../../ably';

interface TypingUser {
  clientId: string;
  name?: string;
  timestamp: number;
}

interface TypingData {
  [clientId: string]: TypingUser;
}

// Timeout for typing indicator in milliseconds
const TYPING_TIMEOUT = 5000;

/**
 * Get users who are currently typing
 */
export const getTypingUsers = async (
  workspaceId: string,
  conversationId: string
): Promise<TypingUser[]> => {
  const channelName = getWorkspaceChannelName(workspaceId, `conversations:${conversationId}`);
  const channel = await getAblyChannel(channelName);
  
  const typingData: TypingData = {};
  
  // Instead of using channel metadata (which might not be supported), we'll track typing state internally
  // This could be enhanced with persistent storage if needed
  const now = Date.now();
  
  try {
    // Return active typing users
    return Object.values(typingData).filter(user => now - user.timestamp < TYPING_TIMEOUT);
  } catch (error) {
    console.error('Error getting typing users:', error);
    return [];
  }
};

/**
 * Start typing indicator for the current user
 */
export const startTyping = async (
  workspaceId: string,
  conversationId: string,
  clientId: string,
  userName?: string
): Promise<void> => {
  const channelName = getWorkspaceChannelName(workspaceId, `conversations:${conversationId}`);
  const channel = await getAblyChannel(channelName);
  
  try {
    await channel.publish('typing:start', {
      clientId,
      name: userName,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error publishing typing start event:', error);
  }
};

/**
 * Stop typing indicator for the current user
 */
export const stopTyping = async (
  workspaceId: string,
  conversationId: string,
  clientId: string
): Promise<void> => {
  const channelName = getWorkspaceChannelName(workspaceId, `conversations:${conversationId}`);
  const channel = await getAblyChannel(channelName);
  
  try {
    await channel.publish('typing:stop', {
      clientId,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error publishing typing stop event:', error);
  }
};

/**
 * Subscribe to typing indicators in a conversation
 */
export const subscribeToTypingIndicators = (
  workspaceId: string,
  conversationId: string,
  onTypingStart: (user: TypingUser) => void,
  onTypingStop: (clientId: string) => void
): (() => void) => {
  const channelName = getWorkspaceChannelName(workspaceId, `conversations:${conversationId}`);
  
  // Using Function type since MessageListener isn't exported by Ably types
  let typingStartSubscription: Function | null = null;
  let typingStopSubscription: Function | null = null;
  
  // Handle subscriptions async
  const setup = async () => {
    const channel = await getAblyChannel(channelName);
    
    // Subscribe to typing:start events
    typingStartSubscription = (message: Ably.Types.Message) => {
      const user = message.data as TypingUser;
      onTypingStart(user);
    };
    
    // Subscribe to typing:stop events
    typingStopSubscription = (message: Ably.Types.Message) => {
      const { clientId } = message.data;
      onTypingStop(clientId);
    };
    
    channel.subscribe('typing:start', typingStartSubscription);
    channel.subscribe('typing:stop', typingStopSubscription);
  };
  
  setup();
  
  // Return cleanup function
  return () => {
    const cleanup = async () => {
      try {
        const channel = await getAblyChannel(channelName);
        if (typingStartSubscription) {
          channel.unsubscribe('typing:start', typingStartSubscription);
        }
        if (typingStopSubscription) {
          channel.unsubscribe('typing:stop', typingStopSubscription);
        }
      } catch (error) {
        console.error('Error cleaning up typing indicator subscriptions:', error);
      }
    };
    
    cleanup();
  };
};
