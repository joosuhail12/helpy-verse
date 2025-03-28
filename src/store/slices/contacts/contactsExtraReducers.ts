
import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { ContactsState } from './contactsTypes';
import { 
  fetchContacts, 
  fetchContactById, 
  updateContact, 
  addContact 
} from './actions/contactsFetch';

// Utility function to update a contact in the state array
export const updateContactInState = (
  contacts: any[],
  contactId: string,
  updatedContact: any
) => {
  return contacts.map(contact => 
    contact.id === contactId ? updatedContact : contact
  );
};

// Configure extra reducers for the async thunks
export const configureExtraReducers = (builder: ActionReducerMapBuilder<ContactsState>) => {
  builder
    // fetchContacts
    .addCase(fetchContacts.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchContacts.fulfilled, (state, action) => {
      state.loading = false;
      state.contacts = action.payload.data;
      state.total = action.payload.total;
      state.lastFetchTime = Date.now();
    })
    .addCase(fetchContacts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // fetchContactById
    .addCase(fetchContactById.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchContactById.fulfilled, (state, action) => {
      state.loading = false;
      state.contactDetails = action.payload;
    })
    .addCase(fetchContactById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // updateContact
    .addCase(updateContact.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateContact.fulfilled, (state, action) => {
      state.loading = false;
      // Update in contacts array
      state.contacts = updateContactInState(
        state.contacts, 
        action.payload.id, 
        action.payload
      );
      
      // Update contactDetails if it's the one updated
      if (state.contactDetails && state.contactDetails.id === action.payload.id) {
        state.contactDetails = action.payload;
      }
      // Update selectedContact if it's the one updated
      if (state.selectedContact && state.selectedContact.id === action.payload.id) {
        state.selectedContact = action.payload;
      }
    })
    .addCase(updateContact.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // addContact
    .addCase(addContact.fulfilled, (state, action) => {
      state.contacts.push(action.payload);
      state.total += 1;
    });
};
