
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { ticketService } from '@/services/ticketService';
import type { Ticket } from '@/types/ticket';

export const useTicketData = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch tickets
  const { data: tickets, isLoading: isLoadingTickets, error } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => ticketService.getTickets(),
  });

  // Create ticket
  const createTicketMutation = useMutation({
    mutationFn: (ticketData: Omit<Ticket, 'id'>) => {
      return ticketService.createTicket(ticketData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast({
        title: "Success",
        description: "Ticket created successfully",
      });
    },
    onError: (error) => {
      console.error('Error creating ticket:', error);
      toast({
        title: "Error",
        description: "Failed to create ticket. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Update ticket
  const updateTicketMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Ticket> }) => {
      return ticketService.updateTicket(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast({
        title: "Success",
        description: "Ticket updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating ticket:', error);
      toast({
        title: "Error",
        description: "Failed to update ticket. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Delete ticket
  const deleteTicketMutation = useMutation({
    mutationFn: (id: string) => {
      return ticketService.deleteTicket(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast({
        title: "Success",
        description: "Ticket deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Error deleting ticket:', error);
      toast({
        title: "Error",
        description: "Failed to delete ticket. Please try again.",
        variant: "destructive",
      });
    }
  });

  const createTicket = useCallback(async (ticketData: Omit<Ticket, 'id'>) => {
    setIsLoading(true);
    try {
      await createTicketMutation.mutateAsync(ticketData);
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [createTicketMutation]);

  const updateTicket = useCallback(async (id: string, data: Partial<Ticket>) => {
    setIsLoading(true);
    try {
      await updateTicketMutation.mutateAsync({ id, data });
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [updateTicketMutation]);

  const deleteTicket = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      await deleteTicketMutation.mutateAsync(id);
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [deleteTicketMutation]);

  return {
    tickets,
    isLoading: isLoading || isLoadingTickets,
    error,
    createTicket,
    updateTicket,
    deleteTicket
  };
};
