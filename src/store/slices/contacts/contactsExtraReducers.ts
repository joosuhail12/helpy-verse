
import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { ContactsState } from './contactsTypes';
import * as contactsActions from './actions';

export const buildContactsExtraReducers = (builder: ActionReducerMapBuilder<ContactsState>) => {
  // Fetch contacts
  builder
    .addCase(contactsActions.fetchContacts.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(contactsActions.fetchContacts.fulfilled, (state, action) => {
      state.loading = false;
      state.contacts = action.payload.data;
      state.total = action.payload.total;
      state.lastFetchTime = Date.now();
    })
    .addCase(contactsActions.fetchContacts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch contacts';
    });

  // Fetch contact details
  builder
    .addCase(contactsActions.fetchContactDetails.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(contactsActions.fetchContactDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.contactDetails = action.payload;
    })
    .addCase(contactsActions.fetchContactDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch contact details';
    });

  // Update contact
  builder
    .addCase(contactsActions.updateContact.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(contactsActions.updateContact.fulfilled, (state, action) => {
      state.loading = false;
      // Update in contacts list if present
      state.contacts = state.contacts.map(contact => 
        contact.id === action.payload.id ? action.payload : contact
      );
      // Update contactDetails if it's the same contact
      if (state.contactDetails && state.contactDetails.id === action.payload.id) {
        state.contactDetails = action.payload;
      }
    })
    .addCase(contactsActions.updateContact.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to update contact';
    });

  // Create contact
  builder
    .addCase(contactsActions.createContact.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(contactsActions.createContact.fulfilled, (state, action) => {
      state.loading = false;
      state.contacts = [action.payload, ...state.contacts];
      state.total += 1;
    })
    .addCase(contactsActions.createContact.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to create contact';
    });

  // Delete contact
  builder
    .addCase(contactsActions.deleteContact.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(contactsActions.deleteContact.fulfilled, (state, action) => {
      state.loading = false;
      state.contacts = state.contacts.filter(contact => contact.id !== action.payload);
      state.total -= 1;
      // Clear contactDetails if it's the deleted contact
      if (state.contactDetails && state.contactDetails.id === action.payload) {
        state.contactDetails = null;
      }
      // Remove from selected contacts if present
      state.selectedContactIds = state.selectedContactIds.filter(id => id !== action.payload);
    })
    .addCase(contactsActions.deleteContact.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to delete contact';
    });
};
