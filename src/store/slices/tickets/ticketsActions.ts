
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Ticket } from './ticketsSlice';
import { RootState } from '../../store';

// This would be connected to your actual API service
const ticketService = {
  fetchTickets: async () => {
    // Replace with actual API call
    return { data: [] };
  },
  
  getTicketById: async (id: string) => {
    // Replace with actual API call
    return { data: { id } };
  },
  
  createTicket: async (data: Partial<Ticket>) => {
    // Replace with actual API call
    return { data };
  },
  
  updateTicket: async (id: string, data: Partial<Ticket>) => {
    // Replace with actual API call
    return { data: { ...data, id } };
  },
  
  deleteTicket: async (id: string) => {
    // Replace with actual API call
    return { data: id };
  }
};

// Cache duration in milliseconds (5 minutes)
export const CACHE_DURATION = 5 * 60 * 1000;

export const fetchTickets = createAsyncThunk(
  'tickets/fetchTickets',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { lastFetchTime } = state.tickets;
      
      if (lastFetchTime && Date.now() - lastFetchTime < CACHE_DURATION) {
        console.log('Using cached tickets data');
        return null;
      }
      
      const response = await ticketService.fetchTickets();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch tickets');
    }
  }
);

export const fetchTicketById = createAsyncThunk(
  'tickets/fetchTicketById',
  async (ticketId: string, { rejectWithValue }) => {
    try {
      const response = await ticketService.getTicketById(ticketId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch ticket details');
    }
  }
);

export const createTicket = createAsyncThunk(
  'tickets/createTicket',
  async (ticketData: Partial<Ticket>, { rejectWithValue }) => {
    try {
      const response = await ticketService.createTicket(ticketData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create ticket');
    }
  }
);

export const updateTicket = createAsyncThunk(
  'tickets/updateTicket',
  async ({ id, data }: { id: string; data: Partial<Ticket> }, { rejectWithValue }) => {
    try {
      const response = await ticketService.updateTicket(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update ticket');
    }
  }
);

export const deleteTicket = createAsyncThunk(
  'tickets/deleteTicket',
  async (id: string, { rejectWithValue }) => {
    try {
      await ticketService.deleteTicket(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete ticket');
    }
  }
);

// Export all actions
export const ticketActions = {
  fetchTickets,
  fetchTicketById,
  createTicket,
  updateTicket,
  deleteTicket
};
