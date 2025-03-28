
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Contact, ContactFilters } from '@/types/contact';
import { ContactsState } from '../contactsTypes';

// Define the initial state for contact core functionality
const initialState: Partial<ContactsState> = {
  selectedContact: null,
  selectedContactIds: [],
  filters: {
    search: '',
    status: [],
    type: [],
    tags: []
  }
};

// Create a slice for core contact actions
const contactsCoreSlice = createSlice({
  name: 'contacts',
  initialState: initialState as ContactsState,
  reducers: {
    'contacts/selectContact': (state, action: PayloadAction<Contact>) => {
      state.selectedContact = action.payload;
    },
    'contacts/clearSelectedContact': (state) => {
      state.selectedContact = null;
    },
    'contacts/setFilters': (state, action: PayloadAction<ContactFilters>) => {
      state.filters = action.payload;
    },
    'contacts/resetFilters': (state) => {
      state.filters = initialState.filters as ContactFilters;
    },
    'contacts/toggleSelectContact': (state, action: PayloadAction<string>) => {
      if (state.selectedContactIds.includes(action.payload)) {
        state.selectedContactIds = state.selectedContactIds.filter(id => id !== action.payload);
      } else {
        state.selectedContactIds.push(action.payload);
      }
    },
    'contacts/clearSelection': (state) => {
      state.selectedContactIds = [];
    }
  }
});

// Export the actions with consistent naming
export const {
  'contacts/selectContact': selectContact,
  'contacts/clearSelectedContact': clearSelectedContact,
  'contacts/setFilters': setFilters,
  'contacts/resetFilters': resetFilters,
  'contacts/toggleSelectContact': toggleSelectContact,
  'contacts/clearSelection': clearSelection
} = contactsCoreSlice.actions;

// Export the reducer functions for potential reuse
export const contactsCoreReducers = contactsCoreSlice.caseReducers;

// Export the slice for configuration
export const contactsCoreSlice_ForConfiguration = contactsCoreSlice;
