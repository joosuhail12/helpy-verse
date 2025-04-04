
import { nanoid } from 'nanoid';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: string; // Changed from Date to string to fix the type error
  conversationId: string;
  status: 'sent' | 'delivered' | 'read' | 'error';
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage?: string;
  lastMessageTimestamp: string; // This should be string, not Date
  unreadCount: number;
  type?: string;
}

export const createMessage = (content: string, sender: 'user' | 'agent', conversationId: string): Message => {
  return {
    id: nanoid(),
    content,
    sender,
    timestamp: new Date().toISOString(), // Convert to ISO string
    conversationId,
    status: 'sent'
  };
};

export const createConversation = (title: string, type?: string): Conversation => {
  return {
    id: nanoid(),
    title,
    lastMessageTimestamp: new Date().toISOString(), // Convert to ISO string
    unreadCount: 0,
    type
  };
};
