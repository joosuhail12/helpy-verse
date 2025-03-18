
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/store/store';
import { Contact } from '@/types/contact';

export interface ContactsState {
  contacts: Contact[];
  selectedContacts: string[];
  contactDetails: Contact | null;
  lastFetchTime: string | null;
  filter: {
    search: string;
    status: 'all' | 'active' | 'inactive';
    tags: string[];
  };
  loading: boolean;
  error: string | null;
}

const initialState: ContactsState = {
  contacts: [],
  selectedContacts: [],
  contactDetails: null,
  lastFetchTime: null,
  filter: {
    search: '',
    status: 'all',
    tags: [],
  },
  loading: false,
  error: null,
};

export const fetchCustomers = createAsyncThunk(
  'contacts/fetchCustomers',
  async (_, { rejectWithValue }) => {
    try {
      // Mock API call
      return []; // Replace with actual API call
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCustomerDetails = createAsyncThunk(
  'contacts/fetchCustomerDetails',
  async (id: string, { rejectWithValue }) => {
    try {
      // Mock API call
      return null; // Replace with actual API call
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addContact = createAsyncThunk(
  'contacts/addContact',
  async (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      // Mock API call
      const newContact: Contact = {
        id: Math.random().toString(36).substring(2, 9),
        ...contact,
        status: contact.status || 'active',
        type: contact.type || 'customer',
        tags: contact.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return newContact;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateContact = createAsyncThunk(
  'contacts/updateContact',
  async ({ id, data }: { id: string; data: Partial<Contact> }, { rejectWithValue }) => {
    try {
      // Mock API call
      return { id, ...data };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateContactTags = createAsyncThunk(
  'contacts/updateContactTags',
  async ({ id, tags }: { id: string; tags: string[] }, { rejectWithValue }) => {
    try {
      // Mock API call
      return { id, tags };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateContactCompany = createAsyncThunk(
  'contacts/updateContactCompany',
  async ({ contactId, companyId }: { contactId: string; companyId: string }, { rejectWithValue }) => {
    try {
      // Mock API call
      return { id: contactId, company: companyId };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

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
    setSelectedContacts: (state, action: PayloadAction<string[]>) => {
      state.selectedContacts = action.payload;
    },
    clearSelectedContacts: (state) => {
      state.selectedContacts = [];
    },
    toggleContactSelection: (state, action: PayloadAction<string>) => {
      const index = state.selectedContacts.indexOf(action.payload);
      if (index === -1) {
        state.selectedContacts.push(action.payload);
      } else {
        state.selectedContacts.splice(index, 1);
      }
    },
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filter.search = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<'all' | 'active' | 'inactive'>) => {
      state.filter.status = action.payload;
    },
    setTagsFilter: (state, action: PayloadAction<string[]>) => {
      state.filter.tags = action.payload;
    },
    clearFilters: (state) => {
      state.filter = initialState.filter;
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
        state.lastFetchTime = new Date().toISOString();
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
      .addCase(addContact.fulfilled, (state, action) => {
        state.contacts.push(action.payload);
      })
      // Update contact
      .addCase(updateContact.fulfilled, (state, action) => {
        const { id, ...updates } = action.payload;
        const contactIndex = state.contacts.findIndex(contact => contact.id === id);
        
        if (contactIndex !== -1) {
          state.contacts[contactIndex] = {
            ...state.contacts[contactIndex],
            ...updates,
            updatedAt: new Date().toISOString(),
          };
        }
        
        if (state.contactDetails && state.contactDetails.id === id) {
          state.contactDetails = {
            ...state.contactDetails,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
        }
      })
      // Update contact tags
      .addCase(updateContactTags.fulfilled, (state, action) => {
        const { id, tags } = action.payload;
        const contactIndex = state.contacts.findIndex(contact => contact.id === id);
        
        if (contactIndex !== -1) {
          state.contacts[contactIndex].tags = tags;
          state.contacts[contactIndex].updatedAt = new Date().toISOString();
        }
        
        if (state.contactDetails && state.contactDetails.id === id) {
          state.contactDetails.tags = tags;
          state.contactDetails.updatedAt = new Date().toISOString();
        }
      })
      // Update contact company
      .addCase(updateContactCompany.fulfilled, (state, action) => {
        const { id, company } = action.payload;
        const contactIndex = state.contacts.findIndex(contact => contact.id === id);
        
        if (contactIndex !== -1) {
          state.contacts[contactIndex].company = company;
          state.contacts[contactIndex].updatedAt = new Date().toISOString();
        }
        
        if (state.contactDetails && state.contactDetails.id === id) {
          state.contactDetails.company = company;
          state.contactDetails.updatedAt = new Date().toISOString();
        }
      });
  },
});

export const {
  selectContact,
  deselectContact,
  setSelectedContacts,
  clearSelectedContacts,
  toggleContactSelection,
  setSearchFilter,
  setStatusFilter,
  setTagsFilter,
  clearFilters,
} = contactsSlice.actions;

export default contactsSlice.reducer;
