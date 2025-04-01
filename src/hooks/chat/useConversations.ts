
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Conversation } from '@/store/slices/chat/types';

interface UseConversationsReturn {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  createNewConversation: () => Promise<string>;
  selectConversation: (conversationId: string) => void;
}

export const useConversations = (): UseConversationsReturn => {
  // Sample initial conversations
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "conv1",
      title: "Previous Conversation",
      lastMessage: "Thank you for your message. I'll help you.",
      lastMessageTimestamp: "2025-03-28T10:57:59.327Z",
      unreadCount: 0
    }
  ]);
  
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);

  // Select a conversation
  const selectConversation = useCallback((conversationId: string) => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (conversation) {
      setCurrentConversation(conversation);
      
      // Mark as read
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === conversationId 
            ? { ...conv, unreadCount: 0 } 
            : conv
        )
      );
    }
  }, [conversations]);

  // Create a new conversation
  const createNewConversation = useCallback(async (): Promise<string> => {
    const newConversationId = uuidv4();
    const newConversation: Conversation = {
      id: newConversationId,
      title: `Conversation ${new Date().toLocaleString()}`,
      lastMessage: "How can I help you today?",
      lastMessageTimestamp: new Date().toISOString(),
      unreadCount: 0
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversation(newConversation);
    
    return Promise.resolve(newConversationId);
  }, []);

  return {
    conversations,
    currentConversation,
    createNewConversation,
    selectConversation
  };
};
