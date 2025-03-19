
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Ticket } from '@/types/ticket';

interface TicketsState {
  tickets: Ticket[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TicketsState = {
  tickets: [],
  isLoading: false,
  error: null,
};

export const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    setTickets: (state, action: PayloadAction<Ticket[]>) => {
      state.tickets = action.payload;
    },
    addTicket: (state, action: PayloadAction<Ticket>) => {
      state.tickets = [action.payload, ...state.tickets];
    },
    updateTicket: (state, action: PayloadAction<Ticket>) => {
      state.tickets = state.tickets.map(ticket => 
        ticket.id === action.payload.id ? action.payload : ticket
      );
    },
    deleteTicket: (state, action: PayloadAction<string>) => {
      state.tickets = state.tickets.filter(ticket => ticket.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    markAsRead: (state, action: PayloadAction<string[]>) => {
      state.tickets = state.tickets.map(ticket =>
        action.payload.includes(ticket.id) ? { ...ticket, isUnread: false } : ticket
      );
    },
    markAsUnread: (state, action: PayloadAction<string[]>) => {
      state.tickets = state.tickets.map(ticket =>
        action.payload.includes(ticket.id) ? { ...ticket, isUnread: true } : ticket
      );
    },
  },
});

export const { 
  setTickets, 
  addTicket, 
  updateTicket, 
  deleteTicket, 
  setLoading, 
  setError,
  markAsRead,
  markAsUnread,
} = ticketsSlice.actions;

export default ticketsSlice.reducer;
