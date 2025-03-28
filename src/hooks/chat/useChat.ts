
import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, Conversation } from '@/components/chat-widget/components/conversation/types';
import { mockChatMessages } from '@/mock/chatMessages';

interface UseChatProps {
  initialMessages?: ChatMessage[];
  conversationId?: string;
}

interface UseChatReturn {
  messages: ChatMessage[];
  conversations: Conversation[];
  currentConversation: Conversation | null;
  sendMessage: (conversationId: string, content: string, attachments?: File[]) => Promise<boolean>;
  createConversation: (title?: string) => Promise<Conversation>;
  setCurrentConversation: (conversation: Conversation | null) => void;
  loading: boolean;
  error: Error | null;
  // Add the missing methods that are being used in other components
  createNewConversation: (title?: string, type?: string) => Promise<string>;
  selectConversation: (conversationId: string) => void;
}

export const useChat = (props?: UseChatProps): UseChatReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>(props?.initialMessages || []);
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Customer Support',
      lastMessageTimestamp: new Date().toISOString(),
      unreadCount: 0,
      lastMessage: 'How can I help you today?'
    }
  ]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load messages on conversation change or initial load
  useEffect(() => {
    if (props?.conversationId || currentConversation?.id) {
      setLoading(true);
      
      // Simulate loading messages from API
      setTimeout(() => {
        setMessages(mockChatMessages);
        setLoading(false);
      }, 500);
    }
  }, [props?.conversationId, currentConversation?.id]);
  
  // Create a new conversation
  const createConversation = useCallback(async (title?: string): Promise<Conversation> => {
    const newConversation: Conversation = {
      id: uuidv4(),
      title: title || `Conversation ${new Date().toLocaleString()}`,
      lastMessageTimestamp: new Date().toISOString(),
      unreadCount: 0
    };
    
    setConversations(prev => [...prev, newConversation]);
    setCurrentConversation(newConversation);
    
    return newConversation;
  }, []);
  
  // Send a message
  const sendMessage = useCallback(async (
    conversationId: string, 
    content: string,
    attachments?: File[]
  ): Promise<boolean> => {
    try {
      // Create user message
      const userMessage: ChatMessage = {
        id: uuidv4(),
        content,
        sender: 'user',
        timestamp: new Date().toISOString(),
        status: 'sent',
        attachments: attachments?.map(file => ({
          id: uuidv4(),
          name: file.name,
          url: URL.createObjectURL(file),
          size: file.size,
          type: file.type
        }))
      };
      
      // Add to messages
      setMessages(prev => [...prev, userMessage]);
      
      // Update conversation
      setConversations(prev => prev.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            lastMessage: content.length > 30 ? content.substring(0, 30) + '...' : content,
            lastMessageTimestamp: new Date().toISOString()
          };
        }
        return conv;
      }));
      
      // Simulate agent response after delay
      setTimeout(() => {
        const agentMessage: ChatMessage = {
          id: uuidv4(),
          content: 'Thanks for your message. How else can I help you today?',
          sender: 'agent',
          timestamp: new Date().toISOString(),
          status: 'delivered'
        };
        
        setMessages(prev => [...prev, agentMessage]);
      }, 2000);
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to send message'));
      return false;
    }
  }, []);

  // Add the missing methods to match what's being used in other components
  const createNewConversation = useCallback(async (title?: string, type?: string): Promise<string> => {
    const newConversation = await createConversation(title);
    return newConversation.id;
  }, [createConversation]);

  const selectConversation = useCallback((conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setCurrentConversation(conversation);
    }
  }, [conversations]);

  return {
    messages,
    conversations,
    currentConversation,
    sendMessage,
    createConversation,
    setCurrentConversation,
    loading,
    error,
    // Return the new methods to satisfy the TypeScript requirements
    createNewConversation,
    selectConversation
  };
};
