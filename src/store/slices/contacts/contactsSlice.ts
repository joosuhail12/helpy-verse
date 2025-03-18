
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Contact } from '@/types/contact';
import api from '@/services/api';

// Define the contact state interface
interface ContactsState {
  contacts: Contact[];
  contactDetails: Contact | null;
  loading: boolean;
  error: string | null;
  lastFetchTime: number | null;
  selectedContacts: string[];
}

// Initial state
const initialState: ContactsState = {
  contacts: [],
  contactDetails: null,
  loading: false,
  error: null,
  lastFetchTime: null,
  selectedContacts: [],
};

// Fetch customers thunk
export const fetchCustomers = createAsyncThunk(
  'contacts/fetchCustomers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/customers');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch customers');
    }
  }
);

// Fetch customer details thunk
export const fetchCustomerDetails = createAsyncThunk(
  'contacts/fetchCustomerDetails',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/customers/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch customer details');
    }
  }
);

// Add contact thunk
export const addContact = createAsyncThunk(
  'contacts/addContact',
  async (contact: Partial<Contact>, { rejectWithValue }) => {
    try {
      const response = await api.post('/customers', contact);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add customer');
    }
  }
);

// Update customer thunk
export const updateCustomer = createAsyncThunk(
  'contacts/updateCustomer',
  async ({ id, data }: { id: string; data: Partial<Contact> }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/customers/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update customer');
    }
  }
);

// Contacts slice
const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    selectContact: (state, action: PayloadAction<string>) => {
      if (!state.selectedContacts.includes(action.payload)) {
        state.selectedContacts.push(action.payload);
      }
    },
    deselectContact: (state, action: PayloadAction<string>) => {
      state.selectedContacts = state.selectedContacts.filter(id => id !== action.payload);
    },
    selectAllContacts: (state) => {
      state.selectedContacts = state.contacts.map(contact => contact.id);
    },
    deselectAllContacts: (state) => {
      state.selectedContacts = [];
    },
    updateContactStatus: (state, action: PayloadAction<{ id: string; data: Partial<Contact> }>) => {
      const { id, data } = action.payload;
      const contactIndex = state.contacts.findIndex(contact => contact.id === id);
      if (contactIndex !== -1) {
        const updatedContact = { ...state.contacts[contactIndex], ...data };
        state.contacts[contactIndex] = updatedContact as Contact;
      }
    },
    updateContactTags: (state, action: PayloadAction<{ id: string; data: Partial<Contact> }>) => {
      const { id, data } = action.payload;
      const contactIndex = state.contacts.findIndex(contact => contact.id === id);
      if (contactIndex !== -1) {
        const updatedContact = { ...state.contacts[contactIndex], ...data };
        state.contacts[contactIndex] = updatedContact as Contact;
      }
    },
    updateContactNotes: (state, action: PayloadAction<{ id: string; data: Partial<Contact> }>) => {
      const { id, data } = action.payload;
      const contactIndex = state.contacts.findIndex(contact => contact.id === id);
      if (contactIndex !== -1) {
        const updatedContact = { ...state.contacts[contactIndex], ...data };
        state.contacts[contactIndex] = updatedContact as Contact;
      }
    },
    updateContactCompany: (state, action: PayloadAction<{ id: string; data: Partial<Contact> }>) => {
      const { id, data } = action.payload;
      const contactIndex = state.contacts.findIndex(contact => contact.id === id);
      if (contactIndex !== -1) {
        const updatedContact = { ...state.contacts[contactIndex], ...data };
        state.contacts[contactIndex] = updatedContact as Contact;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch customers
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload;
        state.lastFetchTime = Date.now();
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch customer details
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
        state.error = action.payload as string;
      })
      // Add contact
      .addCase(addContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addContact.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts.push(action.payload);
      })
      .addCase(addContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update customer
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.loading = false;
        const updatedContact = action.payload;
        const index = state.contacts.findIndex(contact => contact.id === updatedContact.id);
        if (index !== -1) {
          state.contacts[index] = updatedContact;
        }
        if (state.contactDetails && state.contactDetails.id === updatedContact.id) {
          state.contactDetails = updatedContact;
        }
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  selectContact,
  deselectContact,
  selectAllContacts,
  deselectAllContacts,
  updateContactStatus,
  updateContactTags,
  updateContactNotes,
  updateContactCompany,
} = contactsSlice.actions;

export default contactsSlice.reducer;
