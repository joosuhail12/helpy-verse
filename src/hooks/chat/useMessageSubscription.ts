
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addMessage } from '@/store/slices/chat/chatSlice';
import { subscribeToConversation } from '@/utils/ably';
import { useAppDispatch } from '@/hooks/useAppDispatch';

/**
 * Hook for subscribing to real-time message updates
 */
export const useMessageSubscription = (
  conversationId: string | null, 
  connectionState: string
) => {
  const dispatch = useAppDispatch();
  const subscriptionRef = useRef<() => void | null>(() => null);
  
  // Subscribe to real-time messages
  useEffect(() => {
    if (!conversationId || connectionState !== 'connected') return;
    
    // Clean up previous subscription if any
    if (subscriptionRef.current) {
      subscriptionRef.current();
    }
    
    console.log(`Subscribing to messages in conversation: ${conversationId}`);
    
    // Set up new subscription
    subscriptionRef.current = subscribeToConversation(conversationId, (chatMessage) => {
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
    
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current();
      }
    };
  }, [dispatch, conversationId, connectionState]);
};

export default useMessageSubscription;
