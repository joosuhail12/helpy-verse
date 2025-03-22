
import { useEffect, useRef } from 'react';
import { subscribeToConversation } from '@/utils/ably';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { addMessage } from '@/store/slices/chat/chatSlice';

/**
 * Hook for subscribing to real-time message updates
 */
export const useMessageSubscription = (
  conversationId: string | null, 
  connectionState: string
) => {
  const dispatch = useAppDispatch();
  const subscriptionRef = useRef<(() => void) | null>(null);
  
  // Subscribe to real-time messages
  useEffect(() => {
    if (!conversationId || connectionState !== 'connected') return;
    
    // Clean up previous subscription if any
    if (subscriptionRef.current) {
      subscriptionRef.current();
    }
    
    console.log(`Subscribing to messages in conversation: ${conversationId}`);
    
    // Set up new subscription
    const setupSubscription = async () => {
      const cleanup = await subscribeToConversation(conversationId, (chatMessage) => {
        dispatch(addMessage({
          conversationId,
          message: {
            id: chatMessage.id,
            text: chatMessage.text,
            sender: chatMessage.sender.type === 'agent' ? 'agent' : 'user',
            timestamp: chatMessage.timestamp
          }
        }));
      });
      
      subscriptionRef.current = cleanup;
    };
    
    setupSubscription();
    
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current();
        subscriptionRef.current = null;
      }
    };
  }, [dispatch, conversationId, connectionState]);
};

export default useMessageSubscription;
