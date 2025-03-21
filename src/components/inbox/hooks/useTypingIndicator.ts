
import { useCallback } from 'react';
import { getAblyChannel } from '@/utils/ably';
import debounce from 'lodash/debounce';
import type { Ticket } from '@/types/ticket';

export const useTypingIndicator = (ticket: Ticket) => {
  const debouncedStopTyping = useCallback(
    debounce(async (channel) => {
      try {
        await channel.presence.update({ isTyping: false });
      } catch (error) {
        console.error('Error updating typing status:', error);
      }
    }, 1000),
    []
  );

  const handleTyping = async () => {
    try {
      const channel = await getAblyChannel(`ticket:${ticket.id}`);
      await channel.presence.update({ 
        isTyping: true,
        name: 'Agent',
        userId: 'Agent',
        lastActive: new Date().toISOString(),
        location: {
          ticketId: ticket.id,
          area: 'conversation'
        }
      });
      debouncedStopTyping(channel);
    } catch (error) {
      console.error('Error updating typing status:', error);
    }
  };

  return { handleTyping };
};
