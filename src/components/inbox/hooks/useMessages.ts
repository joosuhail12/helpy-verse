
import { useState, useCallback } from 'react';
import type { Ticket } from '@/types/ticket';
import { getAblyChannel } from '@/utils/ably';

export interface Message {
  id: string;
  content: string;
  timestamp: string;
  isCustomer: boolean;
  sender: string; // Required field to match the interface in types.ts
  isInternalNote?: boolean;
  readBy?: string[];
  reactions?: Record<string, string[]>;
  type?: 'message' | 'internal_note';
}

export const useMessages = (ticket: Ticket) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isInternalNote, setIsInternalNote] = useState(false);

  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim()) return;
    
    setIsSending(true);
    
    try {
      // Create a new message object
      const message: Message = {
        id: Date.now().toString(),
        content: newMessage,
        timestamp: new Date().toISOString(),
        isCustomer: false,
        sender: 'agent', // Set default sender
        isInternalNote,
        type: isInternalNote ? 'internal_note' : 'message'
      };
      
      // Add to local state
      setMessages(prev => [...prev, message]);
      
      // In a real app, we would send to an API
      const channel = await getAblyChannel(`ticket:${ticket.id}`);
      await channel.publish('message:new', message);
      
      // Clear input
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  }, [newMessage, isInternalNote, ticket.id]);

  const initializeMessages = useCallback(async () => {
    // In a real app, we would fetch messages from an API
    // For now, return empty array
    return [];
  }, []);

  return {
    messages,
    setMessages,
    newMessage,
    setNewMessage,
    isSending,
    isInternalNote,
    setIsInternalNote,
    handleSendMessage,
    initializeMessages
  };
};
