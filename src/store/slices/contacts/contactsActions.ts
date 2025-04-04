
import { PayloadAction } from '@reduxjs/toolkit';
import { Contact, ContactFilters } from '@/types/contact';
import { ContactsState } from './contactsTypes';

// These are separate implementations of the reducers defined in contactsSlice
// Currently they are not being used directly, but defined here for potential future refactoring
export const setSelectedContactReducer = (state: ContactsState, action: PayloadAction<Contact>) => {
  state.selectedContact = action.payload;
};

export const clearSelectedContactReducer = (state: ContactsState) => {
  state.selectedContact = null;
};

export const setFiltersReducer = (state: ContactsState, action: PayloadAction<ContactFilters>) => {
  state.filters = action.payload;
};

export const resetFiltersReducer = (state: ContactsState, initialFilters: ContactFilters) => {
  state.filters = initialFilters;
};

export const toggleSelectContactReducer = (state: ContactsState, action: PayloadAction<string>) => {
  if (state.selectedContactIds.includes(action.payload)) {
    state.selectedContactIds = state.selectedContactIds.filter(id => id !== action.payload);
  } else {
    state.selectedContactIds.push(action.payload);
  }
};

export const clearSelectionReducer = (state: ContactsState) => {
  state.selectedContactIds = [];
};
