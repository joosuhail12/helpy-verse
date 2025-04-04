
// Define the types for the chat messages
export interface ChatMessage {
  id: string;
  content: string;
  timestamp: string;
  isUser: boolean;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  attachments?: Array<{
    id: string;
    type: string;
    url: string;
    name: string;
  }>;
}

// Mock conversation history
export const mockMessages: ChatMessage[] = [
  {
    id: '1',
    content: 'Hello! How can I help you today?',
    timestamp: '2023-08-05T10:30:00Z',
    isUser: false,
    sender: {
      id: 'bot-1',
      name: 'Support Bot'
    }
  },
  {
    id: '2',
    content: 'I have a problem with my order #12345',
    timestamp: '2023-08-05T10:31:00Z',
    isUser: true,
    sender: {
      id: 'user-1',
      name: 'John Doe'
    }
  },
  {
    id: '3',
    content: 'I\'m sorry to hear that. Let me look up your order. Can you please provide more details about the issue?',
    timestamp: '2023-08-05T10:32:00Z',
    isUser: false,
    sender: {
      id: 'bot-1',
      name: 'Support Bot'
    }
  },
  {
    id: '4',
    content: 'The product arrived damaged.',
    timestamp: '2023-08-05T10:33:00Z',
    isUser: true,
    sender: {
      id: 'user-1',
      name: 'John Doe'
    }
  },
  {
    id: '5',
    content: 'I\'m sorry to hear that. We\'ll replace it right away. Can you please upload a photo of the damaged item?',
    timestamp: '2023-08-05T10:34:00Z',
    isUser: false,
    sender: {
      id: 'bot-1',
      name: 'Support Bot'
    }
  }
];

// Function to simulate getting messages for a conversation
export const getMockMessages = (conversationId: string): Promise<ChatMessage[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockMessages);
    }, 500);
  });
};

// Function to simulate sending a message
export const sendMockMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<ChatMessage> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newMessage = {
        ...message,
        id: Date.now().toString(),
        timestamp: new Date().toISOString()
      };
      resolve(newMessage);
    }, 300);
  });
};
