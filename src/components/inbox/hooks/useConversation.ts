import { useAblyRoom } from './useAblyRoom';
import type { Ticket } from '@/types/ticket';

export const useConversation = (ticket: Ticket) => {
  console.log("useConversation hook initialized");

  const {
    messages,
    newMessage,
    setNewMessage,
    typingUsers,
    activeUsers,
    handleSendMessage: originalHandleSendMessage,
    handleTyping,
    isLoading,
    isSending,
    error,
    isInternalNote,
    setIsInternalNote
  } = useAblyRoom(ticket);

  // Wrap the handleSendMessage function with additional logging
  const handleSendMessage = async () => {
    console.log("handleSendMessage wrapper in useConversation called");
    console.log("Current message:", newMessage);

    try {
      await originalHandleSendMessage();
    } catch (error) {
      console.error("Error in useConversation.handleSendMessage:", error);
    }
  };

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
