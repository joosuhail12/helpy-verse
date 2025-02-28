
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { Contact } from '@/types/contact';
import api from '@/services/api';

interface ContactsState {
  items: Contact[];
  selectedContact: Contact | null;
  selectedContacts: string[];
  loading: boolean;
  error: string | null;
  filters: {
    type: string | null;
    status: string | null;
    search: string;
  };
  sort: {
    field: keyof Contact;
    direction: 'asc' | 'desc';
  };
}

const initialState: ContactsState = {
  items: [],
  selectedContact: null,
  selectedContacts: [],
  loading: false,
  error: null,
  filters: {
    type: null,
    status: null,
    search: '',
  },
  sort: {
    field: 'createdAt',
    direction: 'desc',
  }
};

export const fetchContacts = createAsyncThunk(
  'contacts/fetchContacts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/contacts');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchContactById = createAsyncThunk(
  'contacts/fetchContactById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/contacts/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createContact = createAsyncThunk(
  'contacts/createContact',
  async (contact: Partial<Contact>, { rejectWithValue }) => {
    try {
      const response = await api.post('/contacts', contact);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateContact = createAsyncThunk(
  'contacts/updateContact',
  async ({ id, data }: { id: string; data: Partial<Contact> }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/contacts/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteContact = createAsyncThunk(
  'contacts/deleteContact',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/contacts/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const bulkDeleteContacts = createAsyncThunk(
  'contacts/bulkDeleteContacts',
  async (ids: string[], { rejectWithValue }) => {
    try {
      await api.post('/contacts/bulk-delete', { ids });
      return ids;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    setSelectedContact: (state, action: PayloadAction<Contact | null>) => {
      state.selectedContact = action.payload;
    },
    setSelectedContacts: (state, action: PayloadAction<string[]>) => {
      state.selectedContacts = action.payload;
    },
    toggleContactSelection: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.selectedContacts.includes(id)) {
        state.selectedContacts = state.selectedContacts.filter((contactId) => contactId !== id);
      } else {
        state.selectedContacts.push(id);
      }
    },
    clearSelectedContacts: (state) => {
      state.selectedContacts = [];
    },
    setContactFilter: (state, action: PayloadAction<{ key: string; value: string | null }>) => {
      const { key, value } = action.payload;
      if (key in state.filters) {
        (state.filters as any)[key] = value;
      }
    },
    setContactSort: (state, action: PayloadAction<{ field: keyof Contact; direction: 'asc' | 'desc' }>) => {
      state.sort = action.payload;
    },
    updateContactField: (state, action: PayloadAction<{ id: string; field: keyof Contact; value: any }>) => {
      const { id, field, value } = action.payload;
      const contact = state.items.find(contact => contact.id === id);
      if (contact) {
        // Use type assertion to handle dynamic field updates safely
        (contact as any)[field] = value;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
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
        state.error = action.payload as string;
      })
      .addCase(createContact.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        const index = state.items.findIndex(contact => contact.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedContact?.id === action.payload.id) {
          state.selectedContact = action.payload;
        }
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.items = state.items.filter(contact => contact.id !== action.payload);
        if (state.selectedContact?.id === action.payload) {
          state.selectedContact = null;
        }
        state.selectedContacts = state.selectedContacts.filter(id => id !== action.payload);
      })
      .addCase(bulkDeleteContacts.fulfilled, (state, action) => {
        const deletedIds = new Set(action.payload);
        state.items = state.items.filter(contact => !deletedIds.has(contact.id));
        if (state.selectedContact && deletedIds.has(state.selectedContact.id)) {
          state.selectedContact = null;
        }
        state.selectedContacts = state.selectedContacts.filter(id => !deletedIds.has(id));
      });
  }
});

export const {
  setSelectedContact,
  setSelectedContacts,
  toggleContactSelection,
  clearSelectedContacts,
  setContactFilter,
  setContactSort,
  updateContactField
} = contactsSlice.actions;

export default contactsSlice.reducer;
