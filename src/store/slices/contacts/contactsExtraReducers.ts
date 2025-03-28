
import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { ContactsState } from './contactsTypes';
import { 
  fetchContacts, 
  fetchContactById
} from './actions/contactsFetch';
import { 
  createContact, 
  updateContact, 
  deleteContact,
  updateContactCompany,
  addContact
} from './actions/contactsManage';

export const buildContactsExtraReducers = (
  builder: ActionReducerMapBuilder<ContactsState>
) => {
  // Add fetch contacts reducers
  builder
    .addCase(fetchContacts.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchContacts.fulfilled, (state, action) => {
      state.loading = false;
      state.contacts = action.payload.data;
      state.total = action.payload.total;
    })
    .addCase(fetchContacts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch contacts';
    });

  // Add fetch contact by ID reducers
  builder
    .addCase(fetchContactById.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchContactById.fulfilled, (state, action) => {
      state.loading = false;
      state.contactDetails = action.payload;
      if (state.selectedContactIds.includes(action.payload.id)) {
        state.selectedContact = action.payload;
      }
    })
    .addCase(fetchContactById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch contact';
    });

  // Add create contact reducers
  builder
    .addCase(createContact.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(createContact.fulfilled, (state, action) => {
      state.loading = false;
      state.contacts.push(action.payload);
    })
    .addCase(createContact.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to create contact';
    });

  // Handle addContact (alias for createContact)
  builder
    .addCase(addContact.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(addContact.fulfilled, (state, action) => {
      state.loading = false;
      state.contacts.push(action.payload);
    })
    .addCase(addContact.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to add contact';
    });

  // Add update contact reducers
  builder
    .addCase(updateContact.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateContact.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.contacts.findIndex(contact => contact.id === action.payload.id);
      if (index !== -1) {
        state.contacts[index] = action.payload;
      }
      if (state.selectedContact && state.selectedContact.id === action.payload.id) {
        state.selectedContact = action.payload;
      }
      if (state.contactDetails && state.contactDetails.id === action.payload.id) {
        state.contactDetails = action.payload;
      }
    })
    .addCase(updateContact.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to update contact';
    });

  // Handle updateContactCompany (specific update case)
  builder
    .addCase(updateContactCompany.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateContactCompany.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.contacts.findIndex(contact => contact.id === action.payload.id);
      if (index !== -1) {
        state.contacts[index] = action.payload;
      }
      if (state.selectedContact && state.selectedContact.id === action.payload.id) {
        state.selectedContact = action.payload;
      }
      if (state.contactDetails && state.contactDetails.id === action.payload.id) {
        state.contactDetails = action.payload;
      }
    })
    .addCase(updateContactCompany.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to update contact company';
    });

  // Add delete contact reducers
  builder
    .addCase(deleteContact.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(deleteContact.fulfilled, (state, action) => {
      state.loading = false;
      state.contacts = state.contacts.filter(contact => contact.id !== action.meta.arg);
      if (state.selectedContact && state.selectedContact.id === action.meta.arg) {
        state.selectedContact = null;
      }
      if (state.contactDetails && state.contactDetails.id === action.meta.arg) {
        state.contactDetails = null;
      }
      state.selectedContactIds = state.selectedContactIds.filter(id => id !== action.meta.arg);
    })
    .addCase(deleteContact.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to delete contact';
    });
};

export const configureExtraReducers = buildContactsExtraReducers;
