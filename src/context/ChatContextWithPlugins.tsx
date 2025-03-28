import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Conversation, ChatMessage } from '@/components/chat-widget/components/conversation/types';
import { v4 as uuidv4 } from 'uuid';
import { contactAuth } from '@/utils/auth/contactAuth';
import { sessionManager } from '@/utils/auth/sessionManager';
import { encryptionService } from '@/utils/crypto/encryptionService';
import { usePlugins } from '@/components/chat-widget/plugins/usePlugins';
import { ChatPlugin } from '@/components/chat-widget/plugins/types';

interface ChatContextValue {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  setCurrentConversation: (conversation: Conversation | null) => void;
  createNewConversation: (title?: string) => Promise<string>;
  getMessages: (conversationId: string) => Promise<ChatMessage[]>;
  saveMessages: (conversationId: string, messages: ChatMessage[]) => Promise<boolean>;
  requiresAuthentication: boolean;
  isAuthenticated: boolean;
  endToEndEncryptionEnabled: boolean;
  toggleEncryption: (enabled: boolean) => void;
  selectConversation: (conversationId: string) => void;
  sendMessage: (conversationId: string, content: string, attachments?: File[]) => Promise<void>;
  // Plugin-related methods
  registerPlugin: (plugin: ChatPlugin) => boolean;
  unregisterPlugin: (pluginId: string) => boolean;
  getAllPlugins: () => ChatPlugin[];
  getPluginById: (pluginId: string) => ChatPlugin | undefined;
  getUiExtensions: (location: 'header' | 'footer' | 'sidebar' | 'messageActions', conversationId: string) => React.ReactNode[];
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
  
  const plugins = usePlugins(workspaceId);

  useEffect(() => {
    sessionManager.initSession();
    
    const authStatus = contactAuth.isAuthenticated();
    setIsAuthenticated(authStatus);
    
    const checkSession = () => {
      if (!sessionManager.isSessionActive()) {
        console.log('Chat session expired');
      } else {
        sessionManager.updateActivity();
      }
    };
    
    const interval = setInterval(checkSession, 60000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const loadConversations = async () => {
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

  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem(`chat_conversations_${workspaceId}`, JSON.stringify(conversations));
    }
    
    if (currentConversation) {
      localStorage.setItem(`chat_current_conversation_${workspaceId}`, currentConversation.id);
    }
  }, [conversations, currentConversation, workspaceId]);

  const createNewConversation = useCallback(async (title?: string): Promise<string> => {
    const conversationId = uuidv4();
    
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
    
    await plugins.trackEvent('conversation_created', { conversationId }, conversationId);
    
    return conversationId;
  }, [endToEndEncryptionEnabled, plugins]);

  const selectConversation = useCallback((conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setCurrentConversation(conversation);
      
      plugins.trackEvent('conversation_selected', { conversationId }, conversationId);
    }
  }, [conversations, plugins]);

  const sendMessage = useCallback(async (conversationId: string, content: string, attachments?: File[]) => {
    const transformedContent = await plugins.interceptOutgoingMessage(content, conversationId);
    
    console.log(`Sending message to conversation ${conversationId}: ${transformedContent}`);
    console.log(`Attachments: ${attachments?.length || 0}`);
    
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? {
              ...conv,
              lastMessage: transformedContent,
              lastMessageTimestamp: new Date().toISOString()
            }
          : conv
      )
    );
    
    await plugins.trackEvent('message_sent', { 
      conversationId, 
      content: transformedContent,
      hasAttachments: !!attachments?.length 
    }, conversationId);
  }, [plugins]);

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
      
      if (encrypted) {
        const conversationKey = await encryptionService.getConversationKey(conversationId);
        if (!conversationKey) {
          console.error('Could not retrieve encryption key for conversation');
          return [];
        }
        
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
        
        const transformedMessages = await Promise.all(
          decryptedMessages.map(msg => plugins.applyMessageTransforms(msg, conversationId))
        );
        
        return transformedMessages;
      }
      
      const transformedMessages = await Promise.all(
        messages.map(msg => plugins.applyMessageTransforms(msg, conversationId))
      );
      
      return transformedMessages || [];
    } catch (error) {
      console.error(`Failed to get messages for conversation ${conversationId}:`, error);
      return [];
    }
  }, [plugins]);

  const saveMessages = useCallback(async (conversationId: string, messages: ChatMessage[]): Promise<boolean> => {
    const storageKey = `chat_conversation_${conversationId}`;
    try {
      const conversation = conversations.find(c => c.id === conversationId);
      const isEncrypted = conversation?.encrypted || endToEndEncryptionEnabled;
      
      let messagesToSave = messages;
      if (isEncrypted) {
        const conversationKey = await encryptionService.getConversationKey(conversationId);
        if (!conversationKey) {
          console.error('Could not retrieve encryption key for conversation');
          return false;
        }
        
        messagesToSave = await Promise.all(
          messages.map(async (message) => {
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
      
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        
        if (lastMessage.sender !== 'user') {
          await plugins.interceptIncomingMessage(lastMessage, conversationId);
        }
        
        setConversations(prev => prev.map(conv => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              lastMessage: lastMessage.content.substring(0, 50) + (lastMessage.content.length > 50 ? '...' : ''),
              lastMessageTimestamp: new Date().toISOString(),
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
  }, [conversations, endToEndEncryptionEnabled, plugins]);

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
    toggleEncryption,
    selectConversation,
    sendMessage,
    registerPlugin: plugins.registerPlugin,
    unregisterPlugin: plugins.unregisterPlugin,
    getAllPlugins: plugins.getAllPlugins,
    getPluginById: plugins.getPluginById,
    getUiExtensions: plugins.getUiExtensions
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
