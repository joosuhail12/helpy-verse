
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/store/store';
import { ContactFilters, Contact } from '@/types/contact';
import api from '@/api/Api';
import { CACHE_DURATION } from '../contactsTypes';

// Define async thunks for fetching contacts
export const fetchContacts = createAsyncThunk(
  'contacts/fetchContacts',
  async (filters: Partial<ContactFilters> & { page?: number; limit?: number } = {}, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { page, limit } = state.contacts;
      
      // Combine filters from state and passed filters
      const queryParams = {
        page: filters.page || page,
        limit: filters.limit || limit,
        ...state.contacts.filters,
        ...filters
      };
      
      const response = await api.get('/contacts', { params: queryParams });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as RootState;
      const { lastFetchTime } = state.contacts;
      
      // Skip if already loading
      if (state.contacts.loading) {
        return false;
      }
      
      // Skip if data is fresh enough
      if (lastFetchTime && Date.now() - lastFetchTime < CACHE_DURATION) {
        return false;
      }
      
      return true;
    }
  }
);

// Fetch contact details
export const fetchContactDetails = createAsyncThunk(
  'contacts/fetchContactDetails',
  async (contactId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/contacts/${contactId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
