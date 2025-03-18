
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Contact } from '@/types/contact';

interface ContactsState {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  selectedContact: Contact | null;
  selectedContacts: string[];
}

const initialState: ContactsState = {
  contacts: [],
  loading: false,
  error: null,
  selectedContact: null,
  selectedContacts: []
};

export const fetchCustomers = createAsyncThunk(
  'contacts/fetchCustomers',
  async (_, { rejectWithValue }) => {
    try {
      // Mock API call
      return await new Promise<Contact[]>(resolve => {
        setTimeout(() => {
          resolve([]);
        }, 500);
      });
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateContact = createAsyncThunk(
  'contacts/updateContact',
  async ({ contactId, data }: { contactId: string; data: Partial<Contact> }, { rejectWithValue }) => {
    try {
      // Mock API call
      return await new Promise<Contact>(resolve => {
        setTimeout(() => {
          resolve({ id: contactId, ...data } as Contact);
        }, 500);
      });
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateContactCompany = createAsyncThunk(
  'contacts/updateContactCompany',
  async ({ contactId, companyId }: { contactId: string; companyId: string | null }, { rejectWithValue }) => {
    try {
      // Mock API call
      return await new Promise<{ contactId: string; companyId: string | null }>(resolve => {
        setTimeout(() => {
          resolve({ contactId, companyId });
        }, 500);
      });
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    selectContact: (state, action: PayloadAction<string>) => {
      const contact = state.contacts.find(c => c.id === action.payload);
      state.selectedContact = contact || null;
    },
    deselectContact: (state) => {
      state.selectedContact = null;
    },
    toggleSelection: (state, action: PayloadAction<string>) => {
      const contactId = action.payload;
      const index = state.selectedContacts.indexOf(contactId);
      
      if (index === -1) {
        state.selectedContacts.push(contactId);
      } else {
        state.selectedContacts.splice(index, 1);
      }
    },
    selectAllContacts: (state) => {
      state.selectedContacts = state.contacts.map(contact => contact.id);
    },
    clearSelection: (state) => {
      state.selectedContacts = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        const updatedContact = action.payload;
        const index = state.contacts.findIndex(c => c.id === updatedContact.id);
        
        if (index !== -1) {
          state.contacts[index] = {
            ...state.contacts[index],
            ...updatedContact
          };
          
          if (state.selectedContact?.id === updatedContact.id) {
            state.selectedContact = {
              ...state.selectedContact,
              ...updatedContact
            };
          }
        }
      })
      .addCase(updateContactCompany.fulfilled, (state, action) => {
        const { contactId, companyId } = action.payload;
        const index = state.contacts.findIndex(c => c.id === contactId);
        
        if (index !== -1) {
          state.contacts[index] = {
            ...state.contacts[index],
            company: companyId
          };
          
          if (state.selectedContact?.id === contactId) {
            state.selectedContact = {
              ...state.selectedContact,
              company: companyId
            };
          }
        }
      });
  }
});

export const { 
  selectContact, 
  deselectContact,
  toggleSelection,
  selectAllContacts, 
  clearSelection 
} = contactsSlice.actions;

export default contactsSlice.reducer;
