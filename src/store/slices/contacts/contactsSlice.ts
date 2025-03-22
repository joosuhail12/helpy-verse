
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { Contact } from '@/types/contact';
import { ContactsState } from './types';
import api from '@/services/api';
import { customerService } from '@/api/services/customerService';

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
    field: 'createdAt',
    direction: 'desc',
  }
};

export const fetchContacts = createAsyncThunk(
  'contacts/fetchContacts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/contacts');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Add the fetchCustomers function that was missing
export const fetchCustomers = createAsyncThunk(
  'contacts/fetchCustomers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await customerService.fetchCustomers();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Add the fetchCustomerDetails function that was missing
export const fetchCustomerDetails = createAsyncThunk(
  'contacts/fetchCustomerDetails',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await customerService.getCustomerDetails(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchContactById = createAsyncThunk(
  'contacts/fetchContactById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/contacts/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createContact = createAsyncThunk(
  'contacts/createContact',
  async (contact: Partial<Contact>, { rejectWithValue }) => {
    try {
      const response = await api.post('/contacts', contact);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Add the missing addContact function
export const addContact = createAsyncThunk(
  'contacts/addContact',
  async (contactData: Partial<Contact>, { rejectWithValue }) => {
    try {
      const response = await customerService.createCustomer(contactData as any);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateContact = createAsyncThunk(
  'contacts/updateContact',
  async ({ id, data }: { id: string; data: Partial<Contact> }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/contacts/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Add the missing updateCustomer function
export const updateCustomer = createAsyncThunk(
  'contacts/updateCustomer',
  async ({ customer_id, ...data }: { customer_id: string; [key: string]: any }, { rejectWithValue }) => {
    try {
      const response = await customerService.updateCustomer(customer_id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteContact = createAsyncThunk(
  'contacts/deleteContact',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/contacts/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const bulkDeleteContacts = createAsyncThunk(
  'contacts/bulkDeleteContacts',
  async (ids: string[], { rejectWithValue }) => {
    try {
      await api.post('/contacts/bulk-delete', { ids });
      return ids;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    setSelectedContact: (state, action: PayloadAction<Contact | null>) => {
      state.selectedContact = action.payload;
    },
    setSelectedContacts: (state, action: PayloadAction<string[]>) => {
      state.selectedContacts = action.payload;
    },
    toggleContactSelection: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.selectedContacts.includes(id)) {
        state.selectedContacts = state.selectedContacts.filter((contactId) => contactId !== id);
      } else {
        state.selectedContacts.push(id);
      }
    },
    clearSelectedContacts: (state) => {
      state.selectedContacts = [];
    },
    setContactFilter: (state, action: PayloadAction<{ key: string; value: string | null }>) => {
      const { key, value } = action.payload;
      if (key in state.filters) {
        (state.filters as any)[key] = value;
      }
    },
    setContactSort: (state, action: PayloadAction<{ field: keyof Contact; direction: 'asc' | 'desc' }>) => {
      state.sort = action.payload;
    },
    updateContactField: (state, action: PayloadAction<{ id: string; field: keyof Contact; value: any }>) => {
      const { id, field, value } = action.payload;
      const contact = state.items.find(contact => contact.id === id);
      if (contact) {
        // Use type assertion to handle dynamic field updates safely
        (contact as any)[field] = value;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.contacts = action.payload; // Update contacts property
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
<<<<<<< HEAD
<<<<<<< HEAD
=======
      // Add cases for fetchCustomers
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
      // Add cases for fetchCustomerDetails
      .addCase(fetchCustomerDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
>>>>>>> 11f71f9 (Fix TypeScript errors and import issues)
      .addCase(fetchCustomerDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.contactDetails = action.payload;
      })
      .addCase(fetchCustomerDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
<<<<<<< HEAD
      .addCase(importCustomers.pending, (state) => {
=======
=======
>>>>>>> 11f71f9 (Fix TypeScript errors and import issues)
      .addCase(fetchContactById.pending, (state) => {
>>>>>>> c756439 (Update frontend code)
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
      .addCase(createContact.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.contacts.push(action.payload);
      })
      // Add cases for addContact
      .addCase(addContact.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.contacts.push(action.payload);
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        const index = state.items.findIndex(contact => contact.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        
        const contactIndex = state.contacts.findIndex(contact => contact.id === action.payload.id);
        if (contactIndex !== -1) {
          state.contacts[contactIndex] = action.payload;
        }
        
        if (state.selectedContact?.id === action.payload.id) {
          state.selectedContact = action.payload;
        }
        
        if (state.contactDetails?.id === action.payload.id) {
          state.contactDetails = action.payload;
        }
      })
      // Add cases for updateCustomer
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const index = state.items.findIndex(contact => contact.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        
        const contactIndex = state.contacts.findIndex(contact => contact.id === action.payload.id);
        if (contactIndex !== -1) {
          state.contacts[contactIndex] = action.payload;
        }
        
        if (state.selectedContact?.id === action.payload.id) {
          state.selectedContact = action.payload;
        }
        
        if (state.contactDetails?.id === action.payload.id) {
          state.contactDetails = action.payload;
        }
      })
<<<<<<< HEAD
      .addCase(updateCustomer.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(addContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addContact.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = [...state.contacts, action.payload];
=======
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.items = state.items.filter(contact => contact.id !== action.payload);
        state.contacts = state.contacts.filter(contact => contact.id !== action.payload);
        
        if (state.selectedContact?.id === action.payload) {
          state.selectedContact = null;
        }
        
        if (state.contactDetails?.id === action.payload) {
          state.contactDetails = null;
        }
        
        state.selectedContacts = state.selectedContacts.filter(id => id !== action.payload);
>>>>>>> c756439 (Update frontend code)
      })
      .addCase(bulkDeleteContacts.fulfilled, (state, action) => {
        const deletedIds = new Set(action.payload);
        state.items = state.items.filter(contact => !deletedIds.has(contact.id));
        state.contacts = state.contacts.filter(contact => !deletedIds.has(contact.id));
        
        if (state.selectedContact && deletedIds.has(state.selectedContact.id)) {
          state.selectedContact = null;
        }
        
        if (state.contactDetails && deletedIds.has(state.contactDetails.id)) {
          state.contactDetails = null;
        }
        
        state.selectedContacts = state.selectedContacts.filter(id => !deletedIds.has(id));
      });
  }
});

<<<<<<< HEAD
export const { setSelectedContacts, toggleContactSelection, updateContact } = customerSlice.actions;

export const selectContacts = (state: { customers: ContactsState }) => state.customers.contacts;
export const selectContactsLoading = (state: { customers: ContactsState }) => state.customers.loading;
export const selectContactsError = (state: { customers: ContactsState }) => state.customers.error;

export default customerSlice.reducer;
=======
export const {
  setSelectedContact,
  setSelectedContacts,
  toggleContactSelection,
  clearSelectedContacts,
  setContactFilter,
  setContactSort,
  updateContactField
} = contactsSlice.actions;

export default contactsSlice.reducer;
>>>>>>> c756439 (Update frontend code)
