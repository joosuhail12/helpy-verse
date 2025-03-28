
import { useState, useEffect, useCallback } from 'react';
import { ChatMessage } from '@/components/chat-widget/components/conversation/types';

interface PaginationState {
  messages: ChatMessage[];
  isLoading: boolean;
  hasMore: boolean;
  page: number;
  loadingError: Error | null;
  totalMessages: number;
}

interface UsePaginatedMessagesProps {
  conversationId: string;
  initialMessages?: ChatMessage[];
  pageSize?: number;
  loadFromStorage?: boolean;
}

export const usePaginatedMessages = ({
  conversationId,
  initialMessages = [],
  pageSize = 20,
  loadFromStorage = true
}: UsePaginatedMessagesProps) => {
  const [state, setState] = useState<PaginationState>({
    messages: initialMessages || [],
    isLoading: false,
    hasMore: true,
    page: 1,
    loadingError: null,
    totalMessages: initialMessages.length
  });

  const storageKey = `chat_messages_${conversationId}`;

  // Load initial messages from storage or provided initialMessages
  useEffect(() => {
    if (!loadFromStorage) return;

    const loadInitialMessages = async () => {
      try {
        const storedData = localStorage.getItem(storageKey);
        if (!storedData) {
          if (initialMessages.length) {
            setState(prev => ({ ...prev, messages: initialMessages }));
          }
          return;
        }

        const parsedData = JSON.parse(storedData);
        const storedMessages = parsedData.messages || [];

        if (storedMessages.length > 0) {
          // Only load the latest {pageSize} messages initially
          const initialBatch = storedMessages.slice(-pageSize);
          
          setState({
            messages: initialBatch,
            isLoading: false,
            hasMore: initialBatch.length < storedMessages.length,
            page: 1,
            loadingError: null,
            totalMessages: storedMessages.length
          });
        }
      } catch (error) {
        console.error('Failed to load messages from storage:', error);
        setState(prev => ({ ...prev, loadingError: error as Error }));
      }
    };

    loadInitialMessages();
  }, [conversationId, initialMessages, loadFromStorage, pageSize, storageKey]);

  // Function to load older messages
  const loadMoreMessages = useCallback(async () => {
    if (state.isLoading || !state.hasMore) return;

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      // Load from local storage in this example - this could be an API call in a real application
      const storedData = localStorage.getItem(storageKey);
      if (!storedData) {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          hasMore: false 
        }));
        return;
      }

      const allMessages = JSON.parse(storedData).messages || [];
      const nextPage = state.page + 1;
      const startIndex = Math.max(0, allMessages.length - (nextPage * pageSize));
      const endIndex = allMessages.length - ((state.page - 1) * pageSize);
      const olderMessages = allMessages.slice(startIndex, endIndex);

      // Merge with existing messages, avoiding duplicates
      const mergedMessages = [...olderMessages, ...state.messages].filter(
        (message, index, self) => 
          index === self.findIndex(m => m.id === message.id)
      );

      setState(prev => ({
        ...prev,
        messages: mergedMessages,
        isLoading: false,
        hasMore: startIndex > 0,
        page: nextPage,
        totalMessages: allMessages.length
      }));
    } catch (error) {
      console.error('Failed to load more messages:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        loadingError: error as Error 
      }));
    }
  }, [state.isLoading, state.hasMore, state.page, state.messages, pageSize, storageKey]);

  // Add a new message to the list
  const addMessage = useCallback((message: ChatMessage) => {
    setState(prev => {
      // Avoid adding duplicates
      if (prev.messages.some(m => m.id === message.id)) {
        return prev;
      }
      
      const newMessages = [...prev.messages, message];
      
      // Update localStorage
      try {
        const storedData = localStorage.getItem(storageKey);
        const allMessages = storedData ? JSON.parse(storedData).messages || [] : [];
        const updatedMessages = [...allMessages, message].filter(
          (msg, index, self) => index === self.findIndex(m => m.id === msg.id)
        );
        
        localStorage.setItem(storageKey, JSON.stringify({ 
          messages: updatedMessages,
          lastUpdated: new Date().toISOString()
        }));
      } catch (error) {
        console.error('Failed to save message to storage:', error);
      }
      
      return {
        ...prev,
        messages: newMessages,
        totalMessages: prev.totalMessages + 1
      };
    });
  }, [storageKey]);

  // Add multiple messages at once
  const addMessages = useCallback((newMessages: ChatMessage[]) => {
    if (!newMessages || newMessages.length === 0) return;
    
    setState(prev => {
      // Filter out duplicates
      const uniqueNewMessages = newMessages.filter(
        newMsg => !prev.messages.some(existingMsg => existingMsg.id === newMsg.id)
      );
      
      if (uniqueNewMessages.length === 0) return prev;
      
      const updatedMessages = [...prev.messages, ...uniqueNewMessages];
      
      // Update localStorage
      try {
        const storedData = localStorage.getItem(storageKey);
        const allMessages = storedData ? JSON.parse(storedData).messages || [] : [];
        
        // Combine and deduplicate
        const combinedMessages = [...allMessages, ...uniqueNewMessages].filter(
          (msg, index, self) => index === self.findIndex(m => m.id === msg.id)
        );
        
        localStorage.setItem(storageKey, JSON.stringify({ 
          messages: combinedMessages,
          lastUpdated: new Date().toISOString()
        }));
      } catch (error) {
        console.error('Failed to save messages to storage:', error);
      }
      
      return {
        ...prev,
        messages: updatedMessages,
        totalMessages: prev.totalMessages + uniqueNewMessages.length
      };
    });
  }, [storageKey]);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    hasMore: state.hasMore,
    loadMoreMessages,
    addMessage,
    addMessages,
    loadingError: state.loadingError,
    totalMessages: state.totalMessages
  };
};
