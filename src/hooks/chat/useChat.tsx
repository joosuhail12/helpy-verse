
import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Conversation, ChatMessage, TypingUser } from '@/components/chat-widget/components/conversation/types';
import { useAbly } from '@/context/AblyContext';
import { MOCK_CONVERSATIONS } from '@/mock/chatMessages';

interface UseChatReturn {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  createNewConversation: (title?: string, type?: string) => Promise<string>;
  selectConversation: (conversationId: string) => void;
  sendMessage: (conversationId: string, message: string, attachments?: File[]) => Promise<void>;
  getMessages: (conversationId: string) => Promise<ChatMessage[]>;
  loadingMessages: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  typingUsers: TypingUser[];
  startTyping: (conversationId: string) => void;
  stopTyping: (conversationId: string) => void;
}

export const useChat = (): UseChatReturn => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
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
    return conversationId;
  }, []);

  // Select a conversation
  const selectConversation = useCallback((conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setCurrentConversation(conversation);
    }
  }, [conversations]);

  // Send a message
  const sendMessage = useCallback(async (conversationId: string, message: string, attachments?: File[]): Promise<void> => {
    // Create a new message
    const newMessage: ChatMessage = {
      id: uuidv4(),
      sender: 'user',
      content: message,
      timestamp: new Date().toISOString(),
      conversationId
    };
    
    // Add the message to the local state
    setMessages(prev => [...prev, newMessage]);
    
    // Update the conversation with the last message
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { 
            ...conv, 
            lastMessage: message.slice(0, 50) + (message.length > 50 ? '...' : ''),
            lastMessageTimestamp: new Date().toISOString(),
            unreadCount: 0
          }
        : conv
    ));
    
    // Simulate an agent response after a short delay
    setTimeout(() => {
      const agentResponse: ChatMessage = {
        id: uuidv4(),
        sender: 'agent',
        content: `Thank you for your message. Your question has been received and will be answered shortly.`,
        timestamp: new Date().toISOString(),
        conversationId
      };
      
      setMessages(prev => [...prev, agentResponse]);
    }, 1000);
  }, []);

  // Get messages for a conversation
  const getMessages = useCallback(async (conversationId: string): Promise<ChatMessage[]> => {
    setLoadingMessages(true);
    
    // Simulate loading from a remote source or IndexedDB
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredMessages = messages.filter(msg => msg.conversationId === conversationId);
        setLoadingMessages(false);
        resolve(filteredMessages);
      }, 300);
    });
  }, [messages]);

  // Typing indicators
  const startTyping = useCallback((conversationId: string) => {
    // Simulate a typing indicator
    console.log(`User started typing in conversation ${conversationId}`);
    // In a real app, this would send a typing event to other participants
  }, []);

  const stopTyping = useCallback((conversationId: string) => {
    // Simulate a stopping typing indicator
    console.log(`User stopped typing in conversation ${conversationId}`);
    // In a real app, this would send a stopped typing event to other participants
  }, []);

  return {
    conversations,
    currentConversation,
    createNewConversation,
    selectConversation,
    sendMessage,
    getMessages,
    loadingMessages,
    messages,
    isLoading,
    typingUsers,
    startTyping,
    stopTyping
  };
};
