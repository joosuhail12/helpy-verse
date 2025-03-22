
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchConversationMessages } from '@/store/slices/chat/chatSlice';
import { useAppDispatch } from '@/hooks/useAppDispatch';

/**
 * Hook for fetching initial conversation messages
 */
export const useRealtimeMessages = (
  conversationId: string | null, 
  connectionState: string
) => {
  const dispatch = useAppDispatch();
  
  // Fetch initial messages when conversation changes
  useEffect(() => {
    if (conversationId && connectionState === 'connected') {
      dispatch(fetchConversationMessages({ 
        conversationId, 
        page: 1, 
        limit: 20 
      }));
    }
  }, [dispatch, conversationId, connectionState]);
};

export default useRealtimeMessages;
