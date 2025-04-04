
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { Ticket } from '@/types/ticket';
import { fetchTickets } from './inboxActions';

// Define inbox state type
interface InboxState {
  tickets: Ticket[];
  selectedTicket: Ticket | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: InboxState = {
  tickets: [],
  selectedTicket: null,
  loading: false,
  error: null,
};

// Create the inbox slice
const inboxSlice = createSlice({
  name: 'inbox',
  initialState,
  reducers: {
    setTickets: (state, action: PayloadAction<Ticket[]>) => {
      state.tickets = action.payload;
    },
    setSelectedTicket: (state, action: PayloadAction<Ticket | null>) => {
      state.selectedTicket = action.payload;
    },
    clearSelectedTicket: (state) => {
      state.selectedTicket = null;
    },
    addTicket: (state, action: PayloadAction<Ticket>) => {
      state.tickets = [action.payload, ...state.tickets];
    },
    updateTicket: (state, action: PayloadAction<Ticket>) => {
      const index = state.tickets.findIndex(ticket => ticket.id === action.payload.id);
      if (index !== -1) {
        state.tickets[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.tickets = action.payload;
        state.loading = false;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tickets';
      });
  },
});

// Export actions and reducer
export const { setTickets, setSelectedTicket, clearSelectedTicket, addTicket, updateTicket } = inboxSlice.actions;

// Selectors
export const selectTickets = (state: RootState) => state.inbox.tickets;
export const selectSelectedTicket = (state: RootState) => state.inbox.selectedTicket;
export const selectInboxLoading = (state: RootState) => state.inbox.loading;
export const selectInboxError = (state: RootState) => state.inbox.error;

export default inboxSlice.reducer;
