
import { initializeAbly } from './connection/connectionManager';
import { ChatMessage, ConversationMetadata, ParticipantInfo } from './types';
import { v4 as uuidv4 } from 'uuid';

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
    
    const conversationId = `conv-${Date.now()}-${uuidv4().slice(0, 8)}`;
    
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
 * Send a message in a conversation
 */
export const sendMessage = async (
  conversationId: string,
  text: string,
  sender: ParticipantInfo
): Promise<void> => {
  try {
    const ably = await initializeAbly();
    const channel = ably.channels.get(`conversation:${conversationId}`);
    
    await channel.publish('message', {
      id: `msg-${Date.now()}-${uuidv4().slice(0, 8)}`,
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
 * Get user's conversations
 */
export const getUserConversations = async (
  userId: string
): Promise<ConversationMetadata[]> => {
  try {
    // In a real implementation, this would fetch from your backend
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
    
    return conversations;
  } catch (error) {
    console.error('Failed to get user conversations:', error);
    return [];
  }
};
