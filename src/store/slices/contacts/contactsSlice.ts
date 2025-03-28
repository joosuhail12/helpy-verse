
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Contact, ContactFilters } from '@/types/contact';
import { contactsApi } from '@/services/api/contactsApi';
import { mockContacts } from './mockData';

// Define the initial state
export interface ContactsState {
  contacts: Contact[];
  selectedContact: Contact | null;
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  filters: ContactFilters;
}

const initialState: ContactsState = {
  contacts: [],
  selectedContact: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,
  filters: {
    search: '',
    status: [],
    type: [],
    tags: []
  }
};

// Define the thunks
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

export interface UpdateContactPayload {
  contactId: string;
  data: Partial<Contact>;
}

export const updateContact = createAsyncThunk(
  'contacts/updateContact',
  async ({ contactId, data }: UpdateContactPayload, { rejectWithValue }) => {
    try {
      // Mock update
      const contactIndex = mockContacts.findIndex(c => c.id === contactId);
      if (contactIndex === -1) {
        throw new Error('Contact not found');
      }
      
      // In a real app, this would be an API call
      const updatedContact = { 
        ...mockContacts[contactIndex], 
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      return updatedContact;
    } catch (error) {
      return rejectWithValue('Failed to update contact');
    }
  }
);

export const updateContactCompany = createAsyncThunk(
  'contacts/updateContactCompany',
  async ({ contactId, companyId }: { contactId: string; companyId: string | null }, { rejectWithValue }) => {
    try {
      // Mock update
      const contactIndex = mockContacts.findIndex(c => c.id === contactId);
      if (contactIndex === -1) {
        throw new Error('Contact not found');
      }
      
      // In a real app, this would be an API call
      const updatedContact = { 
        ...mockContacts[contactIndex], 
        company: companyId,
        updatedAt: new Date().toISOString()
      };
      
      return updatedContact;
    } catch (error) {
      return rejectWithValue('Failed to update contact company');
    }
  }
);

// Create the slice
const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    setSelectedContact: (state, action: PayloadAction<Contact>) => {
      state.selectedContact = action.payload;
    },
    clearSelectedContact: (state) => {
      state.selectedContact = null;
    },
    setFilters: (state, action: PayloadAction<ContactFilters>) => {
      state.filters = action.payload;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchContacts
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // fetchContactById
      .addCase(fetchContactById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedContact = action.payload;
      })
      .addCase(fetchContactById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // updateContact
      .addCase(updateContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        state.loading = false;
        // Update in contacts array
        const index = state.contacts.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.contacts[index] = action.payload;
        }
        // Update selected contact if it's the one updated
        if (state.selectedContact && state.selectedContact.id === action.payload.id) {
          state.selectedContact = action.payload;
        }
      })
      .addCase(updateContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // updateContactCompany
      .addCase(updateContactCompany.fulfilled, (state, action) => {
        state.loading = false;
        // Update in contacts array
        const index = state.contacts.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.contacts[index] = action.payload;
        }
        // Update selected contact if it's the one updated
        if (state.selectedContact && state.selectedContact.id === action.payload.id) {
          state.selectedContact = action.payload;
        }
      });
  }
});

export const { 
  setSelectedContact, 
  clearSelectedContact,
  setFilters,
  resetFilters
} = contactsSlice.actions;

export default contactsSlice.reducer;
