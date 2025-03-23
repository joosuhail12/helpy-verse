
import { useState, useEffect } from 'react';
import { Ticket, Message, Customer, stringToCustomer } from '@/types/ticket';
import { subscribeToChannel } from '@/utils/ably';

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
          sender: ticket.assignee || { id: 'system', name: 'Support Agent', type: 'agent' },
          timestamp: new Date(new Date(ticket.createdAt).getTime() + 30000).toISOString(),
          isInternalNote: false,
          attachments: []
        }
      ]);
      setIsLoading(false);
    }, 1000);

    // Set up real-time updates
    const cleanup = subscribeToChannel(`ticket:${ticket.id}`, 'message', (message) => {
      if (message.name === 'message') {
        setMessages(prev => [...prev, message.data]);
      } else if (message.name === 'typing') {
        handleTypingEvent(message.data);
      }
    });
    
    return () => {
      clearTimeout(timer);
      if (cleanup) {
        cleanup();
      }
    };
  }, [ticket]);

  // Helper to get customer info in a standardized way
  function getCustomerInfo(): any {
    if (!ticket) return { id: 'unknown', name: 'Unknown Customer', type: 'customer' };
    
    const customer = typeof ticket.customer === 'string' 
      ? stringToCustomer(ticket.customer) 
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
  const handleTyping = (user: string = 'You') => {
    if (!ticket) return;
    
    // Publish the typing event to the channel
    const event = {
      user,
      timestamp: new Date().toISOString()
    };
    
    subscribeToChannel(`ticket:${ticket.id}`, 'typing', event);
  };

  // Process incoming typing events
  const handleTypingEvent = (data: any) => {
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
        sender: ticket?.assignee || { id: 'agent', name: 'Support Agent', type: 'agent' },
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
