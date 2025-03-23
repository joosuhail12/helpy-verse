
import { useCallback } from 'react';
import { updateTypingStatus } from '@/utils/ably';
import type { Ticket } from '@/types/ticket';

export const useTypingIndicator = (ticket: Ticket) => {
  const handleTyping = useCallback(async () => {
    try {
      await updateTypingStatus(`ticket:${ticket.id}`, 'Agent', true);
      
      // After a delay, update to show they've stopped typing
      setTimeout(async () => {
        await updateTypingStatus(`ticket:${ticket.id}`, 'Agent', false);
      }, 2000);
    } catch (error) {
      console.error('Error updating typing indicator:', error);
    }
  }, [ticket.id]);

  return { handleTyping };
};
