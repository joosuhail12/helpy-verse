
import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Conversation, ChatMessage } from '@/components/chat-widget/components/conversation/types';

interface UseChatReturn {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  createNewConversation: (title?: string) => Promise<Conversation>;
  selectConversation: (conversationId: string) => void;
  setCurrentConversation: (conversation: Conversation | null) => void;
  sendMessage: (conversationId: string, message: string) => Promise<void>;
  getMessages: (conversationId: string) => void;
  loadingMessages: boolean;
  messages: ChatMessage[];
}

export const useChat = (): UseChatReturn => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);

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

  // Send a message
  const sendMessage = useCallback(async (conversationId: string, message: string): Promise<void> => {
    // Create a new message
    const newMessage: ChatMessage = {
      id: uuidv4(),
      content: message,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    // Add the message to the messages array
    setMessages(prev => [...prev, newMessage]);

    // Update the conversation with the last message
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { 
              ...conv, 
              lastMessage: message, 
              lastMessageTimestamp: new Date().toISOString() 
            } 
          : conv
      )
    );

    // Simulate a response after a delay (in a real app, this would be an API call)
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: uuidv4(),
        content: "Thank you for your message. This is an automated response.",
        sender: 'agent',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  }, []);

  // Get messages for a conversation
  const getMessages = useCallback((conversationId: string) => {
    setLoadingMessages(true);
    // Simulate fetching messages (in a real app, this would be an API call)
    setTimeout(() => {
      // For now, we'll just use the current messages or empty if none exist
      setLoadingMessages(false);
    }, 500);
  }, []);

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
    setCurrentConversation,
    sendMessage,
    getMessages,
    loadingMessages,
    messages,
  };
};
