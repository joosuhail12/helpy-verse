
import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Conversation, ChatMessage } from '@/components/chat-widget/components/conversation/types';

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
  const workspaceId = "default";

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
    const now = new Date().toISOString();
    const conversationId = uuidv4();
    const newConversation: Conversation = {
      id: conversationId,
      title: title || `Conversation ${new Date().toLocaleString()}`,
      lastMessageTimestamp: now,
      unreadCount: 0,
      createdAt: now,
      updatedAt: now
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
    const now = new Date().toISOString();
    const newMessage: ChatMessage = {
      id: uuidv4(),
      sender: 'user',
      content: message,
      timestamp: now,
      conversationId
    };
    
    // Add the message to the local state
    setMessages(prev => [...prev, newMessage]);
    
    // Update the conversation with the last message
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId ? {
        ...conv,
        lastMessage: newMessage,
        lastMessageTimestamp: now,
        updatedAt: now
      } : conv
    ));

    // Simulate an agent response
    setTimeout(() => {
      const responseTime = new Date().toISOString();
      const agentMessage: ChatMessage = {
        id: uuidv4(),
        sender: 'agent',
        content: `Thanks for your message: "${message}". This is an automated response.`,
        timestamp: responseTime,
        conversationId
      };
      
      setMessages(prev => [...prev, agentMessage]);
      
      // Update conversation with agent response
      setConversations(prev => prev.map(conv => 
        conv.id === conversationId ? {
          ...conv,
          lastMessage: agentMessage,
          lastMessageTimestamp: responseTime,
          updatedAt: responseTime
        } : conv
      ));
    }, 1000);
  }, []);

  // Get messages for a conversation
  const getMessages = useCallback(async (conversationId: string): Promise<ChatMessage[]> => {
    setLoadingMessages(true);
    
    // Filter messages for this conversation
    const conversationMessages = messages.filter(m => m.conversationId === conversationId);
    
    // If there are no messages yet, add a welcome message
    let resultMessages = [...conversationMessages];
    if (resultMessages.length === 0) {
      const now = new Date().toISOString();
      const welcomeMessage: ChatMessage = {
        id: uuidv4(),
        sender: 'agent',
        content: 'Hello! How can I help you today?',
        timestamp: now,
        conversationId
      };
      
      resultMessages = [welcomeMessage];
      setMessages(prev => [...prev, welcomeMessage]);
    }
    
    setLoadingMessages(false);
    return resultMessages;
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
