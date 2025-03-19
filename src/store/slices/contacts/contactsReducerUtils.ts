
import { ContactsState } from './types';
import { Contact } from '@/types/contact';

export const updateContactInState = (
  state: ContactsState,
  contactId: string,
  data: Partial<Contact>
) => {
  // Update in contacts array
  const contactIndex = state.contacts.findIndex(c => c.id === contactId);
  if (contactIndex !== -1) {
    state.contacts[contactIndex] = { ...state.contacts[contactIndex], ...data };
  }

  // Update in items array
  const itemIndex = state.items.findIndex(c => c.id === contactId);
  if (itemIndex !== -1) {
    state.items[itemIndex] = { ...state.items[itemIndex], ...data };
  }

  // Update selected contact if it's the same one
  if (state.selectedContact && state.selectedContact.id === contactId) {
    state.selectedContact = { ...state.selectedContact, ...data };
  }

  // Update contact details if it's the same one
  if (state.contactDetails && state.contactDetails.id === contactId) {
    state.contactDetails = { ...state.contactDetails, ...data };
  }
};
