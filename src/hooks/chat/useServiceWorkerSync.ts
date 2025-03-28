
import { useEffect, useCallback } from 'react';
import { registerServiceWorker, registerBackgroundSync, listenForServiceWorkerMessages } from '@/utils/serviceWorker';
import { useOfflineSyncManager } from './useOfflineSyncManager';

interface UseServiceWorkerSyncOptions {
  conversationId: string;
  onSyncStarted?: () => void;
  onSyncCompleted?: () => void;
  onSyncFailed?: (error: Error) => void;
}

/**
 * Hook for handling service worker sync for offline messages
 */
export const useServiceWorkerSync = ({
  conversationId,
  onSyncStarted,
  onSyncCompleted,
  onSyncFailed
}: UseServiceWorkerSyncOptions) => {
  const { 
    triggerSync, 
    hasQueuedMessages, 
    isSyncing, 
    offlineMode 
  } = useOfflineSyncManager(conversationId);

  // Initialize service worker and register for background sync
  const initializeServiceWorker = useCallback(async () => {
    try {
      const registration = await registerServiceWorker();
      
      if (registration && hasQueuedMessages) {
        await registerBackgroundSync();
      }
      
      return true;
    } catch (error) {
      console.error('Failed to initialize service worker:', error);
      return false;
    }
  }, [hasQueuedMessages]);

  // Handle sync request from service worker
  const handleSyncRequest = useCallback(async () => {
    if (onSyncStarted) {
      onSyncStarted();
    }
    
    try {
      if (hasQueuedMessages && !offlineMode) {
        const success = await triggerSync();
        
        if (success && onSyncCompleted) {
          onSyncCompleted();
        } else if (!success && onSyncFailed) {
          onSyncFailed(new Error('Failed to sync messages'));
        }
      }
    } catch (error) {
      console.error('Error handling sync request:', error);
      
      if (onSyncFailed) {
        onSyncFailed(error instanceof Error ? error : new Error('Unknown sync error'));
      }
    }
  }, [
    triggerSync, 
    hasQueuedMessages, 
    offlineMode, 
    onSyncStarted, 
    onSyncCompleted, 
    onSyncFailed
  ]);

  // Set up service worker message listener
  useEffect(() => {
    const cleanup = listenForServiceWorkerMessages((event) => {
      const { data } = event;
      
      if (data && data.type === 'SYNC_NEEDED') {
        handleSyncRequest();
      }
    });
    
    return cleanup;
  }, [handleSyncRequest]);

  // Initialize service worker on mount
  useEffect(() => {
    initializeServiceWorker();
  }, [initializeServiceWorker]);

  // Register for background sync when online and there are queued messages
  useEffect(() => {
    if (!offlineMode && hasQueuedMessages) {
      registerBackgroundSync();
    }
  }, [offlineMode, hasQueuedMessages]);

  return {
    isSyncing,
    hasQueuedMessages,
    offlineMode,
    triggerManualSync: handleSyncRequest
  };
};
