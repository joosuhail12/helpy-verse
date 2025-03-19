
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
import { updateContactInState } from './contactsReducerUtils';

const initialState: ContactsState = {
  items: [],
  contacts: [],
  contactDetails: null,
  selectedContact: null,
  selectedContacts: [],
  selectedIds: [], // Added missing property
  currentPage: 1, // Added missing property
  totalPages: 1, // Added missing property
  itemsPerPage: 10, // Added missing property
  totalItems: 0, // Added missing property
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
      state.selectedContact = state.items.find(contact => contact.id === action.payload) || null;
    },
    toggleContactSelection: (state, action: PayloadAction<string>) => {
      const contactId = action.payload;
      if (state.selectedIds.includes(contactId)) {
        state.selectedIds = state.selectedIds.filter(id => id !== contactId);
        state.selectedContacts = state.selectedContacts.filter(id => id !== contactId);
      } else {
        state.selectedIds.push(contactId);
        state.selectedContacts.push(contactId);
      }
    },
    clearSelectedContacts: (state) => {
      state.selectedContacts = [];
      state.selectedIds = [];
    },
    selectAllContacts: (state, action: PayloadAction<string[]>) => {
      state.selectedIds = action.payload;
      state.selectedContacts = action.payload;
    },
    deselectAllContacts: (state) => {
      state.selectedContacts = [];
      state.selectedIds = [];
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
      state.currentPage = 1; // Reset to first page when changing items per page
    },
    clearSelection: (state) => {
      state.selectedContacts = [];
      state.selectedIds = [];
    },
    setSelectedContacts: (state, action: PayloadAction<string[]>) => {
      state.selectedContacts = action.payload;
      state.selectedIds = action.payload;
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
          state.contacts = action.payload;
          state.items = action.payload;
          state.totalItems = action.payload.length;
          state.totalPages = Math.ceil(action.payload.length / state.itemsPerPage);
          console.log('Customers fetched:', action.payload.length);
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
      })
      .addCase(fetchContactById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Handle createContact action states
      .addCase(createContact.fulfilled, (state, action) => {
        state.contacts.push(action.payload);
        state.items.push(action.payload);
        state.totalItems = state.items.length;
        state.totalPages = Math.ceil(state.items.length / state.itemsPerPage);
      })
      
      // Handle updateContact action states
      .addCase(updateContact.fulfilled, (state, action) => {
        if (action.payload) {
          const { contactId, data } = action.payload;
          updateContactInState(state, contactId, data);
        }
      })
      
      // Handle updateContactCompany action states
      .addCase(updateContactCompany.fulfilled, (state, action) => {
        if (action.payload) {
          const { contactId, data } = action.payload;
          updateContactInState(state, contactId, data);
        }
      })
      
      // Handle deleteContact action states
      .addCase(deleteContact.fulfilled, (state, action) => {
        const contactId = action.payload;
        state.contacts = state.contacts.filter(c => c.id !== contactId);
        state.items = state.items.filter(c => c.id !== contactId);
        state.totalItems = state.items.length;
        state.totalPages = Math.ceil(state.items.length / state.itemsPerPage);
        if (state.contactDetails && state.contactDetails.id === contactId) {
          state.contactDetails = null;
        }
        state.selectedContacts = state.selectedContacts.filter(id => id !== contactId);
        state.selectedIds = state.selectedIds.filter(id => id !== contactId);
      });
  },
});

export const {
  setFilter,
  setSortField,
  resetFilters,
  selectContact,
  toggleContactSelection,
  clearSelectedContacts,
  clearSelection,
  setSelectedContacts,
  selectAllContacts,
  deselectAllContacts,
  setCurrentPage,
  setItemsPerPage
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

// Re-export selectors from contactsSelectors.ts
export {
  selectContacts,
  selectContactsLoading,
  selectContactsError,
  selectContactDetails,
  selectSelectedContact,
  selectSelectedContacts
} from './contactsSelectors';

export default contactsSlice.reducer;
