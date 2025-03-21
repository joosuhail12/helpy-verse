
import { useState, useEffect } from 'react';
import { format, isToday, isYesterday } from 'date-fns';

// Message type definition
interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: {
    id: string;
    name: string;
    type: 'customer' | 'agent' | 'system';
  };
}

/**
 * Hook for handling conversation data and interactions
 */
export const useConversation = (conversationId: string, workspaceId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  
  // Fetch conversation messages
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        console.log(`Fetching messages for conversation ${conversationId} in workspace ${workspaceId}`);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockMessages: Message[] = [
          {
            id: '1',
            text: 'Hi, how can I help you today?',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            sender: {
              id: 'agent-1',
              name: 'Support Agent',
              type: 'agent'
            }
          },
          {
            id: '2',
            text: 'I have a question about your product pricing.',
            timestamp: new Date(Date.now() - 3000000).toISOString(),
            sender: {
              id: 'customer-1',
              name: 'Customer',
              type: 'customer'
            }
          },
          {
            id: '3',
            text: 'Sure, I can help with that. We have several different pricing tiers available.',
            timestamp: new Date(Date.now() - 2400000).toISOString(),
            sender: {
              id: 'agent-1',
              name: 'Support Agent',
              type: 'agent'
            }
          }
        ];
        
        setMessages(mockMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
  }, [conversationId, workspaceId]);
  
  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    const messageToSend = newMessage;
    setNewMessage('');
    setSending(true);
    
    // Create a temporary message
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      text: messageToSend,
      timestamp: new Date().toISOString(),
      sender: {
        id: 'customer-1',
        name: 'Customer',
        type: 'customer'
      }
    };
    
    // Add to messages immediately for better UX
    setMessages(prev => [...prev, tempMessage]);
    
    try {
      console.log(`Sending message to conversation ${conversationId} in workspace ${workspaceId}:`, messageToSend);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Replace temp message with confirmed message
      const confirmedMessage: Message = {
        ...tempMessage,
        id: `msg-${Date.now()}`
      };
      
      setMessages(prev => 
        prev.map(msg => msg.id === tempMessage.id ? confirmedMessage : msg)
      );
      
      // Simulate agent response after a delay
      setTimeout(() => {
        const agentResponse: Message = {
          id: `msg-${Date.now() + 1}`,
          text: "Thanks for your message. Our team will get back to you shortly.",
          timestamp: new Date().toISOString(),
          sender: {
            id: 'agent-1',
            name: 'Support Agent',
            type: 'agent'
          }
        };
        setMessages(prev => [...prev, agentResponse]);
      }, 2000);
      
    } catch (error) {
      console.error('Error sending message:', error);
      // Handle the error - remove the temp message or mark as failed
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
    } finally {
      setSending(false);
    }
  };
  
  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    
    if (isToday(date)) {
      return format(date, 'h:mm a');
    } else if (isYesterday(date)) {
      return `Yesterday at ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, yyyy h:mm a');
    }
  };
  
  return {
    messages,
    loading,
    sending,
    newMessage,
    setNewMessage,
    handleSendMessage,
    formatTimestamp
  };
};
