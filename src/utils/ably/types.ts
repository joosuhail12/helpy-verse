
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
  status?: 'queued' | 'sending' | 'sent' | 'failed';
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
  status?: 'online' | 'away' | 'offline';
  lastActive?: string;
  presence?: {
    isTyping?: boolean;
    currentViewingPage?: string;
    deviceInfo?: {
      browser: string;
      os: string;
      device: string;
    };
  };
}

export interface PresenceEvent {
  type: 'enter' | 'leave' | 'update';
  participantId: string;
  participantName: string;
  participantType: 'customer' | 'agent';
  timestamp: string;
  data?: {
    status?: 'online' | 'away' | 'offline';
    isTyping?: boolean;
    lastActive?: string;
    currentViewingPage?: string;
  };
}
