
import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Conversation, ChatMessage } from '@/components/chat-widget/components/conversation/types';
import { useAbly } from '@/context/AblyContext';

interface UseChatReturn {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  createNewConversation: (title?: string) => Promise<string>;
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
  const createNewConversation = useCallback(async (title?: string): Promise<string> => {
    const conversationId = uuidv4();
    const newConversation: Conversation = {
      id: conversationId,
      title: title || `Conversation ${new Date().toLocaleString()}`,
      lastMessageTimestamp: new Date().toISOString(),
      unreadCount: 0,
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
    // In a real app, this would send to an API
    console.log(`Sending message to conversation ${conversationId}: ${message}`);
    
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
        content: `Thanks for your message: "${message}". This is an automated response.`,
        timestamp: new Date(),
        conversationId
      };
      
      setMessages(prev => [...prev, agentMessage]);
    }, 1000);
  }, []);

  // Get messages for a conversation
  const getMessages = useCallback(async (conversationId: string): Promise<ChatMessage[]> => {
    setLoadingMessages(true);
    
    // In a real app, this would fetch from an API
    // For now, we'll just return the messages we have in state for this conversation
    const conversationMessages = messages.filter(m => m.conversationId === conversationId);
    
    // If there are no messages yet, add a welcome message
    if (conversationMessages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: uuidv4(),
        sender: 'agent',
        content: 'Hello! How can I help you today?',
        timestamp: new Date(),
        conversationId
      };
      
      setMessages(prev => [...prev, welcomeMessage]);
      conversationMessages.push(welcomeMessage);
    }
    
    setLoadingMessages(false);
    return conversationMessages;
  }, [messages]);

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
