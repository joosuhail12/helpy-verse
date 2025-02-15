
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { ContactsState } from './types';
import { mockContacts } from './mockData';
import { CACHE_DURATION } from './types';
import type { Contact } from '@/types/contact';

const initialState: ContactsState = {
  contacts: [],
  loading: false,
  error: null,
  selectedContacts: [],
  lastFetchTime: null,
};

export const fetchContacts = createAsyncThunk(
  'contacts/fetchContacts',
  async (_, { getState }) => {
    const state = getState() as { contacts: ContactsState };
    
    if (state.contacts.lastFetchTime) {
      const timeSinceLastFetch = Date.now() - state.contacts.lastFetchTime;
      if (timeSinceLastFetch < CACHE_DURATION) {
        return state.contacts.contacts;
      }
    }

    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    return mockContacts;
  }
);

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    setSelectedContacts: (state, action) => {
      state.selectedContacts = action.payload;
    },
    toggleContactSelection: (state, action) => {
      const contactId = action.payload;
      const index = state.selectedContacts.indexOf(contactId);
      if (index === -1) {
        state.selectedContacts.push(contactId);
      } else {
        state.selectedContacts.splice(index, 1);
      }
    },
    addContact: (state, action) => {
      state.contacts.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload;
        state.lastFetchTime = Date.now();
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch contacts';
      });
  },
});

export const { setSelectedContacts, toggleContactSelection, addContact } = contactsSlice.actions;
export default contactsSlice.reducer;
