
import { Contact } from '@/types/contact';
import { ContactsState } from './types';

/**
 * Updates contact in normalized state
 */
export const updateContactInState = (
  state: ContactsState, 
  contactId: string, 
  updates: Partial<Contact>
): void => {
  // Update in entities
  if (state.entities[contactId]) {
    state.entities[contactId] = {
      ...state.entities[contactId],
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

/**
 * Adds a new contact to the normalized state
 */
export const addContactToState = (
  state: ContactsState,
  contact: Contact
): void => {
  // Add to entities
  state.entities[contact.id] = contact;
  
  // Add to ids if not already there
  if (!state.ids.includes(contact.id)) {
    state.ids.push(contact.id);
  }
};

/**
 * Removes a contact from the normalized state
 */
export const removeContactFromState = (
  state: ContactsState,
  contactId: string
): void => {
  // Remove from entities
  delete state.entities[contactId];
  
  // Remove from ids
  state.ids = state.ids.filter(id => id !== contactId);
  
  // Clear selection if needed
  if (state.selectedContactId === contactId) {
    state.selectedContactId = null;
  }
  
  // Remove from selected contacts
  state.selectedContactIds = state.selectedContactIds.filter(id => id !== contactId);
  
  // Clear contact details if it's the current contact
  if (state.contactDetails?.id === contactId) {
    state.contactDetails = null;
  }
};
