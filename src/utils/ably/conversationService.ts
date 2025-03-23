
// Mocked conversation service implementation

// Interface for conversation creation parameters
interface ConversationParams {
  name: string;
  email: string;
  topic: string;
  message?: string;
}

// Interface for conversation metadata
export interface ConversationMetadata {
  id: string;
  title: string;
  createdAt: number;
  lastMessage: string;
  lastActivity: number;
  participants: {
    id: string;
    name: string;
    email?: string;
    role: 'customer' | 'agent' | 'bot';
  }[];
  status: 'open' | 'closed' | 'pending';
}

/**
 * Create a new conversation
 */
export const createConversation = async (params: ConversationParams): Promise<string> => {
  console.log('Creating new conversation', params);
  
  // Generate a unique conversation ID
  const conversationId = `conv-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  
  // In a real implementation, you would:
  // 1. Store the conversation in a database
  // 2. Set up the Ably channel
  // 3. Send the initial message
  
  if (params.message) {
    console.log('Sending initial message', params.message);
  }
  
  return conversationId;
};

/**
 * Send a message to a conversation
 */
export const sendMessage = async (conversationId: string, message: string): Promise<boolean> => {
  console.log(`Sending message to conversation ${conversationId}:`, message);
  return true;
};

/**
 * Get all conversations for a user
 */
export const getUserConversations = async (userId: string): Promise<ConversationMetadata[]> => {
  console.log('Getting conversations for user', userId);
  
  // Return mock conversations
  return [
    {
      id: 'conv-1',
      title: 'Support Request',
      createdAt: Date.now() - 86400000, // 1 day ago
      lastMessage: 'How can I reset my password?',
      lastActivity: Date.now() - 3600000, // 1 hour ago
      participants: [
        {
          id: userId,
          name: 'Customer',
          role: 'customer'
        },
        {
          id: 'agent-1',
          name: 'Support Agent',
          role: 'agent'
        }
      ],
      status: 'open'
    },
    {
      id: 'conv-2',
      title: 'Billing Issue',
      createdAt: Date.now() - 172800000, // 2 days ago
      lastMessage: 'Your issue has been resolved. Is there anything else we can help with?',
      lastActivity: Date.now() - 43200000, // 12 hours ago
      participants: [
        {
          id: userId,
          name: 'Customer',
          role: 'customer'
        },
        {
          id: 'agent-2',
          name: 'Billing Support',
          role: 'agent'
        }
      ],
      status: 'closed'
    }
  ];
};

/**
 * Get metadata for a specific conversation
 */
export const getConversationMetadata = async (conversationId: string): Promise<ConversationMetadata | null> => {
  console.log('Getting metadata for conversation', conversationId);
  
  // In a real implementation, you would fetch this from a database
  return {
    id: conversationId,
    title: 'Sample Conversation',
    createdAt: Date.now() - 86400000,
    lastMessage: 'This is a sample message',
    lastActivity: Date.now() - 3600000,
    participants: [
      {
        id: 'user-1',
        name: 'Customer',
        role: 'customer'
      },
      {
        id: 'agent-1',
        name: 'Support Agent',
        role: 'agent'
      }
    ],
    status: 'open'
  };
};
