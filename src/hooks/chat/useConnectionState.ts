
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  initializeAblyConnection,
  setConnectionState,
  setCurrentConversation,
  markConversationAsRead
} from '@/store/slices/chat/chatSlice';
import { selectConnectionState } from '@/store/slices/chat/selectors';
import { useAppDispatch } from '@/hooks/useAppDispatch';

/**
 * Hook for managing Ably connection state
 */
export const useConnectionState = (conversationId: string | null) => {
  const dispatch = useAppDispatch();
  const connectionState = useSelector(selectConnectionState);
  
  // Initialize Ably connection
  useEffect(() => {
    dispatch(initializeAblyConnection())
      .unwrap()
      .then(() => console.log('Ably connection initialized'))
      .catch((error) => console.error('Failed to initialize Ably:', error));
  }, [dispatch]);
  
  // Set current conversation in Redux
  useEffect(() => {
    if (conversationId) {
      dispatch(setCurrentConversation(conversationId));
      dispatch(markConversationAsRead(conversationId));
    }
  }, [dispatch, conversationId]);
  
  return {
    connectionState
  };
};

export default useConnectionState;
