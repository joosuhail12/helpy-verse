
import { createSlice } from '@reduxjs/toolkit';
import { ContactsState } from './contactsTypes';
import { buildContactsExtraReducers } from './contactsExtraReducers';
import { contactsCoreSlice_ForConfiguration } from './actions/contactsCore';

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

// Create the slice by extending the core slice with async reducers
const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    ...contactsCoreSlice_ForConfiguration.caseReducers,
  },
  extraReducers: (builder) => buildContactsExtraReducers(builder)
});

// Export the actions from the dedicated files
export * from './actions';

// Export the reducer
export default contactsSlice.reducer;
