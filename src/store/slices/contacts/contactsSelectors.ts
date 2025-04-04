
import { RootState } from '../../store';

export const selectContacts = (state: RootState) => state.contacts.items;
export const selectContactsLoading = (state: RootState) => state.contacts.loading;
export const selectContactsError = (state: RootState) => state.contacts.error;
export const selectContactDetails = (state: RootState) => state.contacts.contactDetails;
export const selectSelectedContact = (state: RootState) => state.contacts.selectedContact;
export const selectSelectedContacts = (state: RootState) => state.contacts.selectedContacts;
