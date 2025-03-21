
import { useState, useEffect } from 'react';
import { format, isToday, isYesterday } from 'date-fns';
import { Message } from '../types';

// Define a new type for the internal message structure
interface ApiMessage {
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
 * Enhanced hook for handling conversation data and interactions with pagination
 */
export const useEnhancedConversation = (
  conversationId: string, 
  workspaceId?: string,
  page = 1,
  messagesPerPage = 20
) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [totalMessages, setTotalMessages] = useState(0);
  
  // Fetch conversation messages with pagination
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        console.log(`Fetching messages for conversation ${conversationId} in workspace ${workspaceId} - page ${page}`);
        
        // Simulate API call with pagination
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data with pagination
        const totalMockMessages = 35; // Example total count
        setTotalMessages(totalMockMessages);
        
        // Generate more mock messages for pagination demo
        const mockApiMessages: ApiMessage[] = [];
        
        // Calculate the range of messages to return based on pagination
        const startIndex = Math.max(0, totalMockMessages - (page * messagesPerPage));
        const endIndex = Math.max(0, totalMockMessages - ((page - 1) * messagesPerPage));
        
        for (let i = startIndex; i < endIndex; i++) {
          const isAgentMessage = i % 2 === 0;
          mockApiMessages.push({
            id: `msg-${i}`,
            text: isAgentMessage 
              ? `This is message #${i + 1} from the agent. It demonstrates pagination in the conversation.` 
              : `This is message #${i + 1} from the customer. It helps to show how we handle multiple messages.`,
            timestamp: new Date(Date.now() - (i * 300000)).toISOString(), // Each message 5 minutes apart
            sender: {
              id: isAgentMessage ? 'agent-1' : 'customer-1',
              name: isAgentMessage ? 'Support Agent' : 'Customer',
              type: isAgentMessage ? 'agent' : 'customer'
            }
          });
        }
        
        // Transform the API messages to match the expected Message type
        const transformedMessages: Message[] = mockApiMessages.map(msg => ({
          id: msg.id,
          text: msg.text,
          timestamp: msg.timestamp,
          sender: msg.sender.type === 'agent' ? 'agent' : 'user'
        }));
        
        // If first page, replace messages, otherwise append
        if (page === 1) {
          setMessages(transformedMessages);
        } else {
          // When paginating, we prepend older messages
          setMessages(prev => [...transformedMessages, ...prev]);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
  }, [conversationId, workspaceId, page, messagesPerPage]);
  
  // Handle sending a new message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    const messageToSend = newMessage;
    setNewMessage('');
    setSending(true);
    
    // Create a temporary message conforming to the Message type from types.ts
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      text: messageToSend,
      timestamp: new Date().toISOString(),
      sender: 'user'
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
      
      // Increment total message count
      setTotalMessages(prev => prev + 1);
      
      // Simulate agent response after a delay
      setTimeout(() => {
        const agentResponse: Message = {
          id: `msg-${Date.now() + 1}`,
          text: "Thanks for your message. Our team will get back to you shortly.",
          timestamp: new Date().toISOString(),
          sender: 'agent'
        };
        setMessages(prev => [...prev, agentResponse]);
        setTotalMessages(prev => prev + 1);
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
    formatTimestamp,
    totalMessages
  };
};

export default useEnhancedConversation;
