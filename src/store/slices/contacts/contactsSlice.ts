
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Contact } from '@/types/contact';
import { ContactsState, CACHE_DURATION } from './types';

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

// This async thunk fetches all customers
export const fetchCustomers = createAsyncThunk(
  'contacts/fetchCustomers',
  async (_, { rejectWithValue }) => {
    try {
      // Mock API call
      // In a real app, you would fetch from an API
      return mockContacts;
    } catch (error) {
      return rejectWithValue('Failed to fetch contacts');
    }
  }
);

// Mock contacts for demonstration purposes
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
    tags: ['vip', 'tech'],
    createdAt: '2023-01-15T08:30:00Z',
    updatedAt: '2023-05-20T14:15:00Z',
  },
  {
    id: '2',
    firstname: 'Jane',
    lastname: 'Smith',
    email: 'jane.smith@example.com',
    status: 'active',
    type: 'customer',
    tags: ['sales'],
    createdAt: '2023-02-10T10:45:00Z',
    updatedAt: '2023-04-18T09:20:00Z',
  },
  // Add more mock contacts as needed
];

export const fetchContactDetails = createAsyncThunk(
  'contacts/fetchContactDetails',
  async (id: string, { rejectWithValue }) => {
    try {
      // Mock API call for specific contact
      const contact = mockContacts.find(c => c.id === id);
      
      if (!contact) {
        throw new Error('Contact not found');
      }
      
      return contact;
    } catch (error) {
      return rejectWithValue('Failed to fetch contact details');
    }
  }
);

export const createContact = createAsyncThunk(
  'contacts/createContact',
  async (contact: Partial<Contact>, { rejectWithValue }) => {
    try {
      // Mock API call
      const newContact: Contact = {
        id: Math.random().toString(36).substr(2, 9),
        firstname: contact.firstname || '',
        lastname: contact.lastname || '',
        email: contact.email || '',
        status: contact.status || 'active',
        type: contact.type || 'customer',
        tags: contact.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return newContact;
    } catch (error) {
      return rejectWithValue('Failed to create contact');
    }
  }
);

export const updateContactCompany = createAsyncThunk(
  'contacts/updateContactCompany',
  async ({ contactId, companyId }: { contactId: string; companyId: string | null }, { rejectWithValue }) => {
    try {
      // Mock API call - in a real app, you would update the contact on your backend
      return { contactId, companyId };
    } catch (error) {
      return rejectWithValue('Failed to update contact company');
    }
  }
);

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    // Add reducer for toggling contact selection
    toggleSelectContact: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.selectedContacts.includes(id)) {
        state.selectedContacts = state.selectedContacts.filter(contactId => contactId !== id);
      } else {
        state.selectedContacts.push(id);
      }
    },
    selectContact: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const contact = state.contacts.find(c => c.id === id);
      state.selectedContact = contact || null;
    },
    // For backward compatibility
    toggleSelection: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.selectedContacts.includes(id)) {
        state.selectedContacts = state.selectedContacts.filter(contactId => contactId !== id);
      } else {
        state.selectedContacts.push(id);
      }
    },
    // Add more reducers as needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload;
        state.items = action.payload;
        state.lastFetchTime = Date.now();
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchContactDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.contactDetails = action.payload;
      })
      .addCase(fetchContactDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createContact.fulfilled, (state, action) => {
        state.contacts.push(action.payload);
        state.items.push(action.payload);
      })
      .addCase(updateContactCompany.fulfilled, (state, action) => {
        const { contactId, companyId } = action.payload;
        const contact = state.contacts.find(c => c.id === contactId);
        if (contact) {
          contact.company = companyId;
        }
      });
  },
});

export const { toggleSelectContact, selectContact, toggleSelection } = contactsSlice.actions;

export default contactsSlice.reducer;
