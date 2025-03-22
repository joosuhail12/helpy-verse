
// Define interfaces for type safety
export interface ChatMessage {
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

export interface ConversationMetadata {
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

export interface ParticipantInfo {
  id: string;
  name: string;
  type: 'customer' | 'agent';
}
