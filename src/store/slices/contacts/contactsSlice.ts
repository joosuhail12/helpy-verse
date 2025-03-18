
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { Contact } from '@/types/contact';

interface ContactsState {
  contacts: Contact[];
  selectedContact: Contact | null;
  loading: boolean;
  error: string | null;
  filters: {
    status: string | null;
    type: string | null;
    tag: string | null;
    searchQuery: string;
  };
  selectedContacts: string[];
}

const initialState: ContactsState = {
  contacts: [],
  selectedContact: null,
  loading: false,
  error: null,
  filters: {
    status: null,
    type: null,
    tag: null,
    searchQuery: '',
  },
  selectedContacts: [],
};

export const fetchContacts = createAsyncThunk(
  'contacts/fetchContacts',
  async (_, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      const response = await fetch('/api/contacts');
      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchContactById = createAsyncThunk(
  'contacts/fetchContactById',
  async (id: string, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      const response = await fetch(`/api/contacts/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch contact');
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateContact = createAsyncThunk(
  'contacts/updateContact',
  async ({ id, data }: { id: string; data: Partial<Contact> }, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update contact');
      }
      const updatedContact = await response.json();
      return updatedContact;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateContactTags = createAsyncThunk(
  'contacts/updateContactTags',
  async ({ id, tags }: { id: string; tags: string[] }, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      const response = await fetch(`/api/contacts/${id}/tags`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tags }),
      });
      if (!response.ok) {
        throw new Error('Failed to update contact tags');
      }
      const updatedContact = await response.json();
      return updatedContact;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<{ key: string; value: string | null }>) => {
      const { key, value } = action.payload;
      (state.filters as any)[key] = value;
    },
    clearFilters: (state) => {
      state.filters = {
        status: null,
        type: null,
        tag: null,
        searchQuery: '',
      };
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.searchQuery = action.payload;
    },
    selectContact: (state, action: PayloadAction<string>) => {
      if (!state.selectedContacts.includes(action.payload)) {
        state.selectedContacts.push(action.payload);
      }
    },
    deselectContact: (state, action: PayloadAction<string>) => {
      state.selectedContacts = state.selectedContacts.filter(id => id !== action.payload);
    },
    clearSelectedContacts: (state) => {
      state.selectedContacts = [];
    },
  },
  extraReducers: (builder) => {
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
      .addCase(updateContact.fulfilled, (state, action) => {
        const index = state.contacts.findIndex(contact => contact.id === action.payload.id);
        if (index !== -1) {
          state.contacts[index] = action.payload;
        }
        if (state.selectedContact && state.selectedContact.id === action.payload.id) {
          state.selectedContact = action.payload;
        }
      })
      .addCase(updateContactTags.fulfilled, (state, action) => {
        const index = state.contacts.findIndex(contact => contact.id === action.payload.id);
        if (index !== -1) {
          state.contacts[index] = action.payload;
        }
        if (state.selectedContact && state.selectedContact.id === action.payload.id) {
          state.selectedContact = action.payload;
        }
      });
  },
});

export const { 
  setFilter, 
  clearFilters, 
  setSearchQuery,
  selectContact,
  deselectContact,
  clearSelectedContacts
} = contactsSlice.actions;

export default contactsSlice.reducer;
