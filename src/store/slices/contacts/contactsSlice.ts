
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Contact } from '@/types/contact';
import { RootState } from '../../store';
import { customerService } from '@/api/services/customerService';
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
    field: 'createdAt',
    direction: 'desc',
  },
};

export const fetchCustomers = createAsyncThunk(
  'contacts/fetchCustomers',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { lastFetchTime } = state.contacts;
      
      if (lastFetchTime && Date.now() - lastFetchTime < CACHE_DURATION) {
        console.log('Using cached contacts data');
        return null;
      }
      
      const response = await customerService.fetchCustomers();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch customers');
    }
  }
);

export const fetchContactById = createAsyncThunk(
  'contacts/fetchContactById',
  async (contactId: string, { rejectWithValue }) => {
    try {
      const response = await customerService.getCustomerDetails(contactId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch contact details');
    }
  }
);

// Alias for fetchContactById for better semantics in UI components
export const fetchContactDetails = fetchContactById;

export const createContact = createAsyncThunk(
  'contacts/createContact',
  async (contactData: Partial<Contact>, { rejectWithValue }) => {
    try {
      const response = await customerService.createCustomer(contactData as any);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create contact');
    }
  }
);

// Alias for createContact for better semantics in UI components
export const addContact = createContact;

export const updateContact = createAsyncThunk(
  'contacts/updateContact',
  async ({ contactId, data }: { contactId: string; data: Partial<Contact> }, { rejectWithValue }) => {
    try {
      const response = await customerService.updateCustomer(contactId, data);
      return { contactId, ...response.data };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update contact');
    }
  }
);

export const updateContactCompany = createAsyncThunk(
  'contacts/updateContactCompany',
  async ({ contactId, companyId }: { contactId: string; companyId: string | null }, { rejectWithValue }) => {
    try {
      const response = await customerService.updateCustomer(contactId, { company: companyId });
      return { contactId, ...response.data };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update contact company');
    }
  }
);

export const deleteContact = createAsyncThunk(
  'contacts/deleteContact',
  async (contactId: string, { rejectWithValue }) => {
    try {
      await customerService.deleteContact(contactId);
      return contactId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete contact');
    }
  }
);

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<{ key: keyof ContactsState['filters']; value: string | null }>) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
    },
    setSortField: (state, action: PayloadAction<keyof Contact>) => {
      if (state.sort.field === action.payload) {
        state.sort.direction = state.sort.direction === 'asc' ? 'desc' : 'asc';
      } else {
        state.sort.field = action.payload;
        state.sort.direction = 'asc';
      }
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    selectContact: (state, action: PayloadAction<string>) => {
      state.selectedContact = state.items.find(contact => contact.id === action.payload) || null;
    },
    toggleSelectContact: (state, action: PayloadAction<string>) => {
      const contactId = action.payload;
      if (state.selectedContacts.includes(contactId)) {
        state.selectedContacts = state.selectedContacts.filter(id => id !== contactId);
      } else {
        state.selectedContacts.push(contactId);
      }
    },
    clearSelectedContacts: (state) => {
      state.selectedContacts = [];
    },
    clearSelection: (state) => {
      state.selectedContacts = [];
    },
    setSelectedContacts: (state, action: PayloadAction<string[]>) => {
      state.selectedContacts = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.contacts = action.payload;
          state.items = action.payload;
        }
        state.lastFetchTime = Date.now();
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
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
      .addCase(createContact.fulfilled, (state, action) => {
        state.contacts.push(action.payload);
        state.items.push(action.payload);
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        const updatedContact = action.payload;
        if (updatedContact && typeof updatedContact === 'object') {
          const contactId = updatedContact.contactId as string;
          
          const contactIndex = state.contacts.findIndex(c => c.id === contactId);
          if (contactIndex !== -1) {
            // Create a new contact object with the updates
            state.contacts[contactIndex] = {
              ...state.contacts[contactIndex],
              ...updatedContact
            };
          }
          
          const itemIndex = state.items.findIndex(c => c.id === contactId);
          if (itemIndex !== -1) {
            state.items[itemIndex] = {
              ...state.items[itemIndex],
              ...updatedContact
            };
          }
          
          if (state.contactDetails && state.contactDetails.id === contactId) {
            state.contactDetails = {
              ...state.contactDetails,
              ...updatedContact
            };
          }
        }
      });
  },
});

export const {
  setFilter,
  setSortField,
  resetFilters,
  selectContact,
  toggleSelectContact,
  clearSelectedContacts,
  clearSelection,
  setSelectedContacts
} = contactsSlice.actions;

export default contactsSlice.reducer;

export const selectContacts = (state: RootState) => state.contacts.items;
export const selectContactsLoading = (state: RootState) => state.contacts.loading;
export const selectContactsError = (state: RootState) => state.contacts.error;
export const selectContactDetails = (state: RootState) => state.contacts.contactDetails;
export const selectSelectedContact = (state: RootState) => state.contacts.selectedContact;
export const selectSelectedContacts = (state: RootState) => state.contacts.selectedContacts;
