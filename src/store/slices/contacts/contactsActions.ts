
import { PayloadAction } from '@reduxjs/toolkit';
import { Contact, ContactFilters } from '@/types/contact';
import { ContactsState } from './contactsTypes';

// Action creators for the slice
export const setSelectedContact = (state: ContactsState, action: PayloadAction<Contact>) => {
  state.selectedContact = action.payload;
};

export const clearSelectedContact = (state: ContactsState) => {
  state.selectedContact = null;
};

export const setFilters = (state: ContactsState, action: PayloadAction<ContactFilters>) => {
  state.filters = action.payload;
};

export const resetFilters = (state: ContactsState, initialFilters: ContactFilters) => {
  state.filters = initialFilters;
};

export const toggleSelectContact = (state: ContactsState, action: PayloadAction<string>) => {
  if (state.selectedContactIds.includes(action.payload)) {
    state.selectedContactIds = state.selectedContactIds.filter(id => id !== action.payload);
  } else {
    state.selectedContactIds.push(action.payload);
  }
};

export const clearSelection = (state: ContactsState) => {
  state.selectedContactIds = [];
};
