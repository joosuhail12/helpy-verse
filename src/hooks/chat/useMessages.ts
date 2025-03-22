
import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchConversationMessages,
  addMessage,
  sendChatMessage
} from '@/store/slices/chat/chatSlice';
import {
  selectConversationMessages,
  selectConversationLoading,
  selectHasMoreMessages,
  selectTotalMessages
} from '@/store/slices/chat/selectors';
import { Message } from '@/components/chat-widget/components/conversation/types';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { formatTimestamp } from '@/utils/dateUtils';

/**
 * Hook for managing chat messages with pagination
 */
export const useMessages = (conversationId: string | null) => {
  const dispatch = useAppDispatch();
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  
  // Get messages from Redux
  const messages = useSelector(conversationId 
    ? (state) => selectConversationMessages(state, conversationId) 
    : () => [] as Message[]);
  const loading = useSelector(conversationId 
    ? (state) => selectConversationLoading(state, conversationId) 
    : () => false);
  const hasMoreMessages = useSelector(conversationId 
    ? (state) => selectHasMoreMessages(state, conversationId) 
    : () => false);
  const totalMessages = useSelector(conversationId 
    ? (state) => selectTotalMessages(state, conversationId) 
    : () => 0);

  // Load more messages (pagination)
  const loadMoreMessages = useCallback(() => {
    if (!conversationId || !hasMoreMessages || loading) return;
    
    const currentPage = Math.ceil(messages.length / 20) + 1;
    dispatch(fetchConversationMessages({ 
      conversationId, 
      page: currentPage, 
      limit: 20 
    }));
  }, [dispatch, conversationId, hasMoreMessages, loading, messages.length]);

  // Handle sending a new message
  const handleSendMessage = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!conversationId || !newMessage.trim()) return;
    
    const messageToSend = newMessage;
    setNewMessage('');
    setSending(true);
    
    try {
      await dispatch(sendChatMessage({
        conversationId,
        text: messageToSend,
        userId: 'userId' // This will be passed from the parent component
      })).unwrap();
    } catch (error) {
      console.error('Error sending message:', error);
      // Restore message on failure
      setNewMessage(messageToSend);
    } finally {
      setSending(false);
    }
  }, [dispatch, conversationId, newMessage]);

  // Initial message loading is handled by the parent component

  return {
    messages,
    newMessage,
    setNewMessage,
    loading,
    sending,
    handleSendMessage,
    loadMoreMessages,
    hasMoreMessages,
    totalMessages,
    formatTimestamp
  };
};

export default useMessages;
