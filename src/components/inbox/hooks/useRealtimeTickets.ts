
import { useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { getAblyChannel } from '@/utils/ably';
import type { Ticket } from '@/types/ticket';

export const useRealtimeTickets = (updateTicket: (ticket: Ticket) => void) => {
  const { toast } = useToast();

  useEffect(() => {
    let channel: any;

    const setupRealtime = async () => {
      try {
        channel = await getAblyChannel('tickets');
        
        channel.subscribe('ticket:update', (message: any) => {
          const updatedTicket = message.data;
          updateTicket(updatedTicket);
          
          toast({
            title: "Ticket Updated",
            description: `Ticket ${updatedTicket.id} has been updated.`,
          });
        });

        channel.subscribe('ticket:new', (message: any) => {
          const newTicket = message.data;
          toast({
            title: "New Ticket",
            description: `New ticket created: ${newTicket.subject}`,
          });
        });

      } catch (error) {
        console.error('Error setting up realtime:', error);
        toast({
          title: "Connection Error",
          description: "Failed to connect to real-time updates",
          variant: "destructive",
        });
      }
    };

    setupRealtime();

    return () => {
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, [toast, updateTicket]);
};
