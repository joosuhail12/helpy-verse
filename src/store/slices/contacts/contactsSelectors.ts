
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import type { Contact } from '@/types/contact';
import { ContactsState } from './types';

// Base selector
const getContactsState = (state: RootState) => state.contacts;

// Memoized selectors for normalized state
export const selectContactIds = createSelector(
  [getContactsState],
  (contactsState) => contactsState.ids
);

export const selectContactEntities = createSelector(
  [getContactsState],
  (contactsState) => contactsState.entities
);

export const selectAllContacts = createSelector(
  [selectContactIds, selectContactEntities],
  (ids, entities) => ids.map(id => entities[id])
);

export const selectContactsLoading = createSelector(
  [getContactsState],
  (contactsState) => contactsState.loading
);

export const selectContactsError = createSelector(
  [getContactsState],
  (contactsState) => contactsState.error
);

export const selectContactDetails = createSelector(
  [getContactsState],
  (contactsState) => contactsState.contactDetails
);

export const selectSelectedContactId = createSelector(
  [getContactsState],
  (contactsState) => contactsState.selectedContactId
);

export const selectSelectedContact = createSelector(
  [selectContactEntities, selectSelectedContactId],
  (entities, selectedId) => selectedId ? entities[selectedId] : null
);

export const selectSelectedContactIds = createSelector(
  [getContactsState],
  (contactsState) => contactsState.selectedContactIds
);

export const selectSelectedContacts = createSelector(
  [selectContactEntities, selectSelectedContactIds],
  (entities, selectedIds) => selectedIds.map(id => entities[id]).filter(Boolean)
);

// Parameterized selectors
export const selectContactById = createSelector(
  [selectContactEntities, (_, contactId: string) => contactId],
  (entities, contactId) => entities[contactId] || null
);

export const selectContactsByCompany = createSelector(
  [selectAllContacts, (_, companyId: string) => companyId],
  (contacts, companyId) => contacts.filter(contact => contact.company === companyId)
);

export const selectFilteredContacts = createSelector(
  [selectAllContacts, (state: RootState) => state.contacts.filters],
  (contacts, filters) => {
    let result = [...contacts];
    
    if (filters.type) {
      result = result.filter(contact => contact.type === filters.type);
    }
    
    if (filters.status) {
      result = result.filter(contact => contact.status === filters.status);
    }
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(contact => 
        contact.firstname.toLowerCase().includes(search) ||
        contact.lastname.toLowerCase().includes(search) ||
        contact.email.toLowerCase().includes(search)
      );
    }
    
    return result;
  }
);

export const selectSortedContacts = createSelector(
  [selectFilteredContacts, (state: RootState) => state.contacts.sort],
  (contacts, sort) => {
    const { field, direction } = sort;
    return [...contacts].sort((a, b) => {
      const valueA = a[field];
      const valueB = b[field];
      
      if (valueA < valueB) {
        return direction === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
);
