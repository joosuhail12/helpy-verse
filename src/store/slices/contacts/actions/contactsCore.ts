
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContactsState } from '../contactsTypes';
import { Contact, ContactFilters } from '@/types/contact';

// Define the initial state
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

// Create the slice
export const contactsCoreSlice_ForConfiguration = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    // Synchronous actions
    setSelectedContact: (state, action: PayloadAction<Contact | null>) => {
      state.selectedContact = action.payload;
    },
    setSelectedContactIds: (state, action: PayloadAction<string[]>) => {
      state.selectedContactIds = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<ContactFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        status: [],
        type: [],
        tags: []
      };
    },
    resetContacts: (state) => {
      state.contacts = [];
      state.total = 0;
      state.lastFetchTime = null;
    }
  }
});

// Export the actions
export const {
  setSelectedContact,
  setSelectedContactIds,
  setPage,
  setLimit,
  setFilters,
  clearFilters,
  resetContacts
} = contactsCoreSlice_ForConfiguration.actions;
