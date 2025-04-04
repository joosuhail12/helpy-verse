
import { useState, useCallback, useContext } from 'react';
import ChatContext from '@/context/ChatContext';

export interface Conversation {
  id: string;
  title: string;
  lastMessage?: string;
  lastMessageTimestamp: string;
  unreadCount: number;
}

export const useChat = () => {
  const contextValue = useContext(ChatContext);
  const [conversations, setConversations] = useState<Conversation[]>(contextValue?.conversations || []);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(contextValue?.currentConversation || null);
  const [messages, setMessages] = useState<any[]>(contextValue?.messages || []);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const createNewConversation = useCallback(async (title: string) => {
    // Use context function if available
    if (contextValue?.createNewConversation) {
      return contextValue.createNewConversation(title);
    }

    // Fallback implementation
    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      title,
      lastMessageTimestamp: new Date().toISOString(),
      unreadCount: 0
    };

    setConversations(prev => [...prev, newConversation]);
    setCurrentConversation(newConversation);
    return newConversation.id;
  }, [contextValue]);

  const selectConversation = useCallback((conversationId: string) => {
    // Use context function if available
    if (contextValue?.selectConversation) {
      return contextValue.selectConversation(conversationId);
    }

    // Fallback implementation
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setCurrentConversation(conversation);
      // Mark as read
      setConversations(prev => 
        prev.map(c => c.id === conversationId ? { ...c, unreadCount: 0 } : c)
      );
    }
  }, [conversations, contextValue]);

  const sendMessage = useCallback(async (conversationId: string, content: string) => {
    // Use context function if available
    if (contextValue?.sendMessage) {
      return contextValue.sendMessage(conversationId, content);
    }

    // Fallback implementation
    const newMessage = {
      id: `msg-${Date.now()}`,
      content,
      sender: 'user',
      timestamp: new Date().toISOString(),
      conversationId
    };

    setMessages(prev => [...prev, newMessage]);

    // Update conversation
    setConversations(prev => 
      prev.map(c => c.id === conversationId ? {
        ...c,
        lastMessage: content,
        lastMessageTimestamp: new Date().toISOString()
      } : c)
    );

    return newMessage;
  }, [contextValue]);

  return {
    conversations: contextValue?.conversations || conversations,
    currentConversation: contextValue?.currentConversation || currentConversation,
    messages: contextValue?.messages || messages,
    loadingMessages: contextValue?.loadingMessages || loadingMessages,
    createNewConversation,
    selectConversation,
    sendMessage
  };
};
