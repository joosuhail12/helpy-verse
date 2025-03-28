
import { useState, useEffect, useCallback } from 'react';

interface UseServiceWorkerSyncOptions {
  conversationId: string;
  onSyncStarted?: () => void;
  onSyncCompleted?: () => void;
  onSyncFailed?: (error: Error) => void;
}

export const useServiceWorkerSync = (options: UseServiceWorkerSyncOptions) => {
  const { conversationId, onSyncStarted, onSyncCompleted, onSyncFailed } = options;
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasQueuedMessages, setHasQueuedMessages] = useState(false);
  const [offlineMode, setOfflineMode] = useState(!navigator.onLine);
  
  // Check for queued messages
  useEffect(() => {
    const checkQueuedMessages = () => {
      const messages = localStorage.getItem(`offline_messages_${conversationId}`);
      setHasQueuedMessages(!!messages && JSON.parse(messages).length > 0);
    };
    
    checkQueuedMessages();
    
    // Set up event listener for storage changes
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === `offline_messages_${conversationId}`) {
        checkQueuedMessages();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [conversationId]);
  
  // Update offline status
  useEffect(() => {
    const handleOnline = () => setOfflineMode(false);
    const handleOffline = () => setOfflineMode(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Handle service worker sync events
  useEffect(() => {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'sync-status') {
          if (event.data.status === 'started') {
            setIsSyncing(true);
            onSyncStarted?.();
          } else if (event.data.status === 'completed') {
            setIsSyncing(false);
            setHasQueuedMessages(false);
            onSyncCompleted?.();
          } else if (event.data.status === 'failed') {
            setIsSyncing(false);
            onSyncFailed?.(new Error(event.data.error || 'Sync failed'));
          }
        }
      });
    }
  }, [onSyncStarted, onSyncCompleted, onSyncFailed]);
  
  // Trigger a manual sync
  const triggerManualSync = useCallback(async () => {
    if (!hasQueuedMessages || offlineMode) return;
    
    setIsSyncing(true);
    onSyncStarted?.();
    
    try {
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('sync-messages');
      } else {
        // Fallback for browsers that don't support Background Sync
        const messages = localStorage.getItem(`offline_messages_${conversationId}`);
        if (messages) {
          // This is a simulated sync that would normally happen via the service worker
          localStorage.removeItem(`offline_messages_${conversationId}`);
          setHasQueuedMessages(false);
        }
        
        setIsSyncing(false);
        onSyncCompleted?.();
      }
    } catch (error) {
      setIsSyncing(false);
      onSyncFailed?.(error instanceof Error ? error : new Error('Failed to trigger sync'));
    }
  }, [conversationId, hasQueuedMessages, offlineMode, onSyncStarted, onSyncCompleted, onSyncFailed]);
  
  return {
    isSyncing,
    hasQueuedMessages,
    offlineMode,
    triggerManualSync
  };
};
