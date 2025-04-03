
import { ContactsState } from './types';

export const addContact = (state: ContactsState, contact: any) => {
  state.contacts.push(contact);
};

export const updateContact = (state: ContactsState, contactId: string, updatedData: any) => {
  const contactIndex = state.contacts.findIndex(c => c.id === contactId);
  if (contactIndex !== -1) {
    state.contacts[contactIndex] = { ...state.contacts[contactIndex], ...updatedData };
  }
  
  if (state.contactDetails && state.contactDetails.id === contactId) {
    state.contactDetails = { ...state.contactDetails, ...updatedData };
  }
};

export const removeContact = (state: ContactsState, contactId: string) => {
  state.contacts = state.contacts.filter(c => c.id !== contactId);
  
  if (state.contactDetails && state.contactDetails.id === contactId) {
    state.contactDetails = null;
  }
  
  if (state.selectedContact === contactId) {
    state.selectedContact = null;
  }
  
  state.selectedContacts = state.selectedContacts.filter(id => id !== contactId);
};
