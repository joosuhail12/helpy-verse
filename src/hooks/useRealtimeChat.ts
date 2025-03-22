
import { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  initializeAblyConnection,
  fetchConversationMessages,
  sendChatMessage,
  setConnectionState,
  setCurrentConversation,
  addMessage,
  markConversationAsRead
} from '@/store/slices/chat/chatSlice';
import {
  selectConnectionState,
  selectConversationMessages,
  selectConversationLoading,
  selectHasMoreMessages,
  selectTotalMessages
} from '@/store/slices/chat/selectors';
import { 
  subscribeToConversation, 
  monitorTypingIndicators, 
  updateTypingStatus 
} from '@/utils/ably';
import { Message } from '@/components/chat-widget/components/conversation/types';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { formatTimestamp } from '@/utils/dateUtils';
import { debounceWithImmediate } from '@/utils/performance/performanceUtils';

interface UseRealtimeChatOptions {
  userId: string;
  userName: string;
}

/**
 * Hook for real-time chat functionality with optimized performance
 */
export const useRealtimeChat = (conversationId: string | null, options: UseRealtimeChatOptions) => {
  const dispatch = useAppDispatch();
  const [newMessage, setNewMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  
  // Use references to keep track of cleanup functions
  const subscriptionRef = useRef<() => void | null>(() => null);
  const typingMonitorRef = useRef<() => void | null>(() => null);
  
  // Get state from Redux
  const connectionState = useSelector(selectConnectionState);
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
  
  // Fetch initial messages when conversation changes
  useEffect(() => {
    if (conversationId && connectionState === 'connected') {
      dispatch(fetchConversationMessages({ conversationId, page: 1, limit: 20 }));
    }
  }, [dispatch, conversationId, connectionState]);
  
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
  
  // Monitor typing indicators
  useEffect(() => {
    if (!conversationId || connectionState !== 'connected') return;
    
    // Clean up previous monitor if any
    if (typingMonitorRef.current) {
      typingMonitorRef.current();
    }
    
    console.log(`Monitoring typing indicators in conversation: ${conversationId}`);
    
    // Set up new monitor
    typingMonitorRef.current = monitorTypingIndicators(conversationId, (users) => {
      setTypingUsers(users);
    });
    
    return () => {
      if (typingMonitorRef.current) {
        typingMonitorRef.current();
      }
    };
  }, [conversationId, connectionState]);
  
  // Handle sending a message
  const handleSendMessage = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!conversationId || !newMessage.trim() || connectionState !== 'connected') return;
    
    const messageToSend = newMessage;
    setNewMessage('');
    setSending(true);
    
    try {
      await dispatch(sendChatMessage({
        conversationId,
        text: messageToSend,
        userId: options.userId
      })).unwrap();
      
      // Clear typing status after sending
      await updateTypingStatus(conversationId, options.userId, options.userName, false);
    } catch (error) {
      console.error('Error sending message:', error);
      // Restore message on failure
      setNewMessage(messageToSend);
    } finally {
      setSending(false);
    }
  }, [dispatch, conversationId, newMessage, connectionState, options.userId, options.userName]);
  
  // Create optimized typing status updater
  const updateTypingStatusOptimized = useCallback(
    debounceWithImmediate(
      // This runs after debounce period - typing stopped
      async () => {
        if (!conversationId || connectionState !== 'connected') return;
        await updateTypingStatus(conversationId, options.userId, options.userName, false);
      },
      // This runs immediately - typing started
      async () => {
        if (!conversationId || connectionState !== 'connected') return;
        await updateTypingStatus(conversationId, options.userId, options.userName, true);
      },
      1000 // 1 second debounce
    ),
    [conversationId, connectionState, options.userId, options.userName]
  );
  
  // Handle typing indicator
  const handleTyping = useCallback(() => {
    updateTypingStatusOptimized({});
  }, [updateTypingStatusOptimized]);
  
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
  
  return {
    messages,
    newMessage,
    setNewMessage,
    loading,
    sending,
    typingUsers,
    connectionState,
    handleSendMessage,
    handleTyping,
    loadMoreMessages,
    hasMoreMessages,
    totalMessages,
    formatTimestamp
  };
};

export default useRealtimeChat;
