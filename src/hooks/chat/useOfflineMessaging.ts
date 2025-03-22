
import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectConnectionState } from '@/store/slices/chat/selectors'; 
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { sendChatMessage } from '@/store/slices/chat/chatSlice';
import * as offlineUtils from '@/utils/ably/messaging/offlineMessaging';

interface QueuedMessage {
  id: string;
  text: string;
  timestamp: string;
  status: 'queued' | 'sending' | 'sent' | 'failed';
  sender: {
    id: string;
    name: string;
    type: 'agent' | 'customer';
  };
}

/**
 * Hook for handling offline message queuing and synchronization
 */
const useOfflineMessaging = (conversationId: string) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queuedMessages, setQueuedMessages] = useState<QueuedMessage[]>([]);
  const connectionState = useSelector(selectConnectionState);
  const dispatch = useAppDispatch();
  
  // Set up online/offline event listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Load queued messages for this conversation on mount
  useEffect(() => {
    if (!conversationId) return;
    
    const loadQueuedMessages = () => {
      const messages = offlineUtils.getQueuedMessagesForConversation(conversationId);
      const converted = messages.map(msg => 
        offlineUtils.convertQueuedMessageToChatMessage(msg)
      );
      setQueuedMessages(converted);
    };
    
    loadQueuedMessages();
    
    // Refresh queued messages every 5 seconds
    const intervalId = setInterval(loadQueuedMessages, 5000);
    
    return () => clearInterval(intervalId);
  }, [conversationId]);
  
  // Queue a message when offline
  const queueMessage = useCallback((text: string, userId: string, userName: string) => {
    if (!conversationId) return;
    
    const queuedMsg = offlineUtils.queueMessage(
      conversationId,
      text,
      userId,
      'user',
      userName
    );
    
    // Convert and add to local state immediately for UI
    const convertedMsg = offlineUtils.convertQueuedMessageToChatMessage(queuedMsg);
    setQueuedMessages(prev => [...prev, convertedMsg]);
    
    return queuedMsg.id;
  }, [conversationId]);
  
  // Sync all queued messages when coming back online
  const syncMessages = useCallback(async () => {
    if (!isOnline || connectionState !== 'connected' || !conversationId) return;
    
    // Get all queued messages for this conversation
    const messages = offlineUtils.getQueuedMessagesForConversation(conversationId);
    
    // Only attempt to send queued or failed messages
    const sendableMessages = messages.filter(
      msg => msg.status === 'queued' || msg.status === 'failed'
    );
    
    // Loop through and attempt to send each message
    for (const msg of sendableMessages) {
      try {
        // Mark as sending
        offlineUtils.updateQueuedMessageStatus(msg.id, 'sending');
        
        // Try to send the message
        await dispatch(sendChatMessage({
          conversationId,
          text: msg.text,
          userId: msg.userId
        })).unwrap();
        
        // Mark as sent and remove from queue
        offlineUtils.updateQueuedMessageStatus(msg.id, 'sent');
        setTimeout(() => offlineUtils.removeQueuedMessage(msg.id), 1000);
      } catch (error) {
        console.error('Failed to sync queued message:', error);
        offlineUtils.updateQueuedMessageStatus(msg.id, 'failed');
      }
    }
    
    // Refresh the queued messages list
    const updatedMessages = offlineUtils.getQueuedMessagesForConversation(conversationId)
      .map(msg => offlineUtils.convertQueuedMessageToChatMessage(msg));
    setQueuedMessages(updatedMessages);
    
  }, [isOnline, connectionState, conversationId, dispatch]);
  
  // Retry sending failed messages
  const retryFailedMessages = useCallback(() => {
    if (isOnline && connectionState === 'connected') {
      syncMessages();
    }
  }, [isOnline, connectionState, syncMessages]);
  
  // Try to sync messages when we come back online
  useEffect(() => {
    if (isOnline && connectionState === 'connected') {
      syncMessages();
    }
  }, [isOnline, connectionState, syncMessages]);
  
  return {
    isOnline,
    queuedMessages,
    queueMessage,
    syncMessages,
    retryFailedMessages
  };
};

export default useOfflineMessaging;
