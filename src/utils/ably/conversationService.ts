
import { initializeAbly } from './ablyConnection';
import { ChatMessage, ConversationMetadata, ParticipantInfo } from './types';
import { throttle } from '@/utils/performance/performanceUtils';

/**
 * Create a new conversation
 */
export const createConversation = async (
  customerName: string, 
  customerEmail: string,
  topic: string,
  initialMessage: string
): Promise<string> => {
  try {
    const ably = await initializeAbly();
    const channel = ably.channels.get('new-conversations');
    
    const conversationId = `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    await channel.publish('create', {
      conversationId,
      customerName,
      customerEmail,
      topic,
      initialMessage,
      timestamp: new Date().toISOString()
    });
    
    return conversationId;
  } catch (error) {
    console.error('Failed to create conversation:', error);
    throw error;
  }
};

/**
 * Send a message in a conversation - throttled to prevent flooding
 */
export const sendMessage = throttle(async (
  conversationId: string,
  text: string,
  sender: ParticipantInfo
): Promise<void> => {
  try {
    const ably = await initializeAbly();
    const channel = ably.channels.get(`conversation:${conversationId}`);
    
    await channel.publish('message', {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      sender,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to send message:', error);
    throw error;
  }
}, 300); // Throttle to max 3 messages per second

/**
 * Get user's conversations - low latency implementation
 */
export const getUserConversations = async (
  userId: string
): Promise<ConversationMetadata[]> => {
  try {
    // Simulate rapid response
    const startTime = performance.now();
    
    // In a real implementation, this would fetch from your backend
    // with optimizations like caching and pagination
    const conversations: ConversationMetadata[] = [
      {
        id: 'conv-1',
        title: 'Support Request',
        status: 'active', 
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date().toISOString(),
        participants: [
          { id: userId, name: 'Customer', type: 'customer' },
          { id: 'agent-1', name: 'Support Agent', type: 'agent' }
        ]
      }
    ];
    
    const endTime = performance.now();
    console.log(`Fetched conversations in ${endTime - startTime}ms`);
    
    return conversations;
  } catch (error) {
    console.error('Failed to get user conversations:', error);
    return [];
  }
};
