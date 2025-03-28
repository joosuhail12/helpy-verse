
import { Contact } from '@/types/contact';
import { ContactsState } from './types';

/**
 * Updates contact in all relevant state arrays
 */
export const updateContactInState = (
  state: ContactsState, 
  contactId: string, 
  updates: Partial<Contact>
): void => {
  // Update in contacts array
  const contactIndex = state.contacts.findIndex(c => c.id === contactId);
  if (contactIndex !== -1) {
    state.contacts[contactIndex] = {
      ...state.contacts[contactIndex],
      ...updates
    };
  }

  // Update in items array
  const itemIndex = state.items.findIndex(c => c.id === contactId);
  if (itemIndex !== -1) {
    state.items[itemIndex] = {
      ...state.items[itemIndex],
      ...updates
    };
  }

  // Update in contactDetails if it's the current selected contact
  if (state.contactDetails && state.contactDetails.id === contactId) {
    state.contactDetails = {
      ...state.contactDetails,
      ...updates
    };
  }
};
