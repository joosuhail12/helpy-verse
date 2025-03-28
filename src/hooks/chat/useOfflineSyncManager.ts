
import { useState, useEffect, useCallback } from 'react';
import { ChatMessage } from '@/components/chat-widget/components/conversation/types';
import { v4 as uuidv4 } from 'uuid';

// Storage key prefix for offline messages
const OFFLINE_QUEUE_KEY = 'pullse_offline_messages_';
const SYNC_STATUS_KEY = 'pullse_sync_status';

interface SyncStatus {
  lastSyncTime: string;
  pendingConversations: string[];
  isSyncing: boolean;
}

export const useOfflineSyncManager = (conversationId: string) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasQueuedMessages, setHasQueuedMessages] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [offlineMode, setOfflineMode] = useState(!navigator.onLine);
  
  // Load initial status
  useEffect(() => {
    const loadSyncStatus = () => {
      try {
        const statusJson = localStorage.getItem(SYNC_STATUS_KEY);
        if (statusJson) {
          const status: SyncStatus = JSON.parse(statusJson);
          setLastSyncTime(status.lastSyncTime);
          setIsSyncing(status.isSyncing);
          checkQueuedMessages();
        }
      } catch (error) {
        console.error('Failed to load sync status:', error);
      }
    };
    
    loadSyncStatus();
    
    // Set up network status listeners
    const handleOnline = () => {
      console.log('Application is online, attempting to sync');
      setOfflineMode(false);
      triggerSync();
    };
    
    const handleOffline = () => {
      console.log('Application is offline, switching to offline mode');
      setOfflineMode(true);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [conversationId]);
  
  // Save sync status
  const saveSyncStatus = useCallback((status: Partial<SyncStatus>) => {
    try {
      const currentStatusJson = localStorage.getItem(SYNC_STATUS_KEY);
      const currentStatus: SyncStatus = currentStatusJson 
        ? JSON.parse(currentStatusJson)
        : {
            lastSyncTime: new Date().toISOString(),
            pendingConversations: [],
            isSyncing: false
          };
      
      const updatedStatus = { ...currentStatus, ...status };
      localStorage.setItem(SYNC_STATUS_KEY, JSON.stringify(updatedStatus));
      
      if (status.lastSyncTime) {
        setLastSyncTime(status.lastSyncTime);
      }
      
      if (status.isSyncing !== undefined) {
        setIsSyncing(status.isSyncing);
      }
    } catch (error) {
      console.error('Failed to save sync status:', error);
    }
  }, []);
  
  // Check for queued messages for this conversation
  const checkQueuedMessages = useCallback(async () => {
    try {
      const queueKey = `${OFFLINE_QUEUE_KEY}${conversationId}`;
      const queuedMessagesJson = localStorage.getItem(queueKey);
      const hasMessages = !!queuedMessagesJson && JSON.parse(queuedMessagesJson).length > 0;
      setHasQueuedMessages(hasMessages);
      return hasMessages;
    } catch (error) {
      console.error('Error checking queued messages:', error);
      return false;
    }
  }, [conversationId]);
  
  // Queue a message to be sent when connection returns
  const queueMessage = useCallback(async (message: ChatMessage): Promise<string> => {
    try {
      const queueKey = `${OFFLINE_QUEUE_KEY}${conversationId}`;
      const existingMessagesJson = localStorage.getItem(queueKey);
      const existingMessages = existingMessagesJson ? JSON.parse(existingMessagesJson) : [];
      
      // Generate an ID if not present
      if (!message.id) {
        message.id = uuidv4();
      }
      
      // Mark as queued
      message.status = 'sending';
      message.metadata = {
        ...message.metadata,
        queued: true,
        queueTime: new Date().toISOString()
      };
      
      existingMessages.push(message);
      localStorage.setItem(queueKey, JSON.stringify(existingMessages));
      
      // Update pending conversations list
      const statusJson = localStorage.getItem(SYNC_STATUS_KEY);
      const status: SyncStatus = statusJson 
        ? JSON.parse(statusJson)
        : {
            lastSyncTime: new Date().toISOString(),
            pendingConversations: [],
            isSyncing: false
          };
      
      if (!status.pendingConversations.includes(conversationId)) {
        status.pendingConversations.push(conversationId);
        localStorage.setItem(SYNC_STATUS_KEY, JSON.stringify(status));
      }
      
      setHasQueuedMessages(true);
      return message.id;
    } catch (error) {
      console.error('Failed to queue message:', error);
      throw error;
    }
  }, [conversationId]);
  
  // Get all queued messages for this conversation
  const getQueuedMessages = useCallback(async (): Promise<ChatMessage[]> => {
    try {
      const queueKey = `${OFFLINE_QUEUE_KEY}${conversationId}`;
      const queuedMessagesJson = localStorage.getItem(queueKey);
      return queuedMessagesJson ? JSON.parse(queuedMessagesJson) : [];
    } catch (error) {
      console.error('Failed to get queued messages:', error);
      return [];
    }
  }, [conversationId]);
  
  // Clear all queued messages for this conversation
  const clearQueuedMessages = useCallback(async (): Promise<boolean> => {
    try {
      const queueKey = `${OFFLINE_QUEUE_KEY}${conversationId}`;
      localStorage.removeItem(queueKey);
      
      // Update pending conversations list
      const statusJson = localStorage.getItem(SYNC_STATUS_KEY);
      if (statusJson) {
        const status: SyncStatus = JSON.parse(statusJson);
        status.pendingConversations = status.pendingConversations.filter(
          id => id !== conversationId
        );
        localStorage.setItem(SYNC_STATUS_KEY, JSON.stringify(status));
      }
      
      setHasQueuedMessages(false);
      return true;
    } catch (error) {
      console.error('Failed to clear queued messages:', error);
      return false;
    }
  }, [conversationId]);
  
  // Trigger synchronization of offline messages
  const triggerSync = useCallback(async (): Promise<boolean> => {
    if (offlineMode || isSyncing) return false;
    
    try {
      setIsSyncing(true);
      saveSyncStatus({ isSyncing: true });
      
      // This would be where you'd implement the actual sync with your backend
      // For now, just simulate a successful sync
      console.log('Syncing queued messages for conversation:', conversationId);
      
      // Update sync status after successful sync
      saveSyncStatus({
        lastSyncTime: new Date().toISOString(),
        isSyncing: false
      });
      
      setIsSyncing(false);
      return true;
    } catch (error) {
      console.error('Failed to sync messages:', error);
      saveSyncStatus({ isSyncing: false });
      setIsSyncing(false);
      return false;
    }
  }, [conversationId, isSyncing, offlineMode, saveSyncStatus]);

  return {
    offlineMode,
    isSyncing,
    hasQueuedMessages,
    lastSyncTime,
    queueMessage,
    getQueuedMessages,
    clearQueuedMessages,
    triggerSync,
    checkQueuedMessages
  };
};
