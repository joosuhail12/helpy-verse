
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Contact, ContactFilters } from '@/types/contact';
import { mockContacts } from '../mockData';

// Fetch actions - using domain/event pattern
export const fetchContacts = createAsyncThunk(
  'contacts/fetchContacts',
  async (filters: ContactFilters, { rejectWithValue }) => {
    try {
      // For now, using mock data
      return {
        data: mockContacts,
        total: mockContacts.length
      };
    } catch (error) {
      return rejectWithValue('Failed to fetch contacts');
    }
  }
);

export const fetchCustomers = createAsyncThunk(
  'contacts/fetchCustomers',
  async (_, { dispatch }) => {
    // We'll need to import the filters from the slice or pass them as parameters
    const filters: ContactFilters = {
      search: '',
      status: [],
      type: [],
      tags: []
    };
    return dispatch(fetchContacts(filters));
  }
);

export const fetchContactById = createAsyncThunk(
  'contacts/fetchContactById',
  async (contactId: string, { rejectWithValue }) => {
    try {
      // For now, using mock data
      const contact = mockContacts.find(c => c.id === contactId);
      if (!contact) {
        throw new Error('Contact not found');
      }
      return contact;
    } catch (error) {
      return rejectWithValue('Failed to fetch contact');
    }
  }
);

// Alias for fetchContactById with consistent naming
export const fetchContactDetails = fetchContactById;
