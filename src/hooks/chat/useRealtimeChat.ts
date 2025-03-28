
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAbly } from '@/context/AblyContext';
import { ChatMessage } from '@/components/chat-widget/components/conversation/types';
import useOfflineMessaging from './useOfflineMessaging';
import useEncryptedMessages from './useEncryptedMessages';
import { useEventSystem } from '@/hooks/useEventSystem';
import { ChatEventType } from '@/utils/events/eventTypes';
import { useRateLimiter, RateLimiter } from '@/utils/chat/rateLimiter';

interface UseRealtimeChatOptions {
  conversationId: string;
  contactId?: string;
  enableEncryption?: boolean;
}

export const useRealtimeChat = ({
  conversationId,
  contactId = 'anonymous',
  enableEncryption = false
}: UseRealtimeChatOptions) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const ablyContext = useAbly();
  const eventSystem = useEventSystem();
  const messageLoadedRef = useRef<boolean>(false);
  const rateLimiterRef = useRef<RateLimiter>(new RateLimiter());
  const [isRateLimited, setIsRateLimited] = useState<boolean>(false);
  const [rateLimitTimeRemaining, setRateLimitTimeRemaining] = useState<number>(0);
  
  // Get the offline messaging utilities
  const { queueMessage, getQueuedMessages, clearQueuedMessages } = useOfflineMessaging(conversationId);
  
  // Get encryption utilities
  const {
    isEncrypted,
    initializeEncryption,
    encryptMessage,
    decryptMessages,
    rotateKey
  } = useEncryptedMessages({
    conversationId,
    enabled: enableEncryption,
    rotationPeriod: 24 * 60 * 60 * 1000 // 24 hours
  });
  
  // Initialize and load messages
  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true);
      
      try {
        // Initialize encryption if needed
        if (enableEncryption) {
          await initializeEncryption();
        }
        
        // Simulate fetching messages from an API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // For now, just use empty messages array
        setMessages([]);
        
        // Process any queued offline messages
        const queuedMessages = await getQueuedMessages();
        if (queuedMessages.length > 0) {
          // Add queued messages to the messages array
          setMessages(prev => [...prev, ...queuedMessages]);
          
          // Send queued messages to server
          if (ablyContext.isConnected) {
            for (const message of queuedMessages) {
              try {
                // Send the message
                await sendMessageToServer(message);
              } catch (error) {
                console.error('Failed to send queued message:', error);
              }
            }
            
            // Clear queued messages
            await clearQueuedMessages();
          }
        }
        
        // Mark messages as loaded
        messageLoadedRef.current = true;
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMessages();
    
    // Set up rate limit listeners
    const rateLimitListener = (event: any) => {
      setIsRateLimited(true);
      setRateLimitTimeRemaining(event.duration || 30000);
      
      // Update remaining time periodically
      const intervalId = setInterval(() => {
        setRateLimitTimeRemaining(prev => {
          const newValue = Math.max(0, prev - 1000);
          if (newValue === 0) {
            clearInterval(intervalId);
            setIsRateLimited(false);
          }
          return newValue;
        });
      }, 1000);
    };
    
    const rateLimitClearListener = () => {
      setIsRateLimited(false);
      setRateLimitTimeRemaining(0);
    };
    
    // Subscribe to rate limit events
    const unsubscribeRateLimit = eventSystem.subscribe(
      ChatEventType.RATE_LIMIT_TRIGGERED,
      rateLimitListener
    );
    
    const unsubscribeClear = eventSystem.subscribe(
      ChatEventType.RATE_LIMIT_CLEARED,
      rateLimitClearListener
    );
    
    return () => {
      unsubscribeRateLimit();
      unsubscribeClear();
    };
  }, [
    conversationId,
    ablyContext.isConnected,
    enableEncryption,
    clearQueuedMessages,
    getQueuedMessages,
    eventSystem,
    initializeEncryption
  ]);
  
  // Listen for new messages from the server
  useEffect(() => {
    if (!ablyContext.isConnected || !messageLoadedRef.current) return;
    
    const channelName = ablyContext.getChannelName(conversationId);
    
    // Subscribe to new messages
    const unsubscribe = ablyContext.subscribe(
      channelName,
      'message',
      async (message: any) => {
        try {
          const newMessage = message.data as ChatMessage;
          
          // Don't add our own messages twice
          const isOwnMessage = newMessage.sender === contactId;
          const isDuplicate = messages.some(m => m.id === newMessage.id);
          
          if (!isOwnMessage && !isDuplicate) {
            // Decrypt message if needed
            let processedMessage = newMessage;
            if (isEncrypted && newMessage.encrypted) {
              try {
                const decryptedMessages = await decryptMessages([newMessage]);
                processedMessage = decryptedMessages[0];
              } catch (error) {
                console.error('Failed to decrypt incoming message:', error);
              }
            }
            
            // Add to messages
            setMessages(prev => [...prev, processedMessage]);
            
            // Send delivery receipt
            eventSystem.emit(ChatEventType.MESSAGE_DELIVERED, {
              messageId: newMessage.id,
              conversationId
            });
          }
        } catch (error) {
          console.error('Error processing incoming message:', error);
        }
      }
    );
    
    return () => {
      unsubscribe();
    };
  }, [
    ablyContext,
    conversationId,
    contactId,
    messages,
    isEncrypted,
    decryptMessages,
    eventSystem
  ]);
  
  // Send a message
  const sendMessage = useCallback(
    async (content: string, shouldEncrypt: boolean = false): Promise<void> => {
      if (!content.trim()) return;
      
      // Check rate limiting
      if (!rateLimiterRef.current.checkAction()) {
        const timeRemaining = rateLimiterRef.current.getRateLimitTimeRemaining();
        setIsRateLimited(true);
        setRateLimitTimeRemaining(timeRemaining);
        
        eventSystem.emit(ChatEventType.RATE_LIMIT_TRIGGERED, {
          source: 'chat',
          duration: timeRemaining
        });
        
        return Promise.reject(new Error(`Rate limited. Please wait ${Math.ceil(timeRemaining / 1000)} seconds.`));
      }
      
      try {
        // Create message object
        const messageId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        let newMessage: ChatMessage = {
          id: messageId,
          content,
          sender: contactId,
          timestamp: new Date().toISOString(),
          conversationId,
          status: 'sending'
        };
        
        // Encrypt if needed
        if (shouldEncrypt && isEncrypted) {
          try {
            const encrypted = await encryptMessage(content);
            newMessage.encrypted = true;
            newMessage.encryptedContent = encrypted.ciphertext;
            newMessage.metadata = {
              encryption: {
                iv: encrypted.iv,
                keyVersion: encrypted.keyVersion
              }
            };
          } catch (error) {
            console.error('Failed to encrypt message:', error);
            // Fall back to unencrypted message
            newMessage.encrypted = false;
          }
        }
        
        // Add to messages array optimistically
        setMessages(prev => [...prev, newMessage]);
        
        // Notify about message being sent
        eventSystem.emit(ChatEventType.MESSAGE_SENT, {
          messageId,
          conversationId
        });
        
        // Send to server if online
        if (ablyContext.isConnected) {
          await sendMessageToServer(newMessage);
          
          // Update message status
          setMessages(prev =>
            prev.map(msg =>
              msg.id === messageId ? { ...msg, status: 'sent' } : msg
            )
          );
        } else {
          // Queue for later if offline
          await queueMessage(newMessage);
          
          // Update message status
          setMessages(prev =>
            prev.map(msg =>
              msg.id === messageId ? { ...msg, status: 'queued' } : msg
            )
          );
          
          eventSystem.emit(ChatEventType.MESSAGE_FAILED, {
            messageId,
            reason: 'offline',
            willRetry: true
          });
        }
      } catch (error) {
        console.error('Error sending message:', error);
        
        // Notify about message failure
        eventSystem.emit(ChatEventType.MESSAGE_FAILED, {
          content,
          reason: (error as Error).message || 'Unknown error'
        });
        
        return Promise.reject(error);
      }
    },
    [
      ablyContext.isConnected,
      conversationId,
      contactId,
      isEncrypted,
      encryptMessage,
      queueMessage,
      eventSystem
    ]
  );
  
  // Helper function to send message to server
  const sendMessageToServer = async (message: ChatMessage): Promise<void> => {
    if (!ablyContext.isConnected) {
      throw new Error('Not connected to server');
    }
    
    const channelName = ablyContext.getChannelName(conversationId);
    
    try {
      await ablyContext.publish(channelName, 'message', message);
    } catch (error) {
      console.error('Failed to send message to server:', error);
      throw error;
    }
  };
  
  return {
    messages,
    isLoading,
    sendMessage,
    isEncrypted,
    isRateLimited,
    rateLimitTimeRemaining
  };
};

export default useRealtimeChat;
