
import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Conversation } from '@/components/chat-widget/components/conversation/types';
import { useAbly } from '@/context/AblyContext';

interface UseChatReturn {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  createNewConversation: (title?: string) => Promise<Conversation>;
  selectConversation: (conversationId: string) => void;
}

export const useChat = (): UseChatReturn => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const { workspaceId } = useAbly();

  // Load conversations from local storage
  useEffect(() => {
    const savedConversations = localStorage.getItem(`chat_conversations_${workspaceId}`);
    const savedCurrentId = localStorage.getItem(`chat_current_conversation_${workspaceId}`);
    
    if (savedConversations) {
      try {
        const parsedConversations = JSON.parse(savedConversations) as Conversation[];
        setConversations(parsedConversations);
        
        if (savedCurrentId) {
          const current = parsedConversations.find(c => c.id === savedCurrentId);
          if (current) {
            setCurrentConversation(current);
          }
        }
      } catch (error) {
        console.error('Error parsing saved conversations:', error);
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

  return {
    conversations,
    currentConversation,
    createNewConversation,
    selectConversation,
  };
};
