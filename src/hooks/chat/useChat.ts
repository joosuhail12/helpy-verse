
import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, Conversation } from '@/components/chat-widget/components/conversation/types';
import { mockChatMessages } from '@/mock/chatMessages';

// This is a simplified mock implementation for the chat hook
export const useChat = (conversationId?: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  
  // Load mock data on initialization
  useEffect(() => {
    const delay = setTimeout(() => {
      if (conversationId) {
        setMessages(mockChatMessages);
      }
      
      setConversations([
        {
          id: 'demo-conversation',
          title: 'Support Conversation',
          lastMessage: 'I want to upgrade my plan',
          lastMessageTimestamp: new Date().toISOString(),
          unreadCount: 0
        }
      ]);
      
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(delay);
  }, [conversationId]);
  
  // Update current conversation when conversationId changes
  useEffect(() => {
    if (conversationId && conversations.length > 0) {
      const conversation = conversations.find(conv => conv.id === conversationId);
      if (conversation) {
        setCurrentConversation(conversation);
      }
    }
  }, [conversationId, conversations]);
  
  // Send a message
  const sendMessage = useCallback((content: string, attachments: File[] = []) => {
    if (!content.trim() && attachments.length === 0) return;
    
    const newMessage: ChatMessage = {
      id: uuidv4(),
      content,
      sender: 'user',
      timestamp: new Date().toISOString(),
      conversationId: conversationId || 'demo-conversation',
      status: 'sent'
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate agent response after delay
    setTimeout(() => {
      const responseMessage: ChatMessage = {
        id: uuidv4(),
        content: 'Thank you for your message. An agent will respond shortly.',
        sender: 'agent',
        timestamp: new Date().toISOString(),
        conversationId: conversationId || 'demo-conversation',
        status: 'delivered'
      };
      
      setMessages(prev => [...prev, responseMessage]);
    }, 1000);
  }, [conversationId]);
  
  // Notify typing
  const notifyTyping = useCallback(() => {
    // This would normally send a typing indicator to the server
    console.log('User is typing...');
  }, []);
  
  // Create a new conversation
  const createNewConversation = useCallback(async (title: string): Promise<string> => {
    const newConversationId = uuidv4();
    
    const newConversation: Conversation = {
      id: newConversationId,
      title,
      lastMessageTimestamp: new Date().toISOString(),
      unreadCount: 0
    };
    
    setConversations(prev => [...prev, newConversation]);
    setCurrentConversation(newConversation);
    
    return newConversationId;
  }, []);
  
  // Select a conversation
  const selectConversation = useCallback((id: string) => {
    const conversation = conversations.find(conv => conv.id === id);
    if (conversation) {
      setCurrentConversation(conversation);
    }
  }, [conversations]);
  
  return {
    messages,
    isLoading,
    typingUsers,
    sendMessage,
    notifyTyping,
    conversations,
    currentConversation,
    createNewConversation,
    selectConversation
  };
};
