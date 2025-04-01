
import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Conversation } from '@/components/chat-widget/components/conversation/types';
import { useAbly } from '@/context/AblyContext';

export interface UseConversationsReturn {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  createNewConversation: (title?: string, type?: string) => Promise<string>;
  selectConversation: (conversationId: string) => void;
}

export const useConversations = (): UseConversationsReturn => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const { workspaceId } = useAbly();
  const [mockConversationsInitialized, setMockConversationsInitialized] = useState(false);

  // Initialize with mock conversations
  useEffect(() => {
    if (mockConversationsInitialized) return;
    
    const initMockConversations = () => {
      const mockConversations: Conversation[] = [
        {
          id: 'customer-service-conv',
          title: 'Order Issue #12345',
          lastMessage: 'Great! Have a wonderful day, and don\'t hesitate to reach out if you need any further assistance.',
          lastMessageTimestamp: new Date().toISOString(),
          unreadCount: 0,
          type: 'customer-service'
        },
        {
          id: 'technical-support-conv',
          title: 'Login Problem',
          lastMessage: 'You too! Don\'t hesitate to reach out if you need any further assistance.',
          lastMessageTimestamp: new Date(Date.now() - 45 * 60000).toISOString(),
          unreadCount: 0,
          type: 'technical-support'
        },
        {
          id: 'billing-inquiry-conv',
          title: 'Billing Issue',
          lastMessage: 'You\'re welcome! Have a wonderful day.',
          lastMessageTimestamp: new Date(Date.now() - 120 * 60000).toISOString(),
          unreadCount: 0,
          type: 'billing-inquiry'
        }
      ];
      
      setConversations(mockConversations);
      if (mockConversations.length > 0) {
        setCurrentConversation(mockConversations[0]);
      }
      setMockConversationsInitialized(true);
    };
    
    initMockConversations();
  }, [mockConversationsInitialized]);

  // Load conversations from local storage
  useEffect(() => {
    if (mockConversationsInitialized) return;
    
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
  }, [workspaceId, mockConversationsInitialized]);

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
  const createNewConversation = useCallback(async (title?: string, type?: string): Promise<string> => {
    const conversationId = uuidv4();
    const newConversation: Conversation = {
      id: conversationId,
      title: title || `Conversation ${new Date().toLocaleString()}`,
      lastMessageTimestamp: new Date().toISOString(),
      unreadCount: 0,
      type: type || 'general'
    };

    setConversations(prev => [...prev, newConversation]);
    setCurrentConversation(newConversation);
    
    // Return just the ID string
    return conversationId;
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
    selectConversation
  };
};
