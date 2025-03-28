
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Contact } from '@/types/contact';
import { ContactsState } from './types';
import {
  fetchCustomers,
  fetchContactById,
  fetchContactDetails,
  createContact,
  addContact,
  updateContact,
  updateContactCompany,
  deleteContact
} from './contactsActions';
import * as contactsSelectors from './contactsSelectors';

const initialState: ContactsState = {
  entities: {},
  ids: [],
  contactDetails: null,
  selectedContactId: null,
  selectedContactIds: [],
  loading: false,
  error: null,
  lastFetchTime: null,
  filters: {
    type: null,
    status: null,
    search: '',
  },
  sort: {
    field: 'createdAt',
    direction: 'desc',
  },
};

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<{ key: keyof ContactsState['filters']; value: string | null }>) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
    },
    setSortField: (state, action: PayloadAction<keyof Contact>) => {
      if (state.sort.field === action.payload) {
        state.sort.direction = state.sort.direction === 'asc' ? 'desc' : 'asc';
      } else {
        state.sort.field = action.payload;
        state.sort.direction = 'asc';
      }
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    selectContact: (state, action: PayloadAction<string>) => {
      state.selectedContactId = action.payload;
    },
    toggleSelectContact: (state, action: PayloadAction<string>) => {
      const contactId = action.payload;
      if (state.selectedContactIds.includes(contactId)) {
        state.selectedContactIds = state.selectedContactIds.filter(id => id !== contactId);
      } else {
        state.selectedContactIds.push(contactId);
      }
    },
    clearSelectedContacts: (state) => {
      state.selectedContactIds = [];
    },
    clearSelection: (state) => {
      state.selectedContactIds = [];
    },
    setSelectedContacts: (state, action: PayloadAction<string[]>) => {
      state.selectedContactIds = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchCustomers action states
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          // Normalize contacts data
          const entities: Record<string, Contact> = {};
          const ids: string[] = [];
          
          action.payload.forEach((contact: Contact) => {
            entities[contact.id] = contact;
            ids.push(contact.id);
          });
          
          state.entities = entities;
          state.ids = ids;
          console.log('Customers fetched:', ids.length);
        }
        state.lastFetchTime = Date.now();
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error('Failed to fetch customers:', action.payload);
      })
      
      // Handle fetchContactById action states
      .addCase(fetchContactById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactById.fulfilled, (state, action) => {
        state.loading = false;
        state.contactDetails = action.payload;
        
        // Also update the contact in the entities
        if (action.payload) {
          state.entities[action.payload.id] = action.payload;
          if (!state.ids.includes(action.payload.id)) {
            state.ids.push(action.payload.id);
          }
        }
      })
      .addCase(fetchContactById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Handle createContact action states
      .addCase(createContact.fulfilled, (state, action) => {
        const newContact = action.payload;
        // Add to normalized store
        state.entities[newContact.id] = newContact;
        if (!state.ids.includes(newContact.id)) {
          state.ids.push(newContact.id);
        }
      })
      
      // Handle updateContact action states
      .addCase(updateContact.fulfilled, (state, action) => {
        if (action.payload) {
          const { contactId, data } = action.payload;
          // Update in normalized store
          state.entities[contactId] = { ...state.entities[contactId], ...data };
          
          // Update contactDetails if it's the current contact
          if (state.contactDetails && state.contactDetails.id === contactId) {
            state.contactDetails = { ...state.contactDetails, ...data };
          }
        }
      })
      
      // Handle updateContactCompany action states
      .addCase(updateContactCompany.fulfilled, (state, action) => {
        if (action.payload) {
          const { contactId, data } = action.payload;
          // Update in normalized store
          state.entities[contactId] = { ...state.entities[contactId], ...data };
          
          // Update contactDetails if it's the current contact
          if (state.contactDetails && state.contactDetails.id === contactId) {
            state.contactDetails = { ...state.contactDetails, ...data };
          }
        }
      })
      
      // Handle deleteContact action states
      .addCase(deleteContact.fulfilled, (state, action) => {
        const contactId = action.payload;
        // Remove from normalized store
        delete state.entities[contactId];
        state.ids = state.ids.filter(id => id !== contactId);
        
        // Clean up references
        if (state.contactDetails && state.contactDetails.id === contactId) {
          state.contactDetails = null;
        }
        
        state.selectedContactIds = state.selectedContactIds.filter(id => id !== contactId);
        
        if (state.selectedContactId === contactId) {
          state.selectedContactId = null;
        }
      });
  },
});

export const {
  setFilter,
  setSortField,
  resetFilters,
  selectContact,
  toggleSelectContact,
  clearSelectedContacts,
  clearSelection,
  setSelectedContacts
} = contactsSlice.actions;

// Re-export actions from contactsActions.ts
export {
  fetchCustomers,
  fetchContactById,
  fetchContactDetails,
  createContact,
  addContact,
  updateContact,
  updateContactCompany,
  deleteContact
};

// Export all selectors
export {
  contactsSelectors
};

// For direct imports without namespace
export const { 
  selectAllContacts,
  selectContactsLoading,
  selectContactsError,
  selectContactDetails,
  selectSelectedContact,
  selectSelectedContacts,
  selectContactById,
  selectContactsByCompany,
  selectFilteredContacts,
  selectSortedContacts
} = contactsSelectors;

export default contactsSlice.reducer;
