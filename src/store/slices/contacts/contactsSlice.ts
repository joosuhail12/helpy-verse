
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/store/store';
import { Contact } from '@/types/contact';
import { ContactsState, CACHE_DURATION } from './types';

// Mock data for initial development
const mockContacts: Contact[] = [
  {
    id: '1',
    firstname: 'John',
    lastname: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Acme Inc',
    status: 'active',
    type: 'customer',
    tags: ['vip', 'enterprise'],
    createdAt: '2023-01-15T08:30:00Z',
    updatedAt: '2023-05-20T14:45:00Z',
  },
  // More mock contacts...
];

// Async thunks
export const fetchCustomers = createAsyncThunk(
  'contacts/fetchContacts',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { lastFetchTime } = state.contacts;
    
    // Check if cache is still valid
    if (lastFetchTime && Date.now() - lastFetchTime < CACHE_DURATION) {
      return { contacts: state.contacts.items, fromCache: true };
    }
    
    // In a real app, this would be an API call
    // For now, return mock data with a small delay to simulate network
    await new Promise(resolve => setTimeout(resolve, 500));
    return { contacts: mockContacts, fromCache: false };
  }
);

export const fetchCustomerDetails = createAsyncThunk(
  'contacts/fetchCustomerDetails',
  async (contactId: string) => {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 300));
    const contact = mockContacts.find(c => c.id === contactId);
    if (!contact) {
      throw new Error('Contact not found');
    }
    return contact;
  }
);

export const addContact = createAsyncThunk(
  'contacts/addContact',
  async (contactData: Partial<Contact>, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return the new contact with server-generated fields
      return {
        ...contactData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Contact;
    } catch (error) {
      return rejectWithValue('Failed to add contact');
    }
  }
);

export const updateContact = createAsyncThunk(
  'contacts/updateContact',
  async ({ contactId, data }: { contactId: string; data: Partial<Contact> }, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        id: contactId,
        ...data,
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      return rejectWithValue('Failed to update contact');
    }
  }
);

const initialState: ContactsState = {
  items: [],
  contacts: [],
  contactDetails: null,
  selectedContact: null,
  selectedContacts: [],
  loading: false,
  error: null,
  lastFetchTime: null,
  filters: {
    type: null,
    status: null,
    search: '',
  },
  sort: {
    field: 'lastname',
    direction: 'asc',
  },
};

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    selectContact: (state, action: PayloadAction<string>) => {
      const contact = state.items.find(c => c.id === action.payload);
      state.selectedContact = contact || null;
    },
    clearSelection: (state) => {
      state.selectedContacts = [];
    },
    toggleSelectContact: (state, action: PayloadAction<string>) => {
      const index = state.selectedContacts.indexOf(action.payload);
      if (index === -1) {
        state.selectedContacts.push(action.payload);
      } else {
        state.selectedContacts.splice(index, 1);
      }
    },
    selectAllContacts: (state) => {
      state.selectedContacts = state.items.map(c => c.id);
    },
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<string | null>) => {
      state.filters.status = action.payload;
    },
    setTypeFilter: (state, action: PayloadAction<string | null>) => {
      state.filters.type = action.payload;
    },
    setSorting: (state, action: PayloadAction<{ field: keyof Contact; direction: 'asc' | 'desc' }>) => {
      state.sort = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.contacts;
        state.contacts = action.payload.contacts;
        if (!action.payload.fromCache) {
          state.lastFetchTime = Date.now();
        }
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch contacts';
      })
      .addCase(fetchCustomerDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.contactDetails = action.payload;
      })
      .addCase(fetchCustomerDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch contact details';
      })
      .addCase(addContact.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.contacts.push(action.payload);
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        const { id, ...updatedData } = action.payload;
        const contactIndex = state.items.findIndex(c => c.id === id);
        if (contactIndex !== -1) {
          state.items[contactIndex] = { ...state.items[contactIndex], ...updatedData };
        }
        
        const contactDetailsId = state.contactDetails?.id;
        if (contactDetailsId === id) {
          state.contactDetails = { ...state.contactDetails!, ...updatedData };
        }
      });
  },
});

export const { 
  selectContact, 
  clearSelection, 
  toggleSelectContact, 
  selectAllContacts,
  setSearchFilter,
  setStatusFilter,
  setTypeFilter,
  setSorting,
} = contactsSlice.actions;

export default contactsSlice.reducer;
