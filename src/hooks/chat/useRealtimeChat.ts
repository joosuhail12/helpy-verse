import { useState, useEffect, useRef, useCallback } from 'react';
import { useAbly } from '@/context/AblyContext';
import { ChatMessage, MessageStatus } from '@/components/chat-widget/components/conversation/types';
import { useOfflineMessaging } from './useOfflineMessaging';
import { useEncryptedMessages } from './useEncryptedMessages';
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
  const rateLimiter = useRef(new RateLimiter(5, 10000, 60000));
  const [isRateLimited, setIsRateLimited] = useState<boolean>(false);
  const [rateLimitTimeRemaining, setRateLimitTimeRemaining] = useState<number>(0);
  
  const { queueMessage, getQueuedMessages, clearQueuedMessages } = useOfflineMessaging(conversationId);
  
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
  
  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true);
      
      try {
        if (enableEncryption) {
          await initializeEncryption();
        }
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setMessages([]);
        
        const queuedMessages = await getQueuedMessages();
        if (queuedMessages.length > 0) {
          setMessages(prev => [...prev, ...queuedMessages]);
          
          if (ablyContext.isConnected) {
            for (const message of queuedMessages) {
              try {
                await sendMessageToServer(message);
              } catch (error) {
                console.error('Failed to send queued message:', error);
              }
            }
            
            await clearQueuedMessages();
          }
        }
        
        messageLoadedRef.current = true;
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMessages();
    
    const rateLimitListener = (event: any) => {
      setIsRateLimited(true);
      setRateLimitTimeRemaining(event.duration || 30000);
      
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
  
  useEffect(() => {
    if (!ablyContext.isConnected || !messageLoadedRef.current) return;
    
    const channelName = ablyContext.getChannelName(conversationId);
    
    const unsubscribe = ablyContext.subscribe(
      channelName,
      'message',
      async (message: any) => {
        try {
          const newMessage = message.data as ChatMessage;
          
          const isOwnMessage = newMessage.sender === contactId;
          const isDuplicate = messages.some(m => m.id === newMessage.id);
          
          if (!isOwnMessage && !isDuplicate) {
            let processedMessage = newMessage;
            if (isEncrypted && newMessage.encrypted) {
              try {
                const decryptedMessages = await decryptMessages([newMessage]);
                processedMessage = decryptedMessages[0];
              } catch (error) {
                console.error('Failed to decrypt incoming message:', error);
              }
            }
            
            setMessages(prev => [...prev, processedMessage]);
            
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
  
  const sendMessage = useCallback(
    async (content: string, shouldEncrypt: boolean = false): Promise<void> => {
      if (!content.trim()) return;
      
      if (!rateLimiter.current.checkAction()) {
        const timeRemaining = rateLimiter.current.getRateLimitTimeRemaining();
        setIsRateLimited(true);
        setRateLimitTimeRemaining(timeRemaining);
        
        eventSystem.emit(ChatEventType.RATE_LIMIT_TRIGGERED, {
          source: 'chat',
          duration: timeRemaining
        });
        
        return Promise.reject(new Error(`Rate limited. Please wait ${Math.ceil(timeRemaining / 1000)} seconds.`));
      }
      
      try {
        const messageId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        let newMessage: ChatMessage = {
          id: messageId,
          content,
          sender: contactId,
          timestamp: new Date().toISOString(),
          conversationId,
          status: 'sending'
        };
        
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
            newMessage.encrypted = false;
          }
        }
        
        setMessages(prev => [...prev, newMessage]);
        
        eventSystem.emit(ChatEventType.MESSAGE_SENT, {
          messageId,
          conversationId
        });
        
        if (ablyContext.isConnected) {
          await sendMessageToServer(newMessage);
          
          setMessages(prev =>
            prev.map(msg =>
              msg.id === messageId ? { ...msg, status: 'sent' as MessageStatus } : msg
            )
          );
        } else {
          await queueMessage(newMessage);
          
          setMessages(prev =>
            prev.map(msg =>
              msg.id === messageId ? { ...msg, status: 'queued' as MessageStatus } : msg
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
