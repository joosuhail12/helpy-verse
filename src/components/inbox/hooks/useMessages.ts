
import { useState } from 'react';
import { Ticket, Message as TicketMessage } from '@/types/ticket';
import { publishToChannel } from '@/utils/ably';
import { Message } from '../types';

export const useMessages = (ticket: Ticket) => {
  const [isSending, setIsSending] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  // Helper function to ensure we're working with proper Customer object
  const getCustomer = () => {
    if (!ticket.customer) {
      return { 
        id: 'unknown', 
        name: 'Unknown Customer', 
        email: '', 
        type: 'customer' as const
      };
    }
    
    if (typeof ticket.customer === 'string') {
      return { 
        id: 'unknown', 
        name: ticket.customer, 
        email: '', 
        type: 'customer' as const 
      };
    }
    
    return {
      ...ticket.customer,
      type: 'customer' as const
    };
  };

  const getAssignee = () => {
    if (!ticket.assignee) return null;
    
    if (typeof ticket.assignee === 'string') {
      return {
        id: 'unknown',
        name: ticket.assignee,
        email: '',
        type: 'agent' as const
      };
    }
    
    return {
      ...ticket.assignee,
      type: 'agent' as const
    };
  };

  const sendMessage = async (content: string, isInternalNote: boolean = false): Promise<Message | null> => {
    if (!content.trim() && attachments.length === 0) return null;
    
    setIsSending(true);
    try {
      const customer = getCustomer();
      const assignee = getAssignee();
      
      // Create a message object
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        ticketId: ticket.id,
        content,
        sender: assignee ? {
          id: assignee.id || 'agent',
          name: assignee.name,
          type: 'agent'
        } : {
          id: 'agent',
          name: 'Support Agent',
          type: 'agent'
        },
        timestamp: new Date().toISOString(),
        isInternalNote,
        attachments: attachments.map(file => ({
          id: `att-${Date.now()}-${file.name}`,
          name: file.name,
          url: URL.createObjectURL(file),
          type: file.type,
          size: file.size
        }))
      };
      
      // In a real app, we'd send this to an API
      // For now, we'll simulate by publishing to the Ably channel
      await publishToChannel(`ticket:${ticket.id}`, 'message', newMessage);
      
      // Clear attachments after sending
      setAttachments([]);
      
      return newMessage;
    } catch (error) {
      console.error("Error sending message:", error);
      return null;
    } finally {
      setIsSending(false);
    }
  };

  const addAttachment = (file: File) => {
    setAttachments(prev => [...prev, file]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return {
    sendMessage,
    isSending,
    attachments,
    addAttachment,
    removeAttachment
  };
};
