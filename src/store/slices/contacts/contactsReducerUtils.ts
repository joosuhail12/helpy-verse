
import { Contact } from '@/types/contact';

// Helper function to normalize an array of contacts
export const normalizeContacts = (contacts: Contact[]) => {
  const entities: Record<string, Contact> = {};
  const ids: string[] = [];
  
  contacts.forEach(contact => {
    entities[contact.id] = contact;
    ids.push(contact.id);
  });
  
  return { entities, ids };
};

// Helper function to safely add contact to normalized state
export const addContact = (
  state: { entities: Record<string, Contact>; ids: string[] },
  contact: Contact
) => {
  state.entities[contact.id] = contact;
  if (!state.ids.includes(contact.id)) {
    state.ids.push(contact.id);
  }
};

// Helper function to safely update a contact in normalized state
export const updateContact = (
  state: { entities: Record<string, Contact>; ids: string[] },
  contactId: string,
  contactData: Partial<Contact>
) => {
  if (state.entities[contactId]) {
    state.entities[contactId] = {
      ...state.entities[contactId],
      ...contactData
    };
  }
};

// Helper function to safely delete a contact from normalized state
export const removeContact = (
  state: { entities: Record<string, Contact>; ids: string[] },
  contactId: string
) => {
  delete state.entities[contactId];
  state.ids = state.ids.filter(id => id !== contactId);
};

// Helper function to find a contact by specific criteria
export const findContact = (
  state: { entities: Record<string, Contact>; ids: string[] },
  criteria: (contact: Contact) => boolean
) => {
  return state.ids
    .map(id => state.entities[id])
    .find(contact => criteria(contact as Contact));
};

// Helper function to filter contacts by specific criteria
export const filterContacts = (
  state: { entities: Record<string, Contact>; ids: string[] },
  criteria: (contact: Contact) => boolean
) => {
  return state.ids
    .map(id => state.entities[id])
    .filter(contact => criteria(contact as Contact));
};
