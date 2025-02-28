
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { ContactsState } from './types';
import type { Contact } from '@/types/contact';
import { CreateCustomerData, customerService } from '@/api/services/customerService';

const initialState: ContactsState = {
  contacts: [],
  contactDetails: null,
  loading: false,
  error: null,
  selectedContacts: [],
  lastFetchTime: null,
};

// ✅ Fetch customers from API
export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await customerService.fetchCustomers();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch customers');
    }
  }
);

// ✅ Get customer details
export const fetchCustomerDetails = createAsyncThunk(
  'customers/fetchCustomerDetails',
  async (customer_id: string, { rejectWithValue }) => {
    try {
      const customer = await customerService.getCustomerDetails(customer_id);
      return customer.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch customer details');
    }
  }
);

// ✅ Create a new customer
export const createCustomer = createAsyncThunk(
  'customers/createCustomer',
  async (customerData: Partial<Contact> & { workspace_id: string }, { rejectWithValue }) => {
    try {
      // Ensure required fields are strictly strings
      const formattedCustomerData: CreateCustomerData = {
        firstname: String(customerData.firstname || ''),
        lastname: String(customerData.lastname || ''),
        email: String(customerData.email || ''),
        workspace_id: customerData.workspace_id,
        type: customerData.type ? String(customerData.type) : undefined,
        phone: customerData.phone ? String(customerData.phone) : undefined,
        phoneCountry: customerData.phoneCountry ? String(customerData.phoneCountry) : undefined,
        companyId: customerData.companyId ? String(customerData.companyId) : undefined,
      };

      const newCustomer = await customerService.createCustomer(formattedCustomerData);
      return newCustomer;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create customer');
    }
  }
);

// ✅ Update a customer
export const updateCustomer = createAsyncThunk(
  'customers/updateCustomer',
  async (customerData: Partial<Contact> & { customer_id: string }, { rejectWithValue }) => {
    try {
      const updatedCustomer = await customerService.updateCustomer(customerData.customer_id, customerData);
      return updatedCustomer.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update customer');
    }
  }
);


// ✅ Import customers from CSV
export const importCustomers = createAsyncThunk(
  'customers/importCustomers',
  async (csvFile: File, { rejectWithValue }) => {
    try {
      await customerService.importCustomers(csvFile);
      return 'Customers imported successfully';
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to import customers');
    }
  }
);
// ✅ Add a new contact
export const addContact = createAsyncThunk(
  'customers/addContact',
  async (contactData: Partial<Contact>, { rejectWithValue }) => {
    try {
      // Format contact data to match CreateCustomerData requirements
      const formattedContactData: CreateCustomerData = {
        firstname: String(contactData.firstname || ''),
        lastname: String(contactData.lastname || ''),
        email: String(contactData.email || ''),
        workspace_id: String(contactData.workspace_id || ''),
        type: contactData.type ? String(contactData.type) : undefined,
        phone: contactData.phone ? String(contactData.phone) : undefined,
        phoneCountry: contactData.phoneCountry ? String(contactData.phoneCountry) : undefined,
        companyId: contactData.companyId ? String(contactData.companyId) : undefined,
      };
      const newContact = await customerService.createCustomer(formattedContactData);
      return newContact.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add contact');
    }
  }
);


const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setSelectedContacts: (state, action) => {
      state.selectedContacts = action.payload;
    },
    toggleContactSelection: (state, action) => {
      const contactId = action.payload;
      const index = state.selectedContacts.indexOf(contactId);
      if (index === -1) {
        state.selectedContacts.push(contactId);
      } else {
        state.selectedContacts.splice(index, 1);
      }
    },
    updateContact: (state, action) => {
      const { id, ...updates } = action.payload;
      const contact = state.contacts.find((c) => c.id === id);
      if (contact) {
        Object.assign(contact, updates);
      }
    },
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
        state.lastFetchTime = Date.now();
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCustomerDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.contactDetails = action.payload;
      })
      .addCase(importCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(importCustomers.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(importCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateCustomer.pending, (state) => {
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        // Safely assign contact details
        if (action.payload) {
          state.contactDetails = action.payload;
        }
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(addContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addContact.fulfilled, (state, action) => {
        state.loading = false;
        // Safely handle the response
        if (Array.isArray(action.payload)) {
          state.contacts = state.contacts.concat(action.payload);
        } else if (action.payload) {
          state.contacts.push(action.payload as Contact);
        }
      })
      .addCase(addContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedContacts, toggleContactSelection, updateContact } = customerSlice.actions;
export default customerSlice.reducer;
