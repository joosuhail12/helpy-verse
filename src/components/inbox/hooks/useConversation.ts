
import { useMessages } from './useMessages';
import { useTypingIndicator } from './useTypingIndicator';
import { usePresence } from './usePresence';
import type { Ticket } from '@/types/ticket';

export const useConversation = (ticket: Ticket) => {
  const {
    messages,
    setMessages,
    newMessage,
    setNewMessage,
    isSending,
    isInternalNote,
    setIsInternalNote,
    handleSendMessage,
    initializeMessages
  } = useMessages(ticket);

  const { handleTyping } = useTypingIndicator(ticket);
  const { typingUsers, activeUsers, isLoading, error } = usePresence(ticket, setMessages);

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
