
import { RootState } from '@/store/store';
import { createSelector } from '@reduxjs/toolkit';

// Base selector
const getContactsState = (state: RootState) => state.contacts;

//
// Contact list selectors
//
export const selectAllContacts = createSelector(
  [getContactsState],
  (contactsState) => contactsState.contacts
);

// For convenience in components
export const selectContacts = selectAllContacts;

export const selectPaginatedContacts = createSelector(
  [getContactsState],
  (contactsState) => ({
    contacts: contactsState.contacts,
    total: contactsState.total,
    page: contactsState.page,
    limit: contactsState.limit
  })
);

export const selectContactsTotal = createSelector(
  [getContactsState],
  (contactsState) => contactsState.total
);

export const selectContactsByCompany = createSelector(
  [selectAllContacts, (_, companyId) => companyId],
  (contacts, companyId) => contacts.filter(contact => 
    contact.company !== undefined && String(contact.company) === String(companyId)
  )
);

//
// Individual contact selectors
//
export const selectContactById = createSelector(
  [selectAllContacts, (_, contactId) => contactId],
  (contacts, contactId) => contacts.find((contact) => contact.id === contactId)
);

export const selectContactDetails = createSelector(
  [getContactsState],
  (contactsState) => contactsState.contactDetails
);

export const selectSelectedContact = createSelector(
  [getContactsState],
  (contactsState) => contactsState.selectedContact
);

//
// Selected contacts selectors
//
export const selectSelectedContactIds = createSelector(
  [getContactsState],
  (contactsState) => contactsState.selectedContactIds
);

export const selectSelectedContacts = createSelector(
  [selectAllContacts, selectSelectedContactIds],
  (contacts, selectedIds) => contacts.filter(contact => selectedIds.includes(contact.id))
);

//
// Status selectors
//
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

//
// Filter selectors
//
export const selectContactFilters = createSelector(
  [getContactsState],
  (contactsState) => contactsState.filters
);
