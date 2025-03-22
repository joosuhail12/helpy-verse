
import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setConnectionState } from '@/store/slices/chat/chatSlice';
import { 
  queueOfflineMessage, 
  getQueuedMessagesForConversation,
  syncQueuedMessages,
  retryFailedMessages
} from '@/utils/ably/messaging/offlineMessaging';
import { useAppDispatch } from '@/hooks/useAppDispatch';

/**
 * Hook for handling offline messaging functionality
 */
export const useOfflineMessaging = (conversationId: string | null) => {
  const dispatch = useAppDispatch();
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [queuedMessages, setQueuedMessages] = useState<any[]>([]);
  const [syncInProgress, setSyncInProgress] = useState<boolean>(false);
  
  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      
      // When coming back online, try to sync messages
      if (queuedMessages.length > 0) {
        handleSyncMessages();
      }
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      dispatch(setConnectionState('offline'));
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Set initial online status
    setIsOnline(navigator.onLine);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [dispatch, queuedMessages.length]);
  
  // Load queued messages for current conversation
  useEffect(() => {
    if (conversationId) {
      const messages = getQueuedMessagesForConversation(conversationId);
      setQueuedMessages(messages);
    } else {
      setQueuedMessages([]);
    }
  }, [conversationId]);
  
  // Sync messages when connection is restored
  const handleSyncMessages = useCallback(async () => {
    if (syncInProgress) return;
    
    setSyncInProgress(true);
    try {
      await syncQueuedMessages();
      
      // Refresh queued messages list
      if (conversationId) {
        const updatedMessages = getQueuedMessagesForConversation(conversationId);
        setQueuedMessages(updatedMessages);
      }
    } catch (error) {
      console.error('Failed to sync messages:', error);
    } finally {
      setSyncInProgress(false);
    }
  }, [conversationId, syncInProgress]);
  
  // Retry failed messages
  const handleRetryFailedMessages = useCallback(async () => {
    if (!isOnline || syncInProgress) return;
    
    setSyncInProgress(true);
    try {
      await retryFailedMessages();
      
      // Refresh queued messages list
      if (conversationId) {
        const updatedMessages = getQueuedMessagesForConversation(conversationId);
        setQueuedMessages(updatedMessages);
      }
    } catch (error) {
      console.error('Failed to retry messages:', error);
    } finally {
      setSyncInProgress(false);
    }
  }, [conversationId, isOnline, syncInProgress]);
  
  // Queue a message when offline
  const queueMessage = useCallback((
    text: string,
    userId: string,
    userName: string
  ) => {
    if (!conversationId) return null;
    
    const message = queueOfflineMessage(
      conversationId,
      text,
      {
        id: userId,
        name: userName,
        type: 'customer'
      }
    );
    
    // Update local state
    setQueuedMessages(prev => [...prev, message]);
    
    return message;
  }, [conversationId]);
  
  return {
    isOnline,
    queuedMessages,
    queueMessage,
    syncMessages: handleSyncMessages,
    retryFailedMessages: handleRetryFailedMessages,
    syncInProgress
  };
};

export default useOfflineMessaging;
