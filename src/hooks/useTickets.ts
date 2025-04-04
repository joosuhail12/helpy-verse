
import { useEffect } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { 
  selectTickets, 
  selectSelectedTicket, 
  selectTicketsLoading, 
  selectTicketsError,
  selectTicket
} from '@/store/slices/tickets/ticketsSlice';
import { 
  fetchTickets, 
  fetchTicketById,
  createTicket,
  updateTicket,
  deleteTicket
} from '@/store/slices/tickets/ticketsActions';
import { Ticket } from '@/store/slices/tickets/ticketsSlice';

export const useTickets = () => {
  const dispatch = useAppDispatch();
  const tickets = useAppSelector(selectTickets);
  const selectedTicket = useAppSelector(selectSelectedTicket);
  const loading = useAppSelector(selectTicketsLoading);
  const error = useAppSelector(selectTicketsError);

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  const getTicketById = async (id: string) => {
    try {
      await dispatch(fetchTicketById(id)).unwrap();
    } catch (error) {
      console.error('Failed to fetch ticket:', error);
    }
  };

  const selectTicketById = (id: string) => {
    dispatch(selectTicket(id));
  };

  const addTicket = async (ticket: Partial<Ticket>) => {
    try {
      await dispatch(createTicket(ticket)).unwrap();
    } catch (error) {
      console.error('Failed to create ticket:', error);
    }
  };

  const editTicket = async (id: string, data: Partial<Ticket>) => {
    try {
      await dispatch(updateTicket({ id, data })).unwrap();
    } catch (error) {
      console.error('Failed to update ticket:', error);
    }
  };

  const removeTicket = async (id: string) => {
    try {
      await dispatch(deleteTicket(id)).unwrap();
    } catch (error) {
      console.error('Failed to delete ticket:', error);
    }
  };

  return {
    tickets,
    selectedTicket,
    loading,
    error,
    getTicketById,
    selectTicketById,
    addTicket,
    editTicket,
    removeTicket,
  };
};
