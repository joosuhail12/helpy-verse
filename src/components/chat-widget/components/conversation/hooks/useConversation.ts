
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Message } from '../types';

/**
 * Hook for managing conversation state and logic
 */
export const useConversation = (conversationId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Load conversation messages
  useEffect(() => {
    const fetchConversation = async () => {
      setLoading(true);
      
      try {
        // In a real implementation, we would fetch messages from your API
        // This is a mock implementation
        setTimeout(() => {
          // Generate mock messages for the selected conversation
          const mockMessages: Message[] = [
            {
              id: `msg-${Date.now()}-1`,
              text: 'Hello! How can I help you today?',
              sender: 'agent',
              timestamp: new Date(Date.now() - 3600000).toISOString()
            },
            {
              id: `msg-${Date.now()}-2`,
              text: 'I have a question about your services.',
              sender: 'user',
              timestamp: new Date(Date.now() - 3500000).toISOString()
            },
            {
              id: `msg-${Date.now()}-3`,
              text: 'Sure, I\'d be happy to help! What would you like to know?',
              sender: 'agent',
              timestamp: new Date(Date.now() - 3400000).toISOString()
            }
          ];
          
          setMessages(mockMessages);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching conversation:', error);
        toast.error('Failed to load conversation');
        setLoading(false);
      }
    };
    
    fetchConversation();
  }, [conversationId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    setSending(true);
    
    // Create new message object
    const message: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: newMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    // Add to messages instantly for responsive UI
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    try {
      // In a real implementation, we would send the message to your API
      // and then receive a response from the agent
      
      // Simulate agent response after a delay
      setTimeout(() => {
        const agentResponse: Message = {
          id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          text: 'Thanks for your message. Our team will get back to you shortly.',
          sender: 'agent',
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, agentResponse]);
        setSending(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      setSending(false);
    }
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return {
    messages,
    newMessage,
    setNewMessage,
    loading,
    sending,
    handleSendMessage,
    formatTimestamp
  };
};
