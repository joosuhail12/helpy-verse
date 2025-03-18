
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Contact } from '@/types/contact';

interface ContactsState {
  contacts: Contact[];
  selectedContact: Contact | null;
  selectedContactId: string | null;
  selectedContacts: string[];
  loading: boolean;
  error: string | null;
  filters: {
    status: string | null;
    tags: string[];
    search: string;
  };
}

const initialState: ContactsState = {
  contacts: [],
  selectedContact: null,
  selectedContactId: null,
  selectedContacts: [],
  loading: false,
  error: null,
  filters: {
    status: null,
    tags: [],
    search: '',
  },
};

export const fetchCustomers = createAsyncThunk(
  'contacts/fetchCustomers',
  async (_, { rejectWithValue }) => {
    try {
      // Implement your API call here
      return [];
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateContactTags = createAsyncThunk(
  'contacts/updateTags',
  async ({ contactId, tags }: { contactId: string; tags: string[] }, { getState, rejectWithValue }) => {
    try {
      // Implementation
      return { contactId, tags };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateContactStatus = createAsyncThunk(
  'contacts/updateStatus',
  async ({ contactIds, status }: { contactIds: string[]; status: 'active' | 'inactive' }, { rejectWithValue }) => {
    try {
      // Implementation
      return { contactIds, status };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateContactCompany = createAsyncThunk(
  'contacts/updateCompany',
  async ({ contactId, companyId }: { contactId: string; companyId: string | null }, { rejectWithValue }) => {
    try {
      // Implementation
      return { contactId, companyId };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateContact = createAsyncThunk(
  'contacts/updateContact',
  async ({ contactId, data }: { contactId: string; data: Partial<Contact> }, { rejectWithValue }) => {
    try {
      // Implementation
      return { contactId, data };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchContactById = createAsyncThunk(
  'contacts/fetchContactById',
  async (contactId: string, { rejectWithValue }) => {
    try {
      // Implementation
      const mockContact: Contact = {
        id: contactId,
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
        phone: "+1234567890",
        status: "active",
        type: "customer",
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return mockContact;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    selectContact: (state, action: PayloadAction<string | null>) => {
      const contactId = action.payload;
      state.selectedContactId = contactId;
      state.selectedContact = contactId ? state.contacts.find(contact => contact.id === contactId) || null : null;
    },
    setSelectedContacts: (state, action: PayloadAction<string[]>) => {
      state.selectedContacts = action.payload;
    },
    toggleContactSelection: (state, action: PayloadAction<string>) => {
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
    setFilter: (state, action: PayloadAction<{ key: string; value: any }>) => {
      const { key, value } = action.payload;
      if (key in state.filters) {
        (state.filters as any)[key] = value;
      }
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
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
        state.contacts = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred';
      })
      .addCase(updateContactTags.fulfilled, (state, action) => {
        const { contactId, tags } = action.payload;
        const contactIndex = state.contacts.findIndex(contact => contact.id === contactId);
        if (contactIndex !== -1) {
          state.contacts[contactIndex] = {
            ...state.contacts[contactIndex],
            tags
          };
        }
      })
      .addCase(updateContactStatus.fulfilled, (state, action) => {
        const { contactIds, status } = action.payload;
        state.contacts = state.contacts.map(contact => 
          contactIds.includes(contact.id) ? { ...contact, status } : contact
        );
      })
      .addCase(updateContactCompany.fulfilled, (state, action) => {
        const { contactId, companyId } = action.payload;
        const contactIndex = state.contacts.findIndex(contact => contact.id === contactId);
        if (contactIndex !== -1) {
          state.contacts[contactIndex] = {
            ...state.contacts[contactIndex],
            company: companyId
          };
        }
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        const { contactId, data } = action.payload;
        const contactIndex = state.contacts.findIndex(contact => contact.id === contactId);
        if (contactIndex !== -1) {
          state.contacts[contactIndex] = {
            ...state.contacts[contactIndex],
            ...data
          };
        }
      })
      .addCase(fetchContactById.fulfilled, (state, action) => {
        if (action.payload) {
          const existingIndex = state.contacts.findIndex(c => c.id === action.payload.id);
          if (existingIndex >= 0) {
            state.contacts[existingIndex] = action.payload;
          } else {
            state.contacts.push(action.payload);
          }
          state.selectedContact = action.payload;
          state.selectedContactId = action.payload.id;
        }
      });
  },
});

export const {
  selectContact,
  setSelectedContacts,
  toggleContactSelection,
  clearSelectedContacts,
  setFilter,
  resetFilters,
} = contactsSlice.actions;

export default contactsSlice.reducer;
