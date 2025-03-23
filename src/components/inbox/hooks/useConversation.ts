import { useState, useEffect } from 'react';
import { 
  Ticket, 
  Message, 
  stringToCustomer,
  Customer,
  TeamMember,
  Company,
  stringToCompany,
  stringToTeamMember
} from '@/types/ticket';
import { getAblyChannel, subscribeToChannel, publishToChannel } from '@/utils/ably';

export const useConversation = (ticket: Ticket) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  
  // Helper functions to ensure we're working with Customer/Company/TeamMember objects, not strings
  const getCustomer = (): Customer => {
    if (typeof ticket.customer === 'string') {
      return stringToCustomer(ticket.customer);
    }
    return ticket.customer;
  };

  const getCompany = (): Company => {
    if (typeof ticket.company === 'string') {
      return stringToCompany(ticket.company);
    }
    return ticket.company;
  };

  const getAssignee = (): TeamMember | null => {
    if (!ticket.assignee) return null;
    if (typeof ticket.assignee === 'string') {
      return stringToTeamMember(ticket.assignee);
    }
    return ticket.assignee;
  };

  useEffect(() => {
    // Load initial messages
    const loadMessages = async () => {
      setIsLoading(true);
      try {
        // In a real app, we'd fetch messages from an API
        // For now, generate a fake conversation
        const customer = getCustomer();
        const mockMessages: Message[] = [
          {
            id: '1',
            ticketId: ticket.id,
            content: ticket.lastMessage,
            sender: customer,
            timestamp: ticket.createdAt,
            attachments: []
          },
          {
            id: '2',
            ticketId: ticket.id,
            content: `Hello ${customer.name}, thanks for reaching out. I'll be helping you with this issue today.`,
            sender: getAssignee() || stringToTeamMember('Support Agent'),
            timestamp: new Date(new Date(ticket.createdAt).getTime() + 30 * 60000).toISOString(),
            attachments: []
          }
        ];
        
        setMessages(mockMessages);
      } catch (error) {
        console.error("Error loading messages:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMessages();
    
    // Set up Ably real-time channel for this ticket
    const channelName = `ticket:${ticket.id}`;
    const cleanup = subscribeToChannel(channelName, 'message', (message: any) => {
      setMessages(prev => [...prev, message.data]);
    });
    
    return () => {
      cleanup();
    };
  }, [ticket.id]);

  const handleTyping = (user: string) => {
    setIsTyping(true);
    setTypingUser(user);
    
    // Clear typing status after 3 seconds
    setTimeout(() => {
      setIsTyping(false);
      setTypingUser(null);
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
