
import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Conversation, ChatMessage } from '@/components/chat-widget/components/conversation/types';
import { useAbly } from '@/context/AblyContext';
import { MOCK_CONVERSATIONS } from '@/mock/chatMessages';

interface UseChatReturn {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  createNewConversation: (title?: string, type?: string) => Promise<string>;
  selectConversation: (conversationId: string) => void;
  sendMessage: (conversationId: string, message: string) => Promise<void>;
  getMessages: (conversationId: string) => Promise<ChatMessage[]>;
  loadingMessages: boolean;
  messages: ChatMessage[];
}

export const useChat = (): UseChatReturn => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
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
  const sendMessage = useCallback(async (conversationId: string, message: string): Promise<void> => {
    // Create a new message
    const newMessage: ChatMessage = {
      id: uuidv4(),
      sender: 'user',
      content: message,
      timestamp: new Date(),
      conversationId
    };
    
    // Add the message to the local state
    setMessages(prev => [...prev, newMessage]);
    
    // Update the conversation with the last message
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId ? {
        ...conv,
        lastMessage: message,
        lastMessageTimestamp: new Date().toISOString()
      } : conv
    ));

    // Simulate an agent response
    setTimeout(() => {
      const agentMessage: ChatMessage = {
        id: uuidv4(),
        sender: 'agent',
        content: `Thanks for your message: "${message}". How else can I assist you today?`,
        timestamp: new Date(),
        conversationId
      };
      
      setMessages(prev => [...prev, agentMessage]);
      
      // Update conversation with agent's response
      setConversations(prev => prev.map(conv => 
        conv.id === conversationId ? {
          ...conv,
          lastMessage: agentMessage.content,
          lastMessageTimestamp: new Date().toISOString()
        } : conv
      ));
    }, 1000);
  }, []);

  // Get messages for a conversation
  const getMessages = useCallback(async (conversationId: string): Promise<ChatMessage[]> => {
    setLoadingMessages(true);
    
    // Check if it's one of our mock conversations
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation?.type && MOCK_CONVERSATIONS[conversation.type as keyof typeof MOCK_CONVERSATIONS]) {
      const mockMessageGenerator = MOCK_CONVERSATIONS[conversation.type as keyof typeof MOCK_CONVERSATIONS];
      const mockMessages = mockMessageGenerator(conversationId);
      setLoadingMessages(false);
      return mockMessages;
    }
    
    // Filter messages for this conversation
    const conversationMessages = messages.filter(m => m.conversationId === conversationId);
    
    // If there are no messages yet, add a welcome message
    let resultMessages = [...conversationMessages];
    if (resultMessages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: uuidv4(),
        sender: 'agent',
        content: 'Hello! How can I help you today?',
        timestamp: new Date(),
        conversationId
      };
      
      resultMessages = [welcomeMessage];
      setMessages(prev => [...prev, welcomeMessage]);
    }
    
    setLoadingMessages(false);
    return resultMessages;
  }, [messages, conversations]);

  return {
    conversations,
    currentConversation,
    createNewConversation,
    selectConversation,
    sendMessage,
    getMessages,
    loadingMessages,
    messages
  };
};
