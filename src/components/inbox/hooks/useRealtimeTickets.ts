
import { useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { subscribeToChannel } from '@/utils/ably';
import type { Ticket } from '@/types/ticket';

export const useRealtimeTickets = (updateTicket: (ticket: Ticket) => void) => {
  const { toast } = useToast();

  useEffect(() => {
    let unsubscribe: () => void;

    const setupRealtime = async () => {
      try {
        // Subscribe to ticket updates
        unsubscribe = await subscribeToChannel(
          'tickets', // Main channel for all tickets
          'ticket:update',
          (message) => {
            const updatedTicket = message.data;
            updateTicket(updatedTicket);
            
            toast({
              title: "Ticket Updated",
              description: `Ticket ${updatedTicket.id} has been updated.`,
            });
          }
        );

        // Also subscribe to new tickets
        const newTicketUnsub = await subscribeToChannel(
          'tickets',
          'ticket:new',
          (message) => {
            const newTicket = message.data;
            
            toast({
              title: "New Ticket",
              description: `New ticket created: ${newTicket.subject}`,
            });
          }
        );

        // Return combined cleanup function
        const originalUnsubscribe = unsubscribe;
        unsubscribe = () => {
          originalUnsubscribe();
          newTicketUnsub();
        };
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
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [toast, updateTicket]);
};

export default useRealtimeTickets;
