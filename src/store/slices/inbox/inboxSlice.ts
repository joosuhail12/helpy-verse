
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define ticket type
export interface Ticket {
  id: string;
  subject: string;
  customer: string;
  company: string;
  status: string;
  priority: string;
  lastMessage: string;
  lastMessageDate: string;
  assignee?: string;
  unread?: boolean;
  [key: string]: any;
}

// Define normalized inbox state type
interface InboxState {
  entities: Record<string, Ticket>;
  ids: string[];
  selectedTicketId: string | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: InboxState = {
  entities: {},
  ids: [],
  selectedTicketId: null,
  loading: false,
  error: null,
};

// Create the inbox slice
const inboxSlice = createSlice({
  name: 'inbox',
  initialState,
  reducers: {
    setTickets: (state, action: PayloadAction<Ticket[]>) => {
      state.entities = {};
      state.ids = [];
      
      action.payload.forEach(ticket => {
        state.entities[ticket.id] = ticket;
        state.ids.push(ticket.id);
      });
    },
    addTicket: (state, action: PayloadAction<Ticket>) => {
      const ticket = action.payload;
      state.entities[ticket.id] = ticket;
      if (!state.ids.includes(ticket.id)) {
        state.ids.push(ticket.id);
      }
    },
    updateTicket: (state, action: PayloadAction<{ id: string; changes: Partial<Ticket> }>) => {
      const { id, changes } = action.payload;
      if (state.entities[id]) {
        state.entities[id] = { ...state.entities[id], ...changes };
      }
    },
    removeTicket: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      delete state.entities[id];
      state.ids = state.ids.filter(ticketId => ticketId !== id);
      
      // Clear selection if removed ticket was selected
      if (state.selectedTicketId === id) {
        state.selectedTicketId = null;
      }
    },
    setSelectedTicket: (state, action: PayloadAction<string | null>) => {
      state.selectedTicketId = action.payload;
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
export const { 
  setTickets, 
  addTicket, 
  updateTicket, 
  removeTicket, 
  setSelectedTicket, 
  setLoading, 
  setError 
} = inboxSlice.actions;

export default inboxSlice.reducer;
