
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/components/chat-widget/components/conversation/types';

interface Conversation {
  id: string;
  title: string;
  lastMessage?: string;
  lastMessageTimestamp?: Date;
  unreadCount: number;
}

interface ChatContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Record<string, ChatMessage[]>;
  createNewConversation: (title?: string) => Promise<Conversation>;
  selectConversation: (id: string) => void;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  getMessages: (conversationId: string) => Promise<ChatMessage[]>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
  workspaceId: string;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children, workspaceId }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});

  // Initialize chat with workspaceId
  useEffect(() => {
    console.info(`Initialized chat with workspace ID: ${workspaceId}`);
    
    // Initial conversation for demo purposes
    if (conversations.length === 0) {
      const defaultConversation = {
        id: uuidv4(),
        title: 'New Conversation',
        lastMessageTimestamp: new Date(),
        unreadCount: 0
      };
      
      setConversations([defaultConversation]);
      setCurrentConversation(defaultConversation);
      setMessages({
        [defaultConversation.id]: []
      });
    }
    
  }, [workspaceId]);

  const createNewConversation = async (title: string = 'New Conversation'): Promise<Conversation> => {
    const newConversation = {
      id: uuidv4(),
      title,
      lastMessageTimestamp: new Date(),
      unreadCount: 0
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversation(newConversation);
    setMessages(prev => ({
      ...prev,
      [newConversation.id]: []
    }));
    
    return newConversation;
  };

  const selectConversation = (id: string) => {
    const conversation = conversations.find(c => c.id === id);
    if (conversation) {
      setCurrentConversation(conversation);
      
      // Mark as read
      setConversations(prev => 
        prev.map(c => c.id === id ? { ...c, unreadCount: 0 } : c)
      );
    }
  };

  const sendMessage = async (conversationId: string, content: string): Promise<void> => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      conversationId,
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    // Add message to conversation
    setMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage]
    }));
    
    // Update conversation metadata
    setConversations(prev => 
      prev.map(c => c.id === conversationId ? {
        ...c,
        lastMessage: content,
        lastMessageTimestamp: new Date()
      } : c)
    );
    
    // For demo, simulate agent reply after 1 second
    setTimeout(() => {
      const replyMessage: ChatMessage = {
        id: uuidv4(),
        conversationId,
        content: `Thanks for your message: "${content}". How can I help you further?`,
        sender: 'agent',
        timestamp: new Date()
      };
      
      setMessages(prev => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), replyMessage]
      }));
      
      // Update conversation metadata
      setConversations(prev => 
        prev.map(c => c.id === conversationId ? {
          ...c,
          lastMessage: replyMessage.content,
          lastMessageTimestamp: new Date(),
          unreadCount: currentConversation?.id !== conversationId ? (c.unreadCount + 1) : 0
        } : c)
      );
    }, 1000);
  };

  const getMessages = async (conversationId: string): Promise<ChatMessage[]> => {
    return messages[conversationId] || [];
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentConversation,
        messages,
        createNewConversation,
        selectConversation,
        sendMessage,
        getMessages
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  
  return context;
};

export default ChatContext;
