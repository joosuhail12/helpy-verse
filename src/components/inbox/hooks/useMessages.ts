
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { getAblyChannel } from '@/utils/ably';
import type { Message } from '../types';
import type { Ticket } from '@/types/ticket';

export const useMessages = (ticket: Ticket) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isInternalNote, setIsInternalNote] = useState(false);
  const { toast } = useToast();

  const initializeMessages = () => {
    setMessages([{
      id: ticket.id,
      content: ticket.lastMessage,
      sender: ticket.customer,
      timestamp: ticket.createdAt,
      isCustomer: true,
      readBy: []
    }]);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsSending(true);
    try {
      const channel = await getAblyChannel(`ticket:${ticket.id}`);
      const newMsg: Message = {
        id: crypto.randomUUID(),
        content: newMessage,
        sender: 'Agent',
        timestamp: new Date().toISOString(),
        isCustomer: false,
        type: isInternalNote ? 'internal_note' : 'message',
        readBy: ['Agent']
      };

      await channel.publish('new-message', newMsg);
      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
      setIsInternalNote(false);
      
      toast({
        description: isInternalNote ? "Internal note added" : "Message sent successfully",
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: "destructive",
        description: "Failed to send message. Please try again.",
      });
    } finally {
      setIsSending(false);
    }
  };

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
