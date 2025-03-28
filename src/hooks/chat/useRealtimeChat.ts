
import { useEffect, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAbly } from '@/context/AblyContext';
import { ChatMessage } from '@/components/chat-widget/components/conversation/types';
import { useOfflineMessaging } from './useOfflineMessaging';
import { useServiceWorkerSync } from './useServiceWorkerSync';
import { useEncryptedMessages } from './useEncryptedMessages';
import { emitEvent } from '@/utils/events/eventManager';
import { ChatEventType } from '@/utils/events/eventTypes';

interface SyncManager {
  register(tag: string): Promise<void>;
}

interface ExtendedServiceWorkerRegistration extends ServiceWorkerRegistration {
  sync?: SyncManager;
}

interface ChannelAndClient {
  channelInstance: any;
  clientId: string;
}

interface UseRealtimeChatOptions {
  enableEncryption?: boolean;
  keyRotationPeriod?: number;
}

export const useRealtimeChat = (
  conversationId: string, 
  workspaceId: string,
  options: UseRealtimeChatOptions = {}
) => {
  const { enableEncryption = false, keyRotationPeriod } = options;
  const { client, clientId, getChannelName } = useAbly();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [channel, setChannel] = useState<ChannelAndClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { 
    queueMessage, 
    getQueuedMessages, 
    clearQueuedMessages 
  } = useOfflineMessaging(conversationId);
  
  const { 
    isSyncing, 
    hasQueuedMessages, 
    offlineMode,
    triggerManualSync
  } = useServiceWorkerSync({
    conversationId,
    onSyncStarted: () => console.log(`Starting sync for conversation ${conversationId}`),
    onSyncCompleted: () => console.log(`Sync completed for conversation ${conversationId}`),
    onSyncFailed: (error) => console.error(`Sync failed for conversation ${conversationId}:`, error)
  });

  const {
    isInitialized: isEncryptionInitialized,
    encryptMessage,
    decryptMessages,
    rotateKey,
    currentKeyVersion
  } = useEncryptedMessages({
    conversationId,
    enabled: enableEncryption,
    rotationPeriod: keyRotationPeriod
  });

  useEffect(() => {
    if (!client) return;
    
    const channelName = getChannelName(conversationId);
    const channelInstance = client.channels.get(channelName);
    
    setChannel({ channelInstance, clientId });
    setIsLoading(false);
    
    return () => {
      client.channels.release(channelName);
    };
  }, [client, clientId, conversationId, getChannelName]);

  useEffect(() => {
    if (!channel) return;
    
    const handleMessage = (message: any) => {
      const messageData = message.data as ChatMessage;
      
      setMessages((prevMessages) => {
        if (prevMessages.some(msg => msg.id === messageData.id)) {
          return prevMessages;
        }
        
        if (messageData.sender !== 'user') {
          emitEvent({
            type: ChatEventType.MESSAGE_RECEIVED,
            timestamp: new Date().toISOString(),
            source: 'realtime-chat',
            messageId: messageData.id,
            content: messageData.content,
            conversationId,
            agentId: messageData.metadata?.agentId,
            pageUrl: window.location.href
          });
        }
        
        return [...prevMessages, messageData];
      });
    };
    
    const subscription = channel.channelInstance.subscribe('message', handleMessage);
    
    const processOfflineMessages = async () => {
      if (offlineMode) return;
      
      const queuedMessages = await getQueuedMessages();
      
      if (queuedMessages.length > 0) {
        for (const msg of queuedMessages) {
          try {
            await channel.channelInstance.publish('message', msg);
          } catch (err) {
            console.error('Failed to send queued message:', err);
          }
        }
        
        await clearQueuedMessages();
      }
    };
    
    if (!offlineMode && hasQueuedMessages) {
      processOfflineMessages();
    }
    
    channel.channelInstance.history((err: Error, result: any) => {
      if (err) {
        console.error('Error fetching history:', err);
        return;
      }
      
      if (result && result.items) {
        const historyMessages = result.items.map((item: any) => item.data);
        
        // Decrypt messages if encryption is enabled
        (async () => {
          let messagesToAdd = historyMessages;
          
          if (enableEncryption && isEncryptionInitialized) {
            try {
              messagesToAdd = await decryptMessages(historyMessages);
            } catch (decryptError) {
              console.error('Error decrypting messages:', decryptError);
            }
          }
          
          setMessages((prevMessages) => {
            const newMessages = [...prevMessages];
            
            for (const historyMsg of messagesToAdd) {
              if (!newMessages.some(msg => msg.id === historyMsg.id)) {
                newMessages.push(historyMsg);
              }
            }
            
            return newMessages.sort((a, b) => {
              const timeA = new Date(a.timestamp).getTime();
              const timeB = new Date(b.timestamp).getTime();
              return timeA - timeB;
            });
          });
        })();
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [
    channel, 
    getQueuedMessages, 
    clearQueuedMessages, 
    offlineMode, 
    hasQueuedMessages,
    enableEncryption,
    isEncryptionInitialized,
    decryptMessages,
    conversationId
  ]);

  useEffect(() => {
    const handleOnline = () => {
      console.log('App is online, syncing queued messages...');
      triggerManualSync();
    };
    
    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [triggerManualSync]);

  // Rotate encryption key when requested
  const handleKeyRotation = useCallback(async () => {
    if (!enableEncryption || !isEncryptionInitialized) {
      return false;
    }
    
    try {
      await rotateKey();
      console.log(`Rotated encryption key for conversation ${conversationId} to version ${currentKeyVersion}`);
      return true;
    } catch (error) {
      console.error('Failed to rotate encryption key:', error);
      return false;
    }
  }, [enableEncryption, isEncryptionInitialized, rotateKey, conversationId, currentKeyVersion]);

  const sendMessage = useCallback(async (content: string, metadata: Record<string, any> = {}) => {
    if (!content.trim()) return false;
    
    let message: ChatMessage;
    
    try {
      // Encrypt the message if encryption is enabled
      if (enableEncryption && isEncryptionInitialized) {
        message = await encryptMessage(content);
      } else {
        // Use regular message format if encryption is not enabled
        message = {
          id: uuidv4(),
          content,
          sender: 'user',
          timestamp: new Date().toISOString(),
          conversationId,
          metadata: {
            ...metadata,
            clientId,
            conversationId,
            workspaceId,
          },
        };
      }
      
      emitEvent({
        type: ChatEventType.MESSAGE_SENT,
        timestamp: new Date().toISOString(),
        source: 'realtime-chat',
        messageId: message.id,
        content: message.content,
        conversationId,
        attachments: metadata.attachments?.length || 0,
        pageUrl: window.location.href
      });
      
      if (channel && channel.channelInstance && !offlineMode) {
        await channel.channelInstance.publish('message', message);
        return true;
      } else {
        await queueMessage(message);
        
        setMessages(prev => [...prev, message]);
        
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
          try {
            const registration = await navigator.serviceWorker.ready as ExtendedServiceWorkerRegistration;
            if (registration && registration.sync) {
              await registration.sync.register('sync-messages');
            }
          } catch (e) {
            console.warn('Background sync registration failed:', e);
          }
        }
        
        return true;
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err : new Error('Failed to send message'));
      
      emitEvent({
        type: ChatEventType.ERROR_OCCURRED,
        timestamp: new Date().toISOString(),
        source: 'realtime-chat',
        metadata: {
          error: err instanceof Error ? err.message : 'Unknown error sending message',
          messageId: uuidv4()
        },
        pageUrl: window.location.href
      });
      
      // Fall back to unencrypted message on error
      const fallbackMessage = {
        id: uuidv4(),
        content,
        sender: 'user',
        timestamp: new Date().toISOString(),
        conversationId,
        metadata: {
          ...metadata,
          clientId,
          conversationId,
          workspaceId,
          encryptionFailed: true
        },
      };
      
      await queueMessage(fallbackMessage);
      setMessages(prev => [...prev, fallbackMessage]);
      return false;
    }
  }, [
    channel, 
    clientId, 
    conversationId, 
    workspaceId, 
    queueMessage, 
    offlineMode,
    enableEncryption,
    isEncryptionInitialized,
    encryptMessage
  ]);

  return {
    messages,
    sendMessage,
    isLoading,
    error,
    isOffline: offlineMode,
    isSyncing,
    hasQueuedMessages,
    triggerSync: triggerManualSync,
    isEncryptionEnabled: enableEncryption && isEncryptionInitialized,
    currentKeyVersion,
    rotateEncryptionKey: handleKeyRotation
  };
};
