
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Contact, ContactFilters } from '@/types/contact';
import { mockContacts } from './mockData';

// Define the initial state
export interface ContactsState {
  contacts: Contact[];
  selectedContact: Contact | null;
  selectedContactIds: string[];
  contactDetails: Contact | null;
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  filters: ContactFilters;
  lastFetchTime: number | null;
}

const initialState: ContactsState = {
  contacts: [],
  selectedContact: null,
  selectedContactIds: [],
  contactDetails: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,
  lastFetchTime: null,
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

// Alias for fetchContacts
export const fetchCustomers = createAsyncThunk(
  'contacts/fetchCustomers',
  async (_, { dispatch }) => {
    return dispatch(fetchContacts(initialState.filters));
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

// Alias for fetchContactById
export const fetchContactDetails = fetchContactById;

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
  async ({ contactId, companyId }: { contactId: string; companyId: string | null }, { dispatch }) => {
    return dispatch(updateContact({
      contactId,
      data: { company: companyId }
    }));
  }
);

// Alias for createContact
export const addContact = createAsyncThunk(
  'contacts/addContact',
  async (contactData: Partial<Contact>, { rejectWithValue }) => {
    try {
      // Mock create
      const newContact: Contact = {
        id: Date.now().toString(),
        ...contactData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        firstname: contactData.firstname || '',
        lastname: contactData.lastname || '',
        email: contactData.email || '',
      };
      
      return newContact;
    } catch (error) {
      return rejectWithValue('Failed to create contact');
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
    },
    toggleSelectContact: (state, action: PayloadAction<string>) => {
      if (state.selectedContactIds.includes(action.payload)) {
        state.selectedContactIds = state.selectedContactIds.filter(id => id !== action.payload);
      } else {
        state.selectedContactIds.push(action.payload);
      }
    },
    clearSelection: (state) => {
      state.selectedContactIds = [];
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
        state.lastFetchTime = Date.now();
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
        state.contactDetails = action.payload;
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
        // Update contactDetails if it's the one updated
        if (state.contactDetails && state.contactDetails.id === action.payload.id) {
          state.contactDetails = action.payload;
        }
        // Update selectedContact if it's the one updated
        if (state.selectedContact && state.selectedContact.id === action.payload.id) {
          state.selectedContact = action.payload;
        }
      })
      .addCase(updateContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // addContact
      .addCase(addContact.fulfilled, (state, action) => {
        state.contacts.push(action.payload);
        state.total += 1;
      });
  }
});

export const { 
  setSelectedContact, 
  clearSelectedContact,
  setFilters,
  resetFilters,
  toggleSelectContact,
  clearSelection
} = contactsSlice.actions;

// Export the selectors
export * from './contactsSelectors';

export default contactsSlice.reducer;
