
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Ticket } from '@/types/ticket';

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
    setSelectedTicket: (state, action: PayloadAction<Ticket>) => {
      state.selectedTicket = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

// Export actions and reducer
export const { setTickets, setSelectedTicket, setLoading, setError } = inboxSlice.actions;

// Selectors
export const selectTickets = (state: RootState) => state.inbox?.tickets ?? [];
export const selectSelectedTicket = (state: RootState) => state.inbox?.selectedTicket ?? null;
export const selectInboxLoading = (state: RootState) => state.inbox?.loading ?? false;
export const selectInboxError = (state: RootState) => state.inbox?.error ?? null;

export default inboxSlice.reducer;
