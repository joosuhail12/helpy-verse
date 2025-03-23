
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { 
  getAblyChannel, 
  subscribeToChannel,
  publishToChannel,
  monitorTypingIndicators,
  updateTypingStatus
} from '@/utils/ably';
import type { Message, UserPresence } from '../types';
import type { Ticket } from '@/types/ticket';

export const useConversation = (ticket: Ticket) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [activeUsers, setActiveUsers] = useState<UserPresence[]>([]);
  const { toast } = useToast();

  // Load initial messages and set up real-time subscriptions
  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true);
      try {
        // Initialize with the ticket's last message
        setMessages([{
          id: `initial-${ticket.id}`,
          content: ticket.lastMessage || '',
          text: ticket.lastMessage || '',
          sender: {
            id: ticket.customer.id,
            name: ticket.customer.name,
            type: 'customer'
          },
          timestamp: ticket.createdAt,
          isCustomer: true,
          readBy: []
        }]);

        // Get channel for this ticket
        const channel = await getAblyChannel(`ticket:${ticket.id}`);
        
        // Subscribe to new messages
        const messageUnsub = await subscribeToChannel(
          `ticket:${ticket.id}`,
          'new-message',
          (msg) => {
            setMessages(prev => [...prev, msg.data]);
          }
        );

        // Subscribe to typing indicators
        const typingUnsub = await monitorTypingIndicators(
          `ticket:${ticket.id}`,
          (users) => {
            setTypingUsers(users);
          }
        );

        // Subscribe to presence updates
        const presenceUnsub = await subscribeToChannel(
          `ticket:${ticket.id}`,
          'presence',
          (msg) => {
            setActiveUsers(msg.data);
          }
        );

        setIsLoading(false);
        setError(null);

        // Cleanup subscriptions when component unmounts
        return () => {
          messageUnsub();
          typingUnsub();
          presenceUnsub();
        };
      } catch (error) {
        console.error('Error loading messages:', error);
        setError('Failed to load conversation. Please try again.');
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [ticket.id, ticket.lastMessage, ticket.customer, ticket.createdAt]);

  // Send a message
  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim()) return;

    setIsSending(true);
    try {
      const messageData: Message = {
        id: crypto.randomUUID(),
        content: newMessage,
        text: newMessage,
        sender: {
          id: 'agent-id',
          name: 'Agent',
          type: 'agent'
        },
        timestamp: new Date().toISOString(),
        isCustomer: false,
        type: isInternalNote ? 'internal_note' : 'message',
        readBy: ['Agent']
      };

      // Publish the message to the ticket channel
      await publishToChannel(`ticket:${ticket.id}`, 'new-message', messageData);
      
      // Optimistically add to local state
      setMessages(prev => [...prev, messageData]);
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
  }, [newMessage, isInternalNote, ticket.id, toast]);

  // Handle typing indicator
  const handleTyping = useCallback(async () => {
    try {
      await updateTypingStatus(`ticket:${ticket.id}`, 'agent-id', true);
    } catch (error) {
      console.error('Error updating typing status:', error);
    }
  }, [ticket.id]);

  return {
    messages,
    newMessage,
    setNewMessage,
    typingUsers,
    activeUsers,
    handleSendMessage,
    handleTyping,
    isLoading,
    error,
    isSending,
    isInternalNote,
    setIsInternalNote
  };
};

export default useConversation;
