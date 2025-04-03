
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ContactsState } from './types';

// Define async thunks
export const fetchCustomers = createAsyncThunk(
  'contacts/fetchCustomers',
  async (_, { rejectWithValue }) => {
    try {
      // Mock API call
      return [] as any[];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch contacts');
    }
  }
);

export const fetchContactById = createAsyncThunk(
  'contacts/fetchContactById',
  async (contactId: string, { rejectWithValue }) => {
    try {
      // Mock API call
      return { id: contactId, name: 'Mock Contact' };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch contact details');
    }
  }
);

export const fetchContactDetails = createAsyncThunk(
  'contacts/fetchContactDetails',
  async (contactId: string, { rejectWithValue }) => {
    try {
      // Mock API call
      return { id: contactId, name: 'Mock Contact' };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch contact details');
    }
  }
);

export const createContact = createAsyncThunk(
  'contacts/createContact',
  async (contactData: any, { rejectWithValue }) => {
    try {
      // Mock API call
      return { id: `contact-${Date.now()}`, ...contactData };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create contact');
    }
  }
);

export const updateContact = createAsyncThunk(
  'contacts/updateContact',
  async ({ contactId, data }: { contactId: string; data: any }, { rejectWithValue }) => {
    try {
      // Mock API call
      return { contactId, data: { id: contactId, ...data } };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update contact');
    }
  }
);

export const updateContactCompany = createAsyncThunk(
  'contacts/updateContactCompany',
  async ({ contactId, companyId }: { contactId: string; companyId: string }, { rejectWithValue }) => {
    try {
      // Mock API call
      return { 
        contactId, 
        data: { 
          id: contactId, 
          company: { id: companyId, name: 'Mock Company' } 
        } 
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update contact company');
    }
  }
);

export const deleteContact = createAsyncThunk(
  'contacts/deleteContact',
  async (contactId: string, { rejectWithValue }) => {
    try {
      // Mock API call
      return contactId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete contact');
    }
  }
);

export const addContact = createAsyncThunk(
  'contacts/addContact',
  async (contactData: any, { rejectWithValue }) => {
    try {
      // Mock API call
      return { id: `contact-${Date.now()}`, ...contactData };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add contact');
    }
  }
);

const initialState: ContactsState = {
  contacts: [],
  contactDetails: null,
  selectedContact: null,
  selectedContacts: [],
  loading: false,
  error: null,
  lastFetchTime: null,
};

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    selectContact: (state, action) => {
      state.selectedContact = action.payload;
    },
    clearSelectedContact: (state) => {
      state.selectedContact = null;
    },
    toggleSelectContact: (state, action) => {
      const contactId = action.payload;
      const index = state.selectedContacts.indexOf(contactId);
      if (index !== -1) {
        state.selectedContacts.splice(index, 1);
      } else {
        state.selectedContacts.push(contactId);
      }
    },
    setSelectedContacts: (state, action) => {
      state.selectedContacts = action.payload;
    },
    clearSelection: (state) => {
      state.selectedContacts = [];
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
        if (action.payload !== null) {
          state.contacts = action.payload;
          state.lastFetchTime = Date.now();
        }
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch contact by ID
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
      
      // Create contact
      .addCase(createContact.fulfilled, (state, action) => {
        state.contacts.push(action.payload);
      })
      
      // Update contact
      .addCase(updateContact.fulfilled, (state, action) => {
        const { contactId, data } = action.payload;
        
        // Update in contacts array
        const contactIndex = state.contacts.findIndex(c => c.id === contactId);
        if (contactIndex !== -1) {
          state.contacts[contactIndex] = data;
        }
        
        // Update contact details if it's the currently selected contact
        if (state.contactDetails && state.contactDetails.id === contactId) {
          state.contactDetails = data;
        }
      })
      
      // Update contact company
      .addCase(updateContactCompany.fulfilled, (state, action) => {
        const { contactId, data } = action.payload;
        
        // Update in contacts array
        const contactIndex = state.contacts.findIndex(c => c.id === contactId);
        if (contactIndex !== -1) {
          state.contacts[contactIndex] = data;
        }
        
        // Update contact details if it's the currently selected contact
        if (state.contactDetails && state.contactDetails.id === contactId) {
          state.contactDetails = data;
        }
      })
      
      // Delete contact
      .addCase(deleteContact.fulfilled, (state, action) => {
        const contactId = action.payload;
        state.contacts = state.contacts.filter(c => c.id !== contactId);
        if (state.contactDetails && state.contactDetails.id === contactId) {
          state.contactDetails = null;
        }
        state.selectedContacts = state.selectedContacts.filter(id => id !== contactId);
      });
  },
});

export const { 
  selectContact, 
  clearSelectedContact, 
  toggleSelectContact, 
  setSelectedContacts, 
  clearSelection 
} = contactsSlice.actions;

// Selectors
export const selectContacts = (state: any) => state.contacts.contacts;
export const selectContactsLoading = (state: any) => state.contacts.loading;
export const selectContactsError = (state: any) => state.contacts.error;

export default contactsSlice.reducer;
