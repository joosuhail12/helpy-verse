
import { RootState } from '@/store/store';

// Basic selectors
export const selectContacts = (state: RootState) => state.contacts.contacts;
export const selectContactsLoading = (state: RootState) => state.contacts.loading;
export const selectContactsError = (state: RootState) => state.contacts.error;
export const selectContactsTotal = (state: RootState) => state.contacts.total;
export const selectContactsPagination = (state: RootState) => ({
  page: state.contacts.page,
  limit: state.contacts.limit,
});
export const selectContactsFilters = (state: RootState) => state.contacts.filters;
export const selectSelectedContact = (state: RootState) => state.contacts.selectedContact;
export const selectSelectedContactIds = (state: RootState) => state.contacts.selectedContactIds;
export const selectContactDetails = (state: RootState) => state.contacts.contactDetails;

// Memoized selectors could be added here if needed
