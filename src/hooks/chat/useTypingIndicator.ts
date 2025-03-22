
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
      const cleanup = await monitorTypingIndicators(conversationId, (users) => {
        setTypingUsers(users);
      });
      
      typingMonitorRef.current = cleanup;
    };
    
    setupMonitor();
    
    return () => {
      if (typingMonitorRef.current) {
        typingMonitorRef.current();
        typingMonitorRef.current = null;
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
