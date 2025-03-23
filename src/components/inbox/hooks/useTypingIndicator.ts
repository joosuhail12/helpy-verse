
import { useCallback } from 'react';
import { getAblyChannel } from '@/utils/ably';
import type { Ticket } from '@/types/ticket';

export const useTypingIndicator = (ticket: Ticket) => {
  const handleTyping = useCallback(async () => {
    try {
      const channel = await getAblyChannel(`ticket:${ticket.id}`);
      
      // When the user is typing, publish an update to the presence
      await channel.presence.enter({
        userId: 'Agent',
        name: 'Agent',
        isTyping: true,
        location: {
          ticketId: ticket.id,
          area: 'conversation'
        }
      });
      
      // After a delay, update to show they've stopped typing
      setTimeout(async () => {
        await channel.presence.enter({
          userId: 'Agent',
          name: 'Agent',
          isTyping: false,
          location: {
            ticketId: ticket.id,
            area: 'conversation'
          }
        });
      }, 2000);
    } catch (error) {
      console.error('Error updating typing indicator:', error);
    }
  }, [ticket.id]);

  return { handleTyping };
};
