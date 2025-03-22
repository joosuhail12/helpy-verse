
import { useEffect, useRef } from 'react';
import { subscribeToTicket } from '@/utils/ably/messaging/realTimeMessaging';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for subscribing to ticket updates
 */
export const useTicketSubscription = (
  ticketId: string | null, 
  connectionState: string,
  onTicketUpdate?: (ticket: any) => void
) => {
  const { toast } = useToast();
  const subscriptionRef = useRef<(() => void) | null>(null);
  
  // Subscribe to ticket updates
  useEffect(() => {
    if (!ticketId || connectionState !== 'connected') return;
    
    // Clean up previous subscription if any
    if (subscriptionRef.current) {
      subscriptionRef.current();
    }
    
    console.log(`Subscribing to ticket updates: ${ticketId}`);
    
    // Set up new subscription
    const setupSubscription = async () => {
      try {
        const unsubscribe = await subscribeToTicket(ticketId, (data) => {
          // Show toast notification
          toast({
            title: "Ticket Updated",
            description: `Ticket ${ticketId} has been updated`,
          });
          
          // Call callback if provided
          if (onTicketUpdate) {
            onTicketUpdate(data);
          }
        });
        
        // Store unsubscribe function
        subscriptionRef.current = unsubscribe;
        
        return unsubscribe;
      } catch (error) {
        console.error(`Error subscribing to ticket ${ticketId}:`, error);
        return () => {};
      }
    };
    
    // Setup the subscription and store the promise
    const subscriptionPromise = setupSubscription();
    
    return () => {
      // Handle cleanup when component unmounts
      if (subscriptionRef.current) {
        subscriptionRef.current();
        subscriptionRef.current = null;
      } else {
        // Handle the case where the subscription promise hasn't resolved yet
        subscriptionPromise.then(unsubscribe => {
          if (unsubscribe) {
            unsubscribe();
          }
        }).catch(err => {
          console.error('Error during unsubscribe:', err);
        });
      }
    };
  }, [ticketId, connectionState, onTicketUpdate, toast]);
};

export default useTicketSubscription;
