
// Define types for inbox components
export interface UserPresence {
  userId: string;
  name: string;
  lastActive: string;
  location?: {
    ticketId: string;
    area: string;
  };
  isTyping?: boolean;
  lastRead?: string;
}

export interface Message {
  id: string;
  text?: string;
  content?: string;
  sender: {
    id: string;
    name: string;
    type: 'agent' | 'customer' | 'system';
  } | string | import('@/types/ticket').Customer | import('@/types/ticket').TeamMember;
  timestamp: string;
  isCustomer?: boolean;
  type?: 'message' | 'internal_note';
  isInternalNote?: boolean;
  attachments?: Array<{
    id: string;
    url: string;
    type: string;
    name: string;
    size?: number;
  }>;
  status?: 'sent' | 'delivered' | 'read' | 'failed' | 'pending';
  readBy?: string[];
  reactions?: Record<string, string[]>;
  ticketId?: string;
}

export interface ConversationPanelProps {
  ticket: import('@/types/ticket').Ticket;
  onClose: () => void;
}

// Add a type adapter function to convert different message formats
export const adaptMessage = (message: Message | import('@/types/ticket').Message): Message => {
  // If it's already in the correct format
  if ('id' in message && (
    (typeof message.sender === 'object' && 'type' in message.sender) || 
    typeof message.sender === 'string'
  )) {
    return message as Message;
  }

  // Need to adapt the message
  const adaptedMessage: Message = {
    ...message,
    sender: adaptSender(message.sender)
  };

  return adaptedMessage;
};

// Helper to adapt sender to the correct format
export const adaptSender = (sender: any): Message['sender'] => {
  if (typeof sender === 'string') {
    return sender;
  }
  
  // If it's a Customer without type
  if ('name' in sender && !('type' in sender)) {
    return {
      id: sender.id || 'unknown',
      name: sender.name,
      type: 'customer'
    };
  }
  
  // If it's a TeamMember without type
  if ('email' in sender && !('type' in sender)) {
    return {
      id: sender.id || 'unknown',
      name: sender.name,
      type: 'agent'
    };
  }
  
  // If it already has the right structure
  if ('type' in sender) {
    return sender;
  }
  
  // Default fallback
  return {
    id: sender.id || 'unknown',
    name: sender.name || 'Unknown',
    type: 'system'
  };
};

// Convert string array to UserPresence array
export const adaptActiveUsers = (users: string[]): UserPresence[] => {
  return users.map(user => ({
    userId: user,
    name: user,
    lastActive: new Date().toISOString()
  }));
};
