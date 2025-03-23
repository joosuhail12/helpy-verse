
import { useEffect, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAbly } from '@/context/AblyContext';
import { ChatMessage } from '@/components/chat-widget/components/conversation/types';
import { useOfflineMessaging } from './useOfflineMessaging';

interface ChannelAndClient {
  channelInstance: any;
  clientId: string;
}

export const useRealtimeChat = (conversationId: string, workspaceId: string) => {
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

  // Initialize channel once Ably client is ready
  useEffect(() => {
    if (!client) return;
    
    const channelName = getChannelName(conversationId);
    const channelInstance = client.channels.get(channelName);
    
    setChannel({ channelInstance, clientId });
    setIsLoading(false);
    
    return () => {
      // Clean up channel subscription
      client.channels.release(channelName);
    };
  }, [client, clientId, conversationId, getChannelName]);

  // Subscribe to messages
  useEffect(() => {
    if (!channel) return;
    
    const handleMessage = (message: any) => {
      const messageData = message.data as ChatMessage;
      
      setMessages((prevMessages) => {
        // Avoid duplicates
        if (prevMessages.some(msg => msg.id === messageData.id)) {
          return prevMessages;
        }
        
        return [...prevMessages, messageData];
      });
    };
    
    // Subscribe to new messages
    const subscription = channel.channelInstance.subscribe('message', handleMessage);
    
    // Process any messages sent while offline
    const processOfflineMessages = async () => {
      const queuedMessages = await getQueuedMessages();
      
      if (queuedMessages.length > 0) {
        // Send queued messages
        for (const msg of queuedMessages) {
          try {
            await channel.channelInstance.publish('message', msg);
          } catch (err) {
            console.error('Failed to send queued message:', err);
          }
        }
        
        // Clear queue after processing
        await clearQueuedMessages();
      }
    };
    
    processOfflineMessages();
    
    // Fetch history if available
    channel.channelInstance.history((err: Error, result: any) => {
      if (err) {
        console.error('Error fetching history:', err);
        return;
      }
      
      if (result && result.items) {
        const historyMessages = result.items.map((item: any) => item.data);
        setMessages((prevMessages) => {
          // Combine with any existing messages, avoiding duplicates
          const newMessages = [...prevMessages];
          
          for (const historyMsg of historyMessages) {
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
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [channel, getQueuedMessages, clearQueuedMessages]);

  // Send message function
  const sendMessage = useCallback(async (content: string, metadata: Record<string, any> = {}) => {
    if (!content.trim()) return false;
    
    const message: ChatMessage = {
      id: uuidv4(),
      content,
      sender: 'user',
      timestamp: new Date().toISOString(),
      metadata: {
        ...metadata,
        clientId,
        conversationId,
        workspaceId,
      },
    };
    
    try {
      if (channel && channel.channelInstance) {
        await channel.channelInstance.publish('message', message);
        return true;
      } else {
        // Store message for later if offline
        await queueMessage(message);
        
        // Also add to local state
        setMessages(prev => [...prev, message]);
        return true;
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err : new Error('Failed to send message'));
      
      // Queue message for later if send fails
      await queueMessage(message);
      
      // Still add to local state
      setMessages(prev => [...prev, message]);
      return false;
    }
  }, [channel, clientId, conversationId, workspaceId, queueMessage]);

  return {
    messages,
    sendMessage,
    isLoading,
    error,
  };
};
