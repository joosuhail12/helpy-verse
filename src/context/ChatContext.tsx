
import React, { createContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Context type definitions
interface Conversation {
  id: string;
  title: string;
  createdAt: Date;
  lastMessage?: string;
  lastMessageTimestamp?: Date;
}

interface ChatContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isLoading: boolean;
  error: Error | null;
  createNewConversation: (title: string) => Promise<string>;
  selectConversation: (id: string) => void;
  clearCurrentConversation: () => void;
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

  // Create a new conversation
  const createNewConversation = async (title: string): Promise<string> => {
    setIsLoading(true);
    try {
      const newConversation: Conversation = {
        id: uuidv4(),
        title,
        createdAt: new Date(),
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

  const value: ChatContextType = {
    conversations,
    currentConversation,
    isLoading,
    error,
    createNewConversation,
    selectConversation,
    clearCurrentConversation
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
