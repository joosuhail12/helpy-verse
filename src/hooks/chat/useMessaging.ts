
import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/components/chat-widget/components/conversation/types';
import { useMessageSubscription } from '@/hooks/chat/useMessageSubscription';
import { useOfflineMessaging } from '@/hooks/chat/useOfflineMessaging';
import { useTypingIndicator } from '@/hooks/chat/useTypingIndicator';

interface MessagingOptions {
  conversationId: string;
  workspaceId: string;
  userName?: string;
}

/**
 * Hook for managing chat messaging functionality
 */
export const useMessaging = ({ conversationId, workspaceId, userName }: MessagingOptions) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [newMessageText, setNewMessageText] = useState('');
  
  // Get subscriptions and offline messaging functionality
  const { isSubscribed, publishMessage } = useMessageSubscription(conversationId, workspaceId, {
    onMessage: (message) => {
      setMessages(prev => {
        // Avoid duplicates
        if (prev.some(msg => msg.id === message.id)) {
          return prev;
        }
        return [...prev, message];
      });
    }
  });
  
  const { 
    queueMessage, 
    getQueuedMessages, 
    clearQueuedMessages, 
    hasQueuedMessages 
  } = useOfflineMessaging(conversationId);
  
  const { 
    typingUsers, 
    sendTypingIndicator, 
    isUserTyping 
  } = useTypingIndicator(conversationId);
  
  // Fetch initial messages or load from cache
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, you would fetch messages from an API
        // For now, we'll just use a mock welcome message if no messages exist
        const storedMessages = localStorage.getItem(`messages_${conversationId}`);
        
        let initialMessages: ChatMessage[] = [];
        
        if (storedMessages) {
          initialMessages = JSON.parse(storedMessages);
        } else {
          // Add a welcome message if no messages exist
          const welcomeMessage: ChatMessage = {
            id: uuidv4(),
            sender: 'agent',
            content: 'Hello! How can I help you today?',
            timestamp: new Date().toISOString(),
            conversationId
          };
          
          initialMessages = [welcomeMessage];
        }
        
        setMessages(initialMessages);
        
        // Check for queued offline messages
        if (await hasQueuedMessages()) {
          const queuedMessages = await getQueuedMessages();
          
          // If we have a connection, send the queued messages
          if (isSubscribed) {
            for (const message of queuedMessages) {
              await publishMessage(message);
            }
            await clearQueuedMessages();
          } else {
            // Otherwise just add them to the UI
            setMessages(prev => [...prev, ...queuedMessages]);
          }
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError(err instanceof Error ? err : new Error('Failed to load messages'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMessages();
  }, [conversationId, isSubscribed, getQueuedMessages, clearQueuedMessages, hasQueuedMessages, publishMessage]);
  
  // Save messages to localStorage when they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`messages_${conversationId}`, JSON.stringify(messages));
    }
  }, [messages, conversationId]);
  
  // Handle typing status
  const handleTyping = useCallback(() => {
    sendTypingIndicator(true);
    
    // Automatically turn off typing indicator after a delay
    setTimeout(() => {
      sendTypingIndicator(false);
    }, 3000);
  }, [sendTypingIndicator]);
  
  // Handle input change
  const handleInputChange = useCallback((text: string) => {
    setNewMessageText(text);
    
    // Send typing indicator if text is non-empty
    if (text.trim().length > 0) {
      handleTyping();
    }
  }, [handleTyping]);
  
  // Send a message
  const sendMessage = useCallback(async (content: string, metadata: Record<string, any> = {}) => {
    if (!content.trim()) return false;
    
    // Create message object
    const message: ChatMessage = {
      id: uuidv4(),
      content,
      sender: 'user',
      timestamp: new Date().toISOString(),
      conversationId,
      metadata: {
        ...metadata,
        workspaceId
      },
    };
    
    try {
      // Add message to UI immediately
      setMessages(prev => [...prev, message]);
      
      // Clear input
      setNewMessageText('');
      
      // Try to send the message
      if (isSubscribed) {
        await publishMessage(message);
      } else {
        // Queue for later if offline
        await queueMessage(message);
      }
      
      return true;
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err : new Error('Failed to send message'));
      
      // Queue message for later
      await queueMessage(message);
      return false;
    }
  }, [conversationId, workspaceId, isSubscribed, publishMessage, queueMessage]);
  
  return {
    messages,
    isLoading,
    error,
    newMessageText,
    typingUsers,
    isUserTyping,
    setNewMessageText: handleInputChange,
    sendMessage,
    clearError: () => setError(null)
  };
};
