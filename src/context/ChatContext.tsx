
import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/components/chat-widget/components/conversation/types';
import { Conversation } from '@/components/chat-widget/components/conversation/types';

// Context type definitions
interface ChatContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isLoading: boolean;
  error: Error | null;
  createNewConversation: (title: string) => Promise<string>;
  selectConversation: (id: string) => void;
  clearCurrentConversation: () => void;
  getMessages: (conversationId: string) => Promise<ChatMessage[]>;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
}

// Create the context
export const ChatContext = createContext<ChatContextType | null>(null);

// Create the provider component
export const ChatProvider: React.FC<{ children: ReactNode; workspaceId: string }> = ({ 
  children, 
  workspaceId 
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Create a new conversation
  const createNewConversation = async (title: string): Promise<string> => {
    setIsLoading(true);
    try {
      const newConversation: Conversation = {
        id: uuidv4(),
        title,
        lastMessageTimestamp: new Date().toISOString(),
        unreadCount: 0
      };
      
      setConversations(prev => [...prev, newConversation]);
      setCurrentConversation(newConversation);
      return newConversation.id;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create conversation');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Select a conversation by ID
  const selectConversation = (id: string) => {
    const conversation = conversations.find(conv => conv.id === id);
    if (conversation) {
      setCurrentConversation(conversation);
    } else {
      console.warn(`Conversation with ID ${id} not found`);
    }
  };

  // Clear current conversation
  const clearCurrentConversation = () => {
    setCurrentConversation(null);
  };

  // Get messages for a conversation
  const getMessages = useCallback(async (conversationId: string): Promise<ChatMessage[]> => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch messages from an API
      // For demo purposes, we're using a mock response
      const mockMessages: ChatMessage[] = [
        {
          id: uuidv4(),
          content: "Welcome to our support chat! How can I help you today?",
          sender: "agent",
          timestamp: new Date(Date.now() - 60000),
          conversationId,
          readBy: [`user-${workspaceId}`]
        }
      ];
      
      setMessages(mockMessages);
      setIsLoading(false);
      return mockMessages;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load messages'));
      setIsLoading(false);
      return [];
    }
  }, [workspaceId]);

  // Send a message
  const sendMessage = useCallback(async (conversationId: string, content: string): Promise<void> => {
    try {
      const newMessage: ChatMessage = {
        id: uuidv4(),
        content,
        sender: 'user',
        timestamp: new Date(),
        conversationId
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      // Update conversation with new message data
      setConversations(prev => 
        prev.map(conv => conv.id === conversationId ? {
          ...conv,
          lastMessage: content,
          lastMessageTimestamp: new Date().toISOString(),
        } : conv)
      );

      // Simulate agent response
      setTimeout(() => {
        const agentResponse: ChatMessage = {
          id: uuidv4(),
          content: `Thanks for your message. How can I help you further?`,
          sender: 'agent',
          timestamp: new Date(),
          conversationId,
          readBy: [`user-${workspaceId}`]
        };
        
        setMessages(prev => [...prev, agentResponse]);
      }, 1000);
      
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to send message'));
      throw err;
    }
  }, [workspaceId]);

  const value: ChatContextType = {
    conversations,
    currentConversation,
    isLoading,
    error,
    createNewConversation,
    selectConversation,
    clearCurrentConversation,
    getMessages,
    sendMessage
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
