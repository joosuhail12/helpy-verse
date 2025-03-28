
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define inbox state type
interface InboxState {
  tickets: any[];
  selectedTicket: any | null;
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
    setTickets: (state, action: PayloadAction<any[]>) => {
      state.tickets = action.payload;
    },
    setSelectedTicket: (state, action: PayloadAction<any>) => {
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

// Export actions
export const { setTickets, setSelectedTicket, setLoading, setError } = inboxSlice.actions;

export default inboxSlice.reducer;
