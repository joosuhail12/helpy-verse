
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Conversation } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';

interface ChatContextValue {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  setCurrentConversation: (conversation: Conversation | null) => void;
  createNewConversation: (title?: string) => Promise<Conversation>;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

interface ChatProviderProps {
  children: React.ReactNode;
  workspaceId: string;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children, workspaceId }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);

  // Load conversations from local storage
  useEffect(() => {
    const savedConversations = localStorage.getItem(`chat_conversations_${workspaceId}`);
    const savedCurrentId = localStorage.getItem(`chat_current_conversation_${workspaceId}`);
    
    if (savedConversations) {
      const parsedConversations = JSON.parse(savedConversations) as Conversation[];
      setConversations(parsedConversations);
      
      if (savedCurrentId) {
        const current = parsedConversations.find(c => c.id === savedCurrentId);
        if (current) {
          setCurrentConversation(current);
        }
      }
    }
  }, [workspaceId]);

  // Save conversations to local storage
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem(`chat_conversations_${workspaceId}`, JSON.stringify(conversations));
    }
    
    if (currentConversation) {
      localStorage.setItem(`chat_current_conversation_${workspaceId}`, currentConversation.id);
    }
  }, [conversations, currentConversation, workspaceId]);

  const createNewConversation = useCallback(async (title?: string): Promise<Conversation> => {
    const newConversation: Conversation = {
      id: uuidv4(),
      title: title || `Conversation ${new Date().toLocaleString()}`,
      lastMessageTimestamp: new Date().toISOString(),
      unreadCount: 0
    };
    
    setConversations(prev => [...prev, newConversation]);
    setCurrentConversation(newConversation);
    
    return newConversation;
  }, []);

  const value = {
    conversations,
    currentConversation,
    setCurrentConversation,
    createNewConversation,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = (): ChatContextValue => {
  const context = useContext(ChatContext);
  
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  
  return context;
};
