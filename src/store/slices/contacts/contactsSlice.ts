
import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchCustomers, 
  fetchContactById, 
  createContact, 
  updateContact, 
  deleteContact,
  updateContactCompany
} from './contactsActions';

export interface ContactsState {
  contacts: any[];
  items: any[];
  contactDetails: any | null;
  selectedContact: string | null;
  selectedContacts: string[];
  loading: boolean;
  error: string | null;
  lastFetchTime: number | null;
}

const initialState: ContactsState = {
  contacts: [],
  items: [],
  contactDetails: null,
  selectedContact: null,
  selectedContacts: [],
  loading: false,
  error: null,
  lastFetchTime: null,
};

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    selectContact: (state, action) => {
      state.selectedContact = action.payload;
    },
    clearSelectedContact: (state) => {
      state.selectedContact = null;
    },
    toggleSelectContact: (state, action) => {
      const contactId = action.payload;
      const index = state.selectedContacts.indexOf(contactId);
      if (index !== -1) {
        state.selectedContacts.splice(index, 1);
      } else {
        state.selectedContacts.push(contactId);
      }
    },
    setSelectedContacts: (state, action) => {
      state.selectedContacts = action.payload;
    },
    clearSelection: (state) => {
      state.selectedContacts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch customers
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload !== null) {
          state.contacts = action.payload;
          state.items = action.payload;
          state.lastFetchTime = Date.now();
        }
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch contact by ID
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
      
      // Create contact
      .addCase(createContact.fulfilled, (state, action) => {
        state.contacts.push(action.payload);
        state.items.push(action.payload);
      })
      
      // Update contact
      .addCase(updateContact.fulfilled, (state, action) => {
        const { contactId, data } = action.payload;
        
        // Update in contacts array
        const contactIndex = state.contacts.findIndex(c => c.id === contactId);
        if (contactIndex !== -1) {
          state.contacts[contactIndex] = data;
        }
        
        // Update in items array
        const itemIndex = state.items.findIndex(c => c.id === contactId);
        if (itemIndex !== -1) {
          state.items[itemIndex] = data;
        }
        
        // Update contact details if it's the currently selected contact
        if (state.contactDetails && state.contactDetails.id === contactId) {
          state.contactDetails = data;
        }
      })
      
      // Update contact company
      .addCase(updateContactCompany.fulfilled, (state, action) => {
        const { contactId, data } = action.payload;
        
        // Update in contacts array
        const contactIndex = state.contacts.findIndex(c => c.id === contactId);
        if (contactIndex !== -1) {
          state.contacts[contactIndex] = data;
        }
        
        // Update in items array
        const itemIndex = state.items.findIndex(c => c.id === contactId);
        if (itemIndex !== -1) {
          state.items[itemIndex] = data;
        }
        
        // Update contact details if it's the currently selected contact
        if (state.contactDetails && state.contactDetails.id === contactId) {
          state.contactDetails = data;
        }
      })
      
      // Delete contact
      .addCase(deleteContact.fulfilled, (state, action) => {
        const contactId = action.payload;
        state.contacts = state.contacts.filter(c => c.id !== contactId);
        state.items = state.items.filter(c => c.id !== contactId);
        if (state.contactDetails && state.contactDetails.id === contactId) {
          state.contactDetails = null;
        }
        state.selectedContacts = state.selectedContacts.filter(id => id !== contactId);
      });
  },
});

export const { 
  selectContact, 
  clearSelectedContact, 
  toggleSelectContact, 
  setSelectedContacts, 
  clearSelection 
} = contactsSlice.actions;

export default contactsSlice.reducer;
