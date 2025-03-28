
import { createSlice } from '@reduxjs/toolkit';
import { ContactsState } from './contactsTypes';
import { 
  setSelectedContact, 
  clearSelectedContact, 
  setFilters, 
  resetFilters,
  toggleSelectContact,
  clearSelection
} from './contactsActions';
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
    setSelectedContact: (state, action) => setSelectedContact(state, action),
    clearSelectedContact: (state) => clearSelectedContact(state),
    setFilters: (state, action) => setFilters(state, action),
    resetFilters: (state) => resetFilters(state, initialState.filters),
    toggleSelectContact: (state, action) => toggleSelectContact(state, action),
    clearSelection: (state) => clearSelection(state)
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

// Export the selectors
export * from './contactsSelectors';

export default contactsSlice.reducer;
