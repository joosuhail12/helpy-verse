
import { useState, useCallback, useEffect, useRef } from 'react';
import { 
  monitorTypingIndicators, 
  updateTypingStatus 
} from '@/utils/ably';
import { debounceWithImmediate } from '@/utils/performance/performanceUtils';

interface UseTypingIndicatorOptions {
  userId: string;
  userName: string;
}

/**
 * Hook for handling typing indicators in real-time chat
 */
export const useTypingIndicator = (conversationId: string | null, connectionState: string, options: UseTypingIndicatorOptions) => {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const typingMonitorRef = useRef<(() => void) | null>(null);
  
  // Monitor typing indicators
  useEffect(() => {
    if (!conversationId || connectionState !== 'connected') return;
    
    // Clean up previous monitor if any
    if (typingMonitorRef.current) {
      typingMonitorRef.current();
    }
    
    console.log(`Monitoring typing indicators in conversation: ${conversationId}`);
    
    // Set up new monitor with proper async handling
    const setupMonitor = async () => {
      try {
        const unsubscribe = await monitorTypingIndicators(conversationId, (users) => {
          setTypingUsers(users);
        });
        
        typingMonitorRef.current = unsubscribe;
        return unsubscribe;
      } catch (error) {
        console.error(`Error monitoring typing indicators for conversation ${conversationId}:`, error);
        return () => {};
      }
    };
    
    // Setup the monitor and store the promise
    const monitorPromise = setupMonitor();
    
    return () => {
      // Handle cleanup when component unmounts
      if (typingMonitorRef.current) {
        typingMonitorRef.current();
        typingMonitorRef.current = null;
      } else {
        // Handle the case where the monitor promise hasn't resolved yet
        monitorPromise.then(unsubscribe => {
          if (unsubscribe) {
            unsubscribe();
          }
        }).catch(err => {
          console.error('Error during unsubscribe:', err);
        });
      }
    };
  }, [conversationId, connectionState]);
  
  // Create optimized typing status updater
  const updateTypingStatusOptimized = useCallback(
    debounceWithImmediate(
      // This runs after debounce period - typing stopped
      async () => {
        if (!conversationId || connectionState !== 'connected') return;
        await updateTypingStatus(conversationId, options.userId, false);
      },
      // This runs immediately - typing started
      async () => {
        if (!conversationId || connectionState !== 'connected') return;
        await updateTypingStatus(conversationId, options.userId, true);
      },
      1000 // 1 second debounce
    ),
    [conversationId, connectionState, options.userId]
  );
  
  // Handle typing indicator
  const handleTyping = useCallback(() => {
    updateTypingStatusOptimized({});
  }, [updateTypingStatusOptimized]);
  
  return {
    typingUsers,
    handleTyping
  };
};

export default useTypingIndicator;
