import { useAblyRoom } from './useAblyRoom';
import type { Ticket } from '@/types/ticket';

export const useConversation = (ticket: Ticket) => {
  const {
    messages,
    newMessage,
    setNewMessage,
    typingUsers,
    activeUsers,
    handleSendMessage,
    handleTyping,
    isLoading,
    isSending,
    error,
    isInternalNote,
    setIsInternalNote
  } = useAblyRoom(ticket);

  return {
    messages,
    newMessage,
    setNewMessage,
    typingUsers,
    activeUsers,
    handleSendMessage,
    handleTyping,
    isLoading,
    isSending,
    error,
    isInternalNote,
    setIsInternalNote
  };
};
