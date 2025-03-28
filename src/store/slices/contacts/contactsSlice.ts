
import { createSlice } from '@reduxjs/toolkit';
import { ContactsState } from './contactsTypes';
import { configureExtraReducers } from './contactsExtraReducers';

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
const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    setSelectedContact: (state, action) => {
      state.selectedContact = action.payload;
    },
    clearSelectedContact: (state) => {
      state.selectedContact = null;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    toggleSelectContact: (state, action) => {
      if (state.selectedContactIds.includes(action.payload)) {
        state.selectedContactIds = state.selectedContactIds.filter(id => id !== action.payload);
      } else {
        state.selectedContactIds.push(action.payload);
      }
    },
    clearSelection: (state) => {
      state.selectedContactIds = [];
    }
  },
  extraReducers: (builder) => configureExtraReducers(builder)
});

// Export actions
export const { 
  setSelectedContact, 
  clearSelectedContact,
  setFilters,
  resetFilters,
  toggleSelectContact,
  clearSelection
} = contactsSlice.actions;

// Export thunks
export * from './contactsThunks';

// Export the reducer
export default contactsSlice.reducer;
