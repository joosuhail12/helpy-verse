
import { useState } from 'react';
import useConnectionState from './chat/useConnectionState';
import useMessages from './chat/useMessages';
import useTypingIndicator from './chat/useTypingIndicator';
import useMessageSubscription from './chat/useMessageSubscription';
import useRealtimeMessages from './chat/useRealtimeMessages';
import { formatTimestamp } from '@/utils/dateUtils';

interface UseRealtimeChatOptions {
  userId: string;
  userName: string;
}

/**
 * Hook for real-time chat functionality with optimized performance
 */
export const useRealtimeChat = (conversationId: string | null, options: UseRealtimeChatOptions) => {
  // Get connection state
  const { connectionState } = useConnectionState(conversationId);
  
  // Subscribe to messages
  useMessageSubscription(conversationId, connectionState);
  
  // Fetch initial messages
  useRealtimeMessages(conversationId, connectionState);
  
  // Typing indicator state and handlers
  const { typingUsers, handleTyping } = useTypingIndicator(
    conversationId, 
    connectionState, 
    options
  );
  
  // Message state and handlers
  const { 
    messages,
    newMessage,
    setNewMessage,
    loading,
    sending,
    handleSendMessage,
    loadMoreMessages,
    hasMoreMessages,
    totalMessages
  } = useMessages(conversationId);
  
  // Prepare send message handler with user ID
  const sendMessageWithUser = async (e?: React.FormEvent) => {
    // Clear typing status after sending
    const sendResult = await handleSendMessage(e);
    if (conversationId && connectionState === 'connected') {
      try {
        const { updateTypingStatus } = await import('@/utils/ably');
        await updateTypingStatus(conversationId, options.userId, options.userName, false);
      } catch (error) {
        console.error('Error updating typing status:', error);
      }
    }
    return sendResult;
  };
  
  return {
    messages,
    newMessage,
    setNewMessage,
    loading,
    sending,
    typingUsers,
    connectionState,
    handleSendMessage: sendMessageWithUser,
    handleTyping,
    loadMoreMessages,
    hasMoreMessages,
    totalMessages,
    formatTimestamp
  };
};

export default useRealtimeChat;
