
import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { ContactsState } from './types';
import { 
  fetchContacts, 
  fetchContactById, 
  fetchContactsByCompany 
} from './actions/contactsFetch';
import { 
  createContact, 
  updateContact, 
  deleteContact 
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
      state.contacts = action.payload;
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
      state.selectedContact = action.payload;
    })
    .addCase(fetchContactById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch contact';
    });

  // Add fetch contacts by company reducers
  builder
    .addCase(fetchContactsByCompany.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchContactsByCompany.fulfilled, (state, action) => {
      state.loading = false;
      state.filteredContacts = action.payload;
    })
    .addCase(fetchContactsByCompany.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch contacts by company';
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
    })
    .addCase(updateContact.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to update contact';
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
    })
    .addCase(deleteContact.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to delete contact';
    });
};
