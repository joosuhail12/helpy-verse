
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

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
    // Define reducer functions as needed
  },
  extraReducers: (builder) => {
    // Add extra reducers as needed
  },
});

// Export actions and reducer
export const inboxActions = inboxSlice.actions;

// Selectors
export const selectTickets = (state: RootState) => state.inbox.tickets;
export const selectSelectedTicket = (state: RootState) => state.inbox.selectedTicket;
export const selectInboxLoading = (state: RootState) => state.inbox.loading;
export const selectInboxError = (state: RootState) => state.inbox.error;

export default inboxSlice.reducer;
