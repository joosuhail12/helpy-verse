import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import * as contactsSelectors from './contacts/contactsSelectors';

// This slice is being deprecated in favor of the contacts/contactsSlice.ts
// We're keeping it here with forwarded selectors for backward compatibility

// Create the contact slice (compatibility layer)
const contactSlice = createSlice({
  name: 'legacyContacts',
  initialState: {}, // Empty state as we're just forwarding to the real contacts slice
  reducers: {}
});

// Re-export the selectors from contactsSelectors for backwards compatibility
export {
  contactsSelectors
};

// Export selectors with the old names for backward compatibility
export const selectContacts = contactsSelectors.selectAllContacts;
export const selectContactsLoading = contactsSelectors.selectContactsLoading;
export const selectContactsError = contactsSelectors.selectContactsError;
export const selectContactDetails = contactsSelectors.selectContactDetails;
export const selectSelectedContact = contactsSelectors.selectSelectedContact;
export const selectSelectedContacts = contactsSelectors.selectSelectedContacts;

export default contactSlice.reducer;
