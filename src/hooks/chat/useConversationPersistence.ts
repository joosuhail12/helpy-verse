
import { useEffect } from 'react';
import { ChatMessage } from '@/components/chat-widget/components/conversation/types';

interface ConversationData {
  messages: ChatMessage[];
  lastUpdated: string;
}

interface UsePersistenceOptions {
  onLoad?: (messages: ChatMessage[]) => void;
  autoSave?: boolean;
}

/**
 * Hook to persist chat conversations between sessions
 */
export const useConversationPersistence = (
  conversationId: string,
  messages: ChatMessage[],
  options: UsePersistenceOptions = {}
) => {
  const { onLoad, autoSave = true } = options;
  
  const storageKey = `chat_conversation_${conversationId}`;
  
  // Load saved messages when the conversation is opened
  useEffect(() => {
    const loadSavedMessages = () => {
      try {
        const savedData = localStorage.getItem(storageKey);
        if (!savedData) return;
        
        const { messages: savedMessages } = JSON.parse(savedData) as ConversationData;
        
        if (savedMessages && savedMessages.length > 0 && onLoad) {
          console.log(`Loaded ${savedMessages.length} messages for conversation ${conversationId}`);
          onLoad(savedMessages);
        }
      } catch (error) {
        console.error('Failed to load saved messages:', error);
      }
    };
    
    loadSavedMessages();
  }, [conversationId, onLoad, storageKey]);
  
  // Save messages when they change
  useEffect(() => {
    if (!autoSave || messages.length === 0) return;
    
    const saveMessages = () => {
      try {
        const data: ConversationData = {
          messages,
          lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem(storageKey, JSON.stringify(data));
        console.log(`Saved ${messages.length} messages for conversation ${conversationId}`);
      } catch (error) {
        console.error('Failed to save messages:', error);
      }
    };
    
    saveMessages();
  }, [conversationId, messages, autoSave, storageKey]);
  
  // Manual save function for external use
  const saveConversation = () => {
    try {
      const data: ConversationData = {
        messages,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem(storageKey, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Failed to manually save conversation:', error);
      return false;
    }
  };
  
  // Delete saved conversation
  const clearSavedConversation = () => {
    try {
      localStorage.removeItem(storageKey);
      return true;
    } catch (error) {
      console.error('Failed to clear saved conversation:', error);
      return false;
    }
  };
  
  return {
    saveConversation,
    clearSavedConversation
  };
};
