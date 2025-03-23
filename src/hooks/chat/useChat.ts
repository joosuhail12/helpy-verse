
import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Conversation } from '@/components/chat-widget/components/conversation/types';

interface UseChatReturn {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  createNewConversation: (title?: string) => Promise<Conversation>;
  selectConversation: (conversationId: string) => void;
}

export const useChat = (): UseChatReturn => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);

  // Create a new conversation
  const createNewConversation = useCallback(async (title?: string): Promise<Conversation> => {
    const newConversation: Conversation = {
      id: uuidv4(),
      title: title || `Conversation ${new Date().toLocaleString()}`,
      lastMessageTimestamp: new Date().toISOString(),
      unreadCount: 0,
    };

    setConversations(prev => [...prev, newConversation]);
    setCurrentConversation(newConversation);
    return newConversation;
  }, []);

  // Select a conversation
  const selectConversation = useCallback((conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setCurrentConversation(conversation);
    }
  }, [conversations]);

  // Initialize with a conversation if none exists
  useEffect(() => {
    if (conversations.length === 0) {
      createNewConversation();
    }
  }, [conversations.length, createNewConversation]);

  return {
    conversations,
    currentConversation,
    createNewConversation,
    selectConversation,
  };
};
