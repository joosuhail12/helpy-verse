
import * as Ably from 'ably';
import { HttpClient } from '@/api/services/http';

// Define interfaces for type safety
interface ChatMessage {
  id: string;
  text: string;
  sender: {
    id: string;
    name: string;
    type: 'customer' | 'agent' | 'system';
  };
  timestamp: string;
  attachments?: Array<{
    url: string;
    type: string;
    name: string;
  }>;
}

interface ConversationMetadata {
  id: string;
  title: string;
  status: 'active' | 'pending' | 'resolved';
  createdAt: string;
  updatedAt: string;
  participants: Array<{
    id: string;
    name: string;
    type: 'customer' | 'agent';
  }>;
}

// Singleton instance
let ablyInstance: Ably.Realtime | null = null;

/**
 * Initialize Ably client with token auth
 */
export const initializeAbly = async (): Promise<Ably.Realtime> => {
  if (ablyInstance) {
    return ablyInstance;
  }

  try {
    // Fetch token from backend
    const response = await HttpClient.apiClient.get('/api/ably-token');
    
    // Initialize Ably with token
    ablyInstance = new Ably.Realtime({
      authUrl: '/api/ably-token',
      authMethod: 'GET'
    });
    
    console.log('Ably client initialized successfully');
    return ablyInstance;
  } catch (error) {
    console.error('Failed to initialize Ably client:', error);
    
    // Fallback to mock implementation for development
    console.warn('Using mock Ably implementation for development');
    return {
      connection: {
        on: () => ({ id: 'mock-connection' }),
        state: 'connected'
      },
      channels: {
        get: (channelName: string) => ({
          presence: {
            enter: async () => console.log(`Entered ${channelName}`),
            leave: async () => console.log(`Left ${channelName}`),
            subscribe: () => console.log(`Subscribed to presence ${channelName}`)
          },
          subscribe: () => console.log(`Subscribed to ${channelName}`),
          publish: async () => console.log(`Published to ${channelName}`)
        })
      },
      close: () => console.log('Mock Ably connection closed')
    } as unknown as Ably.Realtime;
  }
};

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
 * Send a message in a conversation
 */
export const sendMessage = async (
  conversationId: string,
  text: string,
  sender: { id: string; name: string; type: 'customer' | 'agent' }
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
};

/**
 * Subscribe to messages in a conversation
 */
export const subscribeToConversation = (
  conversationId: string,
  onMessage: (message: ChatMessage) => void
): () => void => {
  try {
    initializeAbly().then(ably => {
      const channel = ably.channels.get(`conversation:${conversationId}`);
      channel.subscribe('message', (message) => {
        onMessage(message.data as ChatMessage);
      });
    });
    
    // Return unsubscribe function
    return () => {
      if (ablyInstance) {
        const channel = ablyInstance.channels.get(`conversation:${conversationId}`);
        channel.unsubscribe();
      }
    };
  } catch (error) {
    console.error('Failed to subscribe to conversation:', error);
    return () => {};
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
    // For now, we'll return mock data
    return [
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
  } catch (error) {
    console.error('Failed to get user conversations:', error);
    return [];
  }
};

/**
 * Clean up Ably connection
 */
export const cleanupAblyConnection = (): void => {
  if (ablyInstance) {
    ablyInstance.close();
    ablyInstance = null;
    console.log('Ably connection closed');
  }
};
