
import { useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { getAblyChannel } from '@/utils/ably';
import type { Ticket } from '@/types/ticket';

export const useRealtimeTickets = (updateTicket: (ticket: Ticket) => void) => {
  const { toast } = useToast();

  useEffect(() => {
    let channel: any;
    let isSubscribed = true;

    const setupRealtime = async () => {
      try {
        // Get the Ably channel
        channel = await getAblyChannel('tickets');
        if (!channel || !isSubscribed) return;
        
        // Subscribe to ticket updates
        channel.subscribe('ticket:update', (message: any) => {
          if (!isSubscribed) return;
          const updatedTicket = message.data;
          updateTicket(updatedTicket);
          
          toast({
            title: "Ticket Updated",
            description: `Ticket ${updatedTicket.id} has been updated.`,
          });
        });

        // Subscribe to new tickets
        channel.subscribe('ticket:new', (message: any) => {
          if (!isSubscribed) return;
          const newTicket = message.data;
          toast({
            title: "New Ticket",
            description: `New ticket created: ${newTicket.subject}`,
          });
        });

      } catch (error) {
        if (!isSubscribed) return;
        console.error('Error setting up realtime:', error);
        toast({
          title: "Connection Error",
          description: "Failed to connect to real-time updates",
          variant: "destructive",
        });
      }
    };

    setupRealtime();

    // Cleanup subscription on unmount
    return () => {
      isSubscribed = false;
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, [toast, updateTicket]);
};
