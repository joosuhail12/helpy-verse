
import { RootState } from '@/store/store';
import { createSelector } from '@reduxjs/toolkit';

// Base selector
const getContactsState = (state: RootState) => state.contacts;

// Memoized selectors
export const selectAllContacts = createSelector(
  [getContactsState],
  (contactsState) => contactsState.contacts
);

export const selectContactById = createSelector(
  [selectAllContacts, (_, contactId) => contactId],
  (contacts, contactId) => contacts.find((contact) => contact.id === contactId)
);

export const selectContactLoading = createSelector(
  [getContactsState],
  (contactsState) => contactsState.loading
);

export const selectContactsLoading = selectContactLoading;

export const selectContactError = createSelector(
  [getContactsState],
  (contactsState) => contactsState.error
);

export const selectContactsError = selectContactError;

export const selectSelectedContact = createSelector(
  [getContactsState],
  (contactsState) => contactsState.selectedContact
);

export const selectContactsTotal = createSelector(
  [getContactsState],
  (contactsState) => contactsState.total
);

export const selectPaginatedContacts = createSelector(
  [getContactsState],
  (contactsState) => ({
    contacts: contactsState.contacts,
    total: contactsState.total,
    page: contactsState.page,
    limit: contactsState.limit
  })
);

export const selectContactsByCompany = createSelector(
  [selectAllContacts, (_, companyId) => companyId],
  (contacts, companyId) => contacts.filter(contact => 
    contact.company !== undefined && String(contact.company) === String(companyId)
  )
);

export const selectContactFilters = createSelector(
  [getContactsState],
  (contactsState) => contactsState.filters
);

export const selectSelectedContactIds = createSelector(
  [getContactsState],
  (contactsState) => contactsState.selectedContactIds
);

export const selectContactDetails = createSelector(
  [getContactsState],
  (contactsState) => contactsState.contactDetails
);

// For convenience in components
export const selectContacts = selectAllContacts;
