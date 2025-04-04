
import { createAsyncThunk } from '@reduxjs/toolkit';
import { HttpClient } from '@/api/services/http';
import { getWorkspaceId } from '@/utils/auth/tokenManager';

export const fetchTickets = createAsyncThunk(
  'inbox/fetchTickets',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching tickets from API');
      // Get current workspace ID
      const workspaceId = getWorkspaceId();
      
      if (!workspaceId) {
        console.error('No workspace ID found when fetching tickets');
        return rejectWithValue('No workspace ID available');
      }

      // Make API call to fetch tickets
      const response = await HttpClient.apiClient.get('/tickets', {
        params: {
          workspace_id: workspaceId,
          // You can add other params like pagination, filters, etc.
          limit: 50,
          offset: 0,
        }
      });
      
      console.log('Tickets fetched:', response.data);
      // If your API returns nested data, extract it
      const tickets = response.data?.data || [];
      return tickets;
    } catch (error: any) {
      console.error('Error fetching tickets:', error);
      return rejectWithValue(error.message || 'Failed to fetch tickets');
    }
  }
);

export const fetchTicketById = createAsyncThunk(
  'inbox/fetchTicketById',
  async (ticketId: string, { rejectWithValue }) => {
    try {
      const workspaceId = getWorkspaceId();
      
      if (!workspaceId) {
        console.error('No workspace ID found when fetching ticket details');
        return rejectWithValue('No workspace ID available');
      }

      const response = await HttpClient.apiClient.get(`/tickets/${ticketId}`, {
        params: {
          workspace_id: workspaceId,
        }
      });
      
      return response.data?.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch ticket details');
    }
  }
);
