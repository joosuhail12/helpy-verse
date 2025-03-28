
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { StandardEntityState } from '../../utils/createSliceReducers';
import { createStandardSelectors } from '../../utils/standardSelectors';

// Define ticket type
export interface Ticket {
  id: string;
  subject: string;
  status: 'open' | 'closed' | 'pending';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  customerId: string;
  assigneeId?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  [key: string]: any;
}

// Define tickets state
export interface TicketsState extends StandardEntityState<Ticket> {
  filters: {
    status?: string | null;
    priority?: string | null;
    assigneeId?: string | null;
    search?: string;
  };
  sort: {
    field: keyof Ticket;
    direction: 'asc' | 'desc';
  };
  selectedIds: string[];
}

// Initial state
const initialState: TicketsState = {
  items: [],
  loading: false,
  error: null,
  selected: null,
  filters: {
    status: null,
    priority: null,
    assigneeId: null,
    search: '',
  },
  sort: {
    field: 'lastMessageTime',
    direction: 'desc',
  },
  selectedIds: [],
};

// Create tickets slice
const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    setTickets: (state, action: PayloadAction<Ticket[]>) => {
      state.items = action.payload;
    },
    setSelectedTicket: (state, action: PayloadAction<Ticket | null>) => {
      state.selected = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFilter: (state, action: PayloadAction<{ key: keyof TicketsState['filters']; value: string | null }>) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
    },
    setSortField: (state, action: PayloadAction<keyof Ticket>) => {
      if (state.sort.field === action.payload) {
        state.sort.direction = state.sort.direction === 'asc' ? 'desc' : 'asc';
      } else {
        state.sort.field = action.payload;
        state.sort.direction = 'asc';
      }
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    selectTicket: (state, action: PayloadAction<string>) => {
      const ticket = state.items.find(t => t.id === action.payload);
      state.selected = ticket || null;
    },
    toggleSelectTicket: (state, action: PayloadAction<string>) => {
      const ticketId = action.payload;
      if (state.selectedIds.includes(ticketId)) {
        state.selectedIds = state.selectedIds.filter(id => id !== ticketId);
      } else {
        state.selectedIds.push(ticketId);
      }
    },
    clearSelectedTickets: (state) => {
      state.selectedIds = [];
    },
  },
});

// Export actions and reducer
export const {
  setTickets,
  setSelectedTicket,
  setLoading,
  setError,
  setFilter,
  setSortField,
  resetFilters,
  selectTicket,
  toggleSelectTicket,
  clearSelectedTickets,
} = ticketsSlice.actions;

// Create and export selectors
const baseSelectors = createStandardSelectors<TicketsState>('tickets');

export const selectTickets = (state: RootState) => state.tickets.items;
export const selectSelectedTicket = (state: RootState) => state.tickets.selected;
export const selectTicketsLoading = baseSelectors.selectLoading;
export const selectTicketsError = baseSelectors.selectError;
export const selectTicketsFilters = (state: RootState) => state.tickets.filters;
export const selectTicketsSort = (state: RootState) => state.tickets.sort;
export const selectSelectedTicketIds = (state: RootState) => state.tickets.selectedIds;

export default ticketsSlice.reducer;
