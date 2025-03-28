
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';

// Base selector
const getContactsState = (state: RootState) => state.contacts;

// Memoized selectors
export const selectContacts = createSelector(
  [getContactsState],
  (state) => state.items
);

export const selectContactsLoading = createSelector(
  [getContactsState],
  (state) => state.loading
);

export const selectContactsError = createSelector(
  [getContactsState],
  (state) => state.error
);

export const selectContactDetails = createSelector(
  [getContactsState],
  (state) => state.contactDetails
);

export const selectSelectedContact = createSelector(
  [getContactsState],
  (state) => state.selectedContact
);

export const selectSelectedContacts = createSelector(
  [getContactsState],
  (state) => state.selectedContacts
);

export const selectContactById = createSelector(
  [selectContacts, (_, id: string) => id],
  (contacts, id) => contacts.find(contact => contact.id === id) || null
);
