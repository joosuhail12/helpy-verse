
import { useState, useEffect } from 'react';
import { Ticket, Message, Customer, Company, stringToCustomer } from '@/types/ticket';
import { subscribeToChannel, unsubscribeFromChannel } from '@/utils/ably';

// Define the initial empty state
const initialMessages: Message[] = [];

interface CustomerInfo {
  id: string;
  name: string;
  company?: string;
}

export const useConversation = (ticket: Ticket | null) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  
  useEffect(() => {
    if (!ticket) return;
    
    // Reset state when ticket changes
    setMessages(initialMessages);
    setIsLoading(true);
    
    // Simulate loading message history
    const timer = setTimeout(() => {
      // In a real app, you'd fetch messages from an API
      setMessages([
        {
          id: `msg-${Date.now()}-1`,
          ticketId: ticket.id,
          content: ticket.lastMessage,
          sender: getCustomerInfo(),
          timestamp: ticket.createdAt,
          isInternalNote: false,
          attachments: []
        },
        {
          id: `msg-${Date.now()}-2`,
          ticketId: ticket.id,
          content: "Thank you for reaching out. I'll look into this for you right away.",
          sender: ticket.assignee || { id: 'system', name: 'Support Agent', role: 'agent' },
          timestamp: new Date(new Date(ticket.createdAt).getTime() + 30000).toISOString(),
          isInternalNote: false,
          attachments: []
        }
      ]);
      setIsLoading(false);
    }, 1000);

    // Set up real-time updates
    const cleanup = subscribeToChannel(`ticket:${ticket.id}`, (message) => {
      if (message.name === 'message') {
        setMessages(prev => [...prev, message.data]);
      } else if (message.name === 'typing') {
        handleTypingEvent(message.data);
      }
    });
    
    return () => {
      clearTimeout(timer);
      if (cleanup && typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [ticket]);

  // Helper to get customer info in a standardized way
  function getCustomerInfo(): CustomerInfo {
    if (!ticket) return { id: 'unknown', name: 'Unknown Customer' };
    
    const customer = typeof ticket.customer === 'string' 
      ? stringToCustomer(ticket.customer) 
      : ticket.customer;
      
    const company = typeof ticket.company === 'string'
      ? ticket.company
      : ticket.company?.name || '';
      
    return {
      id: customer.id,
      name: customer.name,
      company
    };
  }

  // Handler for typing indicators
  const handleTyping = (user: string) => {
    const channelName = ticket ? `ticket:${ticket.id}` : '';
    if (!channelName) return;
    
    // Publish the typing event to the channel
    const event = {
      user,
      timestamp: new Date().toISOString()
    };
    
    subscribeToChannel(channelName, event);
  };

  // Process incoming typing events
  const handleTypingEvent = (data: any) => {
    setIsTyping(true);
    setTypingUser(data.user);
    
    // Auto-clear typing indicator after 3 seconds
    setTimeout(() => {
      setIsTyping(false);
      setTypingUser('');
    }, 3000);
  };

  return {
    messages,
    isLoading,
    isTyping,
    typingUser,
    handleTyping
  };
};
