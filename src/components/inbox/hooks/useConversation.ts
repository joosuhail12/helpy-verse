
import { useState, useEffect } from 'react';
import { Ticket, Message as TicketMessage } from '@/types/ticket';
import { subscribeToChannel, publishToChannel } from '@/utils/ably';
import { Message, adaptMessage } from '../types';

// Define the initial empty state
const initialMessages: Message[] = [];

interface CustomerInfo {
  id: string;
  name: string;
  company?: string;
  type: 'customer';
}

export const useConversation = (ticket: Ticket | null) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isInternalNote, setIsInternalNote] = useState(false);
  
  useEffect(() => {
    if (!ticket) return;
    
    // Reset state when ticket changes
    setMessages(initialMessages);
    setIsLoading(true);
    setNewMessage('');
    setError(null);
    
    // Simulate loading message history
    const timer = setTimeout(() => {
      // In a real app, you'd fetch messages from an API
      const initialMsgs: Message[] = [
        {
          id: `msg-${Date.now()}-1`,
          ticketId: ticket.id,
          content: ticket.lastMessage,
          sender: getCustomerInfo(),
          timestamp: ticket.createdAt,
          isInternalNote: false
        },
        {
          id: `msg-${Date.now()}-2`,
          ticketId: ticket.id,
          content: "Thank you for reaching out. I'll look into this for you right away.",
          sender: {
            id: typeof ticket.assignee === 'string' ? 'system' : (ticket.assignee?.id || 'system'),
            name: typeof ticket.assignee === 'string' ? ticket.assignee : (ticket.assignee?.name || 'Support Agent'),
            type: 'agent' as const
          },
          timestamp: new Date(new Date(ticket.createdAt).getTime() + 30000).toISOString(),
          isInternalNote: false
        }
      ];
      setMessages(initialMsgs);
      setIsLoading(false);
    }, 1000);

    // Set up real-time updates
    let cleanupFunction: () => void;
    
    const setupRealtimeUpdates = async () => {
      try {
        const cleanup = await subscribeToChannel(`ticket:${ticket.id}`, 'message', (message) => {
          if (message.name === 'message') {
            setMessages(prev => [...prev, adaptMessage(message.data)]);
          } else if (message.name === 'typing') {
            handleTypingEvent(message.data);
          }
        });
        
        cleanupFunction = cleanup;
      } catch (error) {
        console.error("Error setting up realtime updates:", error);
        setError("Could not connect to real-time updates. Please refresh the page.");
      }
    };
    
    setupRealtimeUpdates();
    
    return () => {
      clearTimeout(timer);
      if (cleanupFunction) {
        cleanupFunction();
      }
    };
  }, [ticket]);

  // Helper to get customer info in a standardized way
  function getCustomerInfo(): CustomerInfo {
    if (!ticket?.customer) {
      return { 
        id: 'unknown', 
        name: 'Unknown Customer', 
        type: 'customer' 
      };
    }
    
    const customer = typeof ticket.customer === 'string' 
      ? { id: 'unknown', name: ticket.customer }
      : ticket.customer;
      
    const company = typeof ticket.company === 'string'
      ? ticket.company
      : ticket.company?.name || '';
      
    return {
      id: customer.id || 'unknown',
      name: customer.name || 'Unknown Customer',
      type: 'customer',
      company
    };
  }

  // Handler for typing indicators
  const handleTyping = async (user: string = 'You') => {
    if (!ticket) return;
    
    // Publish the typing event to the channel
    const event = {
      user,
      timestamp: new Date().toISOString()
    };
    
    try {
      await publishToChannel(`ticket:${ticket.id}`, 'typing', event);
    } catch (error) {
      console.error("Error publishing typing event:", error);
    }
  };

  // Process incoming typing events
  const handleTypingEvent = (data: any) => {
    if (!data || !data.user) return;
    
    setIsTyping(true);
    setTypingUser(data.user);
    setTypingUsers(prev => {
      if (!prev.includes(data.user)) {
        return [...prev, data.user];
      }
      return prev;
    });
    
    // Auto-clear typing indicator after 3 seconds
    setTimeout(() => {
      setIsTyping(false);
      setTypingUser('');
      setTypingUsers(prev => prev.filter(user => user !== data.user));
    }, 3000);
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!newMessage.trim() && !isInternalNote) return;
    
    setIsSending(true);
    try {
      // Create a message object
      const message: Message = {
        id: `msg-${Date.now()}`,
        ticketId: ticket?.id || '',
        content: newMessage,
        sender: {
          id: 'agent',
          name: 'Support Agent',
          type: 'agent'
        },
        timestamp: new Date().toISOString(),
        isInternalNote,
        attachments: []
      };
      
      // In a real app, we'd send this to an API
      // For now, we'll simulate by adding to messages
      setMessages(prev => [...prev, message]);
      
      // Clear the message input
      setNewMessage('');
      setIsSending(false);
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
      setIsSending(false);
    }
  };

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
    setIsInternalNote,
    isTyping,
    typingUser
  };
};
