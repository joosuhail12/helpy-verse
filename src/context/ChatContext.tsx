import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Conversation, ChatMessage } from '@/components/chat-widget/components/conversation/types';
import { v4 as uuidv4 } from 'uuid';
import { contactAuth } from '@/utils/auth/contactAuth';
import { sessionManager } from '@/utils/auth/sessionManager';
import { encryptionService } from '@/utils/crypto/encryptionService';

interface ChatContextValue {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  setCurrentConversation: (conversation: Conversation | null) => void;
  createNewConversation: (title?: string) => Promise<Conversation>;
  getMessages: (conversationId: string) => Promise<ChatMessage[]>;
  saveMessages: (conversationId: string, messages: ChatMessage[]) => Promise<boolean>;
  requiresAuthentication: boolean;
  isAuthenticated: boolean;
  endToEndEncryptionEnabled: boolean;
  toggleEncryption: (enabled: boolean) => void;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

interface ChatProviderProps {
  children: React.ReactNode;
  workspaceId: string;
  requiresAuthentication?: boolean;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ 
  children, 
  workspaceId,
  requiresAuthentication = false
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [endToEndEncryptionEnabled, setEndToEndEncryptionEnabled] = useState(false);

  // Initialize the session
  useEffect(() => {
    sessionManager.initSession();
    
    // Check authentication status on load
    const authStatus = contactAuth.isAuthenticated();
    setIsAuthenticated(authStatus);
    
    // Set up session expiration check
    const checkSession = () => {
      if (!sessionManager.isSessionActive()) {
        // If session expired, we could redirect to login or show a message
        console.log('Chat session expired');
      } else {
        sessionManager.updateActivity();
      }
    };
    
    const interval = setInterval(checkSession, 60000); // Check every minute
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  // Load conversations from local storage
  useEffect(() => {
    const loadConversations = async () => {
      // If authentication is required but user is not authenticated, don't load conversations
      if (requiresAuthentication && !isAuthenticated) {
        return;
      }
      
      const savedConversations = localStorage.getItem(`chat_conversations_${workspaceId}`);
      const savedCurrentId = localStorage.getItem(`chat_current_conversation_${workspaceId}`);
      
      if (savedConversations) {
        const parsedConversations = JSON.parse(savedConversations) as Conversation[];
        setConversations(parsedConversations);
        
        if (savedCurrentId) {
          const current = parsedConversations.find(c => c.id === savedCurrentId);
          if (current) {
            setCurrentConversation(current);
          }
        }
      }
    };
    
    loadConversations();
  }, [workspaceId, requiresAuthentication, isAuthenticated]);

  // Save conversations to local storage
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem(`chat_conversations_${workspaceId}`, JSON.stringify(conversations));
    }
    
    if (currentConversation) {
      localStorage.setItem(`chat_current_conversation_${workspaceId}`, currentConversation.id);
    }
  }, [conversations, currentConversation, workspaceId]);

  const createNewConversation = useCallback(async (title?: string): Promise<Conversation> => {
    const conversationId = uuidv4();
    
    // If E2E encryption is enabled, set up encryption for this conversation
    if (endToEndEncryptionEnabled) {
      await encryptionService.setupConversationEncryption(conversationId);
    }
    
    const newConversation: Conversation = {
      id: conversationId,
      title: title || `Conversation ${new Date().toLocaleString()}`,
      lastMessageTimestamp: new Date().toISOString(),
      unreadCount: 0,
      encrypted: endToEndEncryptionEnabled
    };
    
    setConversations(prev => [...prev, newConversation]);
    setCurrentConversation(newConversation);
    
    return newConversation;
  }, [endToEndEncryptionEnabled]);

  // Get messages for a specific conversation
  const getMessages = useCallback(async (conversationId: string): Promise<ChatMessage[]> => {
    const storageKey = `chat_conversation_${conversationId}`;
    try {
      const savedData = localStorage.getItem(storageKey);
      if (!savedData) return [];
      
      const { messages, encrypted } = JSON.parse(savedData) as { 
        messages: ChatMessage[], 
        encrypted?: boolean,
        lastUpdated: string
      };
      
      // If the conversation is encrypted, decrypt the messages
      if (encrypted) {
        const conversationKey = await encryptionService.getConversationKey(conversationId);
        if (!conversationKey) {
          console.error('Could not retrieve encryption key for conversation');
          return [];
        }
        
        // Decrypt each message
        const decryptedMessages = await Promise.all(
          messages.map(async (message) => {
            if (message.encrypted && message.encryptedContent) {
              try {
                const decryptedContent = await encryptionService.decryptMessage(
                  JSON.parse(message.encryptedContent), 
                  conversationKey
                );
                return { ...message, content: decryptedContent };
              } catch (error) {
                console.error('Failed to decrypt message:', error);
                return { ...message, content: '[Encrypted message - unable to decrypt]' };
              }
            }
            return message;
          })
        );
        
        return decryptedMessages;
      }
      
      return messages || [];
    } catch (error) {
      console.error(`Failed to get messages for conversation ${conversationId}:`, error);
      return [];
    }
  }, []);

  // Save messages for a specific conversation
  const saveMessages = useCallback(async (conversationId: string, messages: ChatMessage[]): Promise<boolean> => {
    const storageKey = `chat_conversation_${conversationId}`;
    try {
      // Find if this conversation is encrypted
      const conversation = conversations.find(c => c.id === conversationId);
      const isEncrypted = conversation?.encrypted || endToEndEncryptionEnabled;
      
      // If the conversation is encrypted, encrypt the messages
      let messagesToSave = messages;
      if (isEncrypted) {
        const conversationKey = await encryptionService.getConversationKey(conversationId);
        if (!conversationKey) {
          console.error('Could not retrieve encryption key for conversation');
          return false;
        }
        
        // Encrypt each message
        messagesToSave = await Promise.all(
          messages.map(async (message) => {
            // Only encrypt if not already encrypted
            if (!message.encrypted) {
              try {
                const encryptedContent = await encryptionService.encryptMessage(
                  message.content, 
                  conversationKey
                );
                return { 
                  ...message, 
                  encrypted: true,
                  encryptedContent: JSON.stringify(encryptedContent),
                  // Keep original content for immediate display, but it won't be saved
                  content: message.content 
                };
              } catch (error) {
                console.error('Failed to encrypt message:', error);
                return message;
              }
            }
            return message;
          })
        );
      }
      
      const data = {
        messages: messagesToSave,
        encrypted: isEncrypted,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem(storageKey, JSON.stringify(data));
      
      // Also update conversation metadata
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        
        setConversations(prev => prev.map(conv => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              lastMessage: lastMessage.content.substring(0, 50) + (lastMessage.content.length > 50 ? '...' : ''),
              lastMessageTimestamp: typeof lastMessage.timestamp === 'string' 
                ? lastMessage.timestamp 
                : lastMessage.timestamp.toISOString(),
              encrypted: isEncrypted
            };
          }
          return conv;
        }));
      }
      
      return true;
    } catch (error) {
      console.error(`Failed to save messages for conversation ${conversationId}:`, error);
      return false;
    }
  }, [conversations, endToEndEncryptionEnabled]);

  const toggleEncryption = useCallback((enabled: boolean) => {
    setEndToEndEncryptionEnabled(enabled);
  }, []);

  const value = {
    conversations,
    currentConversation,
    setCurrentConversation,
    createNewConversation,
    getMessages,
    saveMessages,
    requiresAuthentication,
    isAuthenticated,
    endToEndEncryptionEnabled,
    toggleEncryption
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = (): ChatContextValue => {
  const context = useContext(ChatContext);
  
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  
  return context;
};
