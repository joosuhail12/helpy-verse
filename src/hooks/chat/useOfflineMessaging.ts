
import { useState, useEffect, useCallback } from 'react';
import { 
  hasOfflineMessages, 
  getOfflineMessages,
  addOfflineMessage,
  markMessageAsSent,
  markMessageAsFailed,
  resendFailedMessages
} from '@/utils/ably/messaging';

export interface OfflineMessage {
  id: string;
  content: string;
  channelId: string;
  timestamp: number;
  status: 'queued' | 'sending' | 'sent' | 'failed';
  retryCount: number;
}

export const useOfflineMessaging = (channelId: string) => {
  const [offlineMessages, setOfflineMessages] = useState<OfflineMessage[]>([]);
  const [hasFailedMessages, setHasFailedMessages] = useState(false);
  
  // Initialize - check for existing offline messages
  useEffect(() => {
    const checkOfflineMessages = async () => {
      const hasMessages = await hasOfflineMessages();
      if (hasMessages) {
        const messages = await getOfflineMessages();
        setOfflineMessages(messages.filter((msg: OfflineMessage) => msg.channelId === channelId));
        
        // Check if there are any failed messages
        const failedMessages = messages.filter((msg: OfflineMessage) => 
          msg.status === 'failed' && msg.channelId === channelId
        );
        
        setHasFailedMessages(failedMessages.length > 0);
      }
    };
    
    checkOfflineMessages();
  }, [channelId]);
  
  // Add a message to the offline queue
  const addMessageToQueue = useCallback(async (content: string) => {
    const newMessage: OfflineMessage = {
      id: `offline-${Date.now()}`,
      content,
      channelId,
      timestamp: Date.now(),
      status: 'queued',
      retryCount: 0
    };
    
    // Add to local state
    setOfflineMessages(prev => [...prev, newMessage]);
    
    // Save to storage
    await addOfflineMessage(newMessage);
    
    return newMessage;
  }, [channelId]);
  
  // Process the queue when connection is restored
  const processQueue = useCallback(async () => {
    try {
      await resendFailedMessages();
      setHasFailedMessages(false);
    } catch (error) {
      console.error('Error processing offline message queue:', error);
    }
  }, []);
  
  // Update a message's status
  const updateMessageStatus = useCallback(async (messageId: string, status: 'sending' | 'sent' | 'failed') => {
    if (status === 'sent') {
      await markMessageAsSent(messageId);
    } else if (status === 'failed') {
      await markMessageAsFailed(messageId);
      setHasFailedMessages(true);
    }
    
    setOfflineMessages(prev => 
      prev.map(msg => msg.id === messageId ? { ...msg, status } : msg)
    );
  }, []);
  
  return {
    offlineMessages,
    addMessageToQueue,
    updateMessageStatus,
    processQueue,
    hasFailedMessages
  };
};

export default useOfflineMessaging;
