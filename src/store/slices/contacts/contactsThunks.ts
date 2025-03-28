
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Contact, ContactFilters } from '@/types/contact';
import { mockContacts } from './mockData';
import { UpdateContactPayload } from './contactsTypes';

// Define the thunks
export const fetchContacts = createAsyncThunk(
  'contacts/fetchContacts',
  async (filters: ContactFilters, { rejectWithValue }) => {
    try {
      // For now, using mock data
      return {
        data: mockContacts,
        total: mockContacts.length
      };
    } catch (error) {
      return rejectWithValue('Failed to fetch contacts');
    }
  }
);

// Alias for fetchContacts
export const fetchCustomers = createAsyncThunk(
  'contacts/fetchCustomers',
  async (_, { dispatch }) => {
    // We'll need to import the filters from the slice or pass them as parameters
    const filters: ContactFilters = {
      search: '',
      status: [],
      type: [],
      tags: []
    };
    return dispatch(fetchContacts(filters));
  }
);

export const fetchContactById = createAsyncThunk(
  'contacts/fetchContactById',
  async (contactId: string, { rejectWithValue }) => {
    try {
      // For now, using mock data
      const contact = mockContacts.find(c => c.id === contactId);
      if (!contact) {
        throw new Error('Contact not found');
      }
      return contact;
    } catch (error) {
      return rejectWithValue('Failed to fetch contact');
    }
  }
);

// Alias for fetchContactById
export const fetchContactDetails = fetchContactById;

export const updateContact = createAsyncThunk(
  'contacts/updateContact',
  async ({ contactId, data }: UpdateContactPayload, { rejectWithValue }) => {
    try {
      // Mock update
      const contactIndex = mockContacts.findIndex(c => c.id === contactId);
      if (contactIndex === -1) {
        throw new Error('Contact not found');
      }
      
      // In a real app, this would be an API call
      const updatedContact = { 
        ...mockContacts[contactIndex], 
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      return updatedContact;
    } catch (error) {
      return rejectWithValue('Failed to update contact');
    }
  }
);

export const updateContactCompany = createAsyncThunk(
  'contacts/updateContactCompany',
  async ({ contactId, companyId }: { contactId: string; companyId: string | null }, { dispatch }) => {
    return dispatch(updateContact({
      contactId,
      data: { company: companyId }
    }));
  }
);

export const addContact = createAsyncThunk(
  'contacts/addContact',
  async (contactData: Partial<Contact>, { rejectWithValue }) => {
    try {
      // Mock create
      const newContact: Contact = {
        id: Date.now().toString(),
        ...contactData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        firstname: contactData.firstname || '',
        lastname: contactData.lastname || '',
        email: contactData.email || '',
      };
      
      return newContact;
    } catch (error) {
      return rejectWithValue('Failed to create contact');
    }
  }
);
