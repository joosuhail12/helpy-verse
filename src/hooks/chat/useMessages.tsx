
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, Conversation } from '@/components/chat-widget/components/conversation/types';
import { MOCK_CONVERSATIONS } from '@/mock/chatMessages';

export interface UseMessagesReturn {
  messages: ChatMessage[];
  loadingMessages: boolean;
  sendMessage: (conversationId: string, message: string) => Promise<void>;
  getMessages: (conversationId: string) => Promise<ChatMessage[]>;
  updateConversationWithMessage: (conversationId: string, message: string) => void;
}

export const useMessages = (
  updateConversationWithMessage: (conversationId: string, message: string) => void
): UseMessagesReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

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
    updateConversationWithMessage(conversationId, message);

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
      updateConversationWithMessage(conversationId, agentMessage.content);
    }, 1000);
  }, [updateConversationWithMessage]);

  // Get messages for a conversation
  const getMessages = useCallback(async (conversationId: string): Promise<ChatMessage[]> => {
    setLoadingMessages(true);
    
    // Check if it's one of our mock conversations based on conversation type
    // First, find if there's a matching mock conversation type
    const mockType = Object.keys(MOCK_CONVERSATIONS).find(type => 
      type === conversationId || // Direct ID match
      type.includes(conversationId) // Partial match
    );
    
    if (mockType && MOCK_CONVERSATIONS[mockType as keyof typeof MOCK_CONVERSATIONS]) {
      const mockMessageGenerator = MOCK_CONVERSATIONS[mockType as keyof typeof MOCK_CONVERSATIONS];
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
  }, [messages]);

  return {
    messages,
    loadingMessages,
    sendMessage,
    getMessages,
    updateConversationWithMessage
  };
};
