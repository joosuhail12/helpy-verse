
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define contact state type
interface ContactState {
  items: any[];
  contactDetails: any | null;
  selectedContact: any | null;
  selectedContacts: string[];
  loading: boolean;
  error: string | null;
  lastFetchTime: number | null;
}

// Initial state
const initialState: ContactState = {
  items: [],
  contactDetails: null,
  selectedContact: null,
  selectedContacts: [],
  loading: false,
  error: null,
  lastFetchTime: null,
};

// Create the contact slice
const contactSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    setSelectedContacts: (state, action) => {
      state.selectedContacts = action.payload;
    },
    clearSelectedContacts: (state) => {
      state.selectedContacts = [];
    },
  },
  extraReducers: (builder) => {
    // Add extra reducers as needed
  },
});

// Export actions and reducer
export const { setSelectedContacts, clearSelectedContacts } = contactSlice.actions;

// Selectors
export const selectContacts = (state: RootState) => state.contacts.items;
export const selectContactsLoading = (state: RootState) => state.contacts.loading;
export const selectContactsError = (state: RootState) => state.contacts.error;
export const selectContactDetails = (state: RootState) => state.contacts.contactDetails;
export const selectSelectedContact = (state: RootState) => state.contacts.selectedContact;
export const selectSelectedContacts = (state: RootState) => state.contacts.selectedContacts;

export default contactSlice.reducer;
