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

export const fetchCustomers = createAsyncThunk('contacts/fetchCustomers', async () => {
  // Mock data fetching
  return [];
});

export const fetchCustomerDetails = createAsyncThunk('contacts/fetchCustomerDetails', async (id: string) => {
  // Mock data fetching for a single customer
  return null;
});

export const addContact = createAsyncThunk('contacts/addContact', async (contact: Omit<Contact, 'id'>) => {
  // Mock adding a contact
  return {
    ...contact,
    id: Date.now().toString(),
  } as Contact;
});

export const updateContact = createAsyncThunk(
  'contacts/updateContact',
  async ({ contactId, data }: { contactId: string; data: Partial<Contact> }) => {
    // Mock updating a contact
    return {
      contactId,
      data,
    };
  }
);

export const deleteContact = createAsyncThunk('contacts/deleteContact', async (id: string) => {
  // Mock deleting a contact
  return id;
});

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    selectContact: (state, action: PayloadAction<Contact>) => {
      state.selectedContact = action.payload;
    },
    deselectContact: (state) => {
      state.selectedContact = null;
    },
    toggleContactSelection: (state, action: PayloadAction<string>) => {
      const contactId = action.payload;
      const index = state.selectedContacts.findIndex(id => id === contactId);
      if (index === -1) {
        state.selectedContacts.push(contactId);
      } else {
        state.selectedContacts.splice(index, 1);
      }
    },
    selectAllContacts: (state) => {
      state.selectedContacts = state.items.map(contact => contact.id);
    },
    clearSelection: (state) => {
      state.selectedContacts = [];
    },
    updateContactTags: (state, action: PayloadAction<{ contactId: string; tags: string[] }>) => {
      const { contactId, tags } = action.payload;
      const contactIndex = state.items.findIndex(contact => contact.id === contactId);
      if (contactIndex !== -1) {
        state.items[contactIndex].tags = tags;
        if (state.selectedContact && state.selectedContact.id === contactId) {
          state.selectedContact.tags = tags;
        }
      }
    },
    updateContactFilters: (state, action: PayloadAction<{ type?: string; status?: string; search?: string }>) => {
      if (action.payload.type !== undefined) {
        state.filters.type = action.payload.type;
      }
      if (action.payload.status !== undefined) {
        state.filters.status = action.payload.status;
      }
      if (action.payload.search !== undefined) {
        state.filters.search = action.payload.search;
      }
    },
    clearFilters: (state) => {
      state.filters = {
        type: null,
        status: null,
        search: '',
      };
    },
    setSortField: (state, action: PayloadAction<keyof Contact>) => {
      if (state.sort.field === action.payload) {
        state.sort.direction = state.sort.direction === 'asc' ? 'desc' : 'asc';
      } else {
        state.sort.field = action.payload;
        state.sort.direction = 'asc';
      }
    },
    updateContactCompany: (state, action: PayloadAction<{ contactId: string; companyId: string }>) => {
      const { contactId, companyId } = action.payload;
      const contactIndex = state.items.findIndex(contact => contact.id === contactId);
      if (contactIndex !== -1) {
        state.items[contactIndex].company = companyId;
      }
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
        state.items = action.payload;
        state.contacts = action.payload;
        state.lastFetchTime = Date.now();
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
        const { contactId, data } = action.payload;
        const contactIndex = state.items.findIndex(c => c.id === contactId);
        if (contactIndex !== -1) {
          state.items[contactIndex] = { ...state.items[contactIndex], ...data };
          if (state.selectedContact && state.selectedContact.id === contactId) {
            state.selectedContact = { ...state.selectedContact, ...data };
          }
          if (state.contactDetails && state.contactDetails.id === contactId) {
            state.contactDetails = { ...state.contactDetails, ...data };
          }

          // Update in contacts array too
          const contactIndexInContacts = state.contacts.findIndex(c => c.id === contactId);
          if (contactIndexInContacts !== -1) {
            state.contacts[contactIndexInContacts] = { ...state.contacts[contactIndexInContacts], ...data };
          }
        }
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.items = state.items.filter(contact => contact.id !== action.payload);
        state.contacts = state.contacts.filter(contact => contact.id !== action.payload);
        state.selectedContacts = state.selectedContacts.filter(id => id !== action.payload);
        if (state.selectedContact && state.selectedContact.id === action.payload) {
          state.selectedContact = null;
        }
        if (state.contactDetails && state.contactDetails.id === action.payload) {
          state.contactDetails = null;
        }
      });
  },
});

export const {
  selectContact,
  deselectContact,
  toggleContactSelection,
  selectAllContacts,
  clearSelection,
  updateContactTags,
  updateContactFilters,
  clearFilters,
  setSortField,
  updateContactCompany,
  toggleSelection,
} = contactsSlice.actions;

export default contactsSlice.reducer;
