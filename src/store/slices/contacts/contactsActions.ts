
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Contact } from '@/types/contact';
import { RootState } from '../../store';

// Fetch all customers/contacts
export const fetchCustomers = createAsyncThunk(
  'contacts/fetchCustomers',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      // In a real app, this would be an API call
      // For now, returning mock data
      return state.contacts.contacts.length > 0 
        ? state.contacts.contacts 
        : []; // or return mock data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch customers');
    }
  }
);

// Fetch a single contact by ID
export const fetchContactById = createAsyncThunk(
  'contacts/fetchContactById',
  async (contactId: string, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      const response = await fetch(`/api/contacts/${contactId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch contact');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch contact');
    }
  }
);

// Fetch contact details
export const fetchContactDetails = createAsyncThunk(
  'contacts/fetchContactDetails',
  async (contactId: string, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      const response = await fetch(`/api/contacts/${contactId}/details`);
      if (!response.ok) {
        throw new Error('Failed to fetch contact details');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch contact details');
    }
  }
);

// Create a new contact
export const createContact = createAsyncThunk(
  'contacts/createContact',
  async (contactData: Partial<Contact>, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData),
      });
      if (!response.ok) {
        throw new Error('Failed to create contact');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create contact');
    }
  }
);

// For adding a contact locally without API call
export const addContact = createAsyncThunk(
  'contacts/addContact',
  async (contact: Contact) => {
    return contact;
  }
);

// Update contact
export const updateContact = createAsyncThunk(
  'contacts/updateContact',
  async ({ contactId, data }: { contactId: string; data: Partial<Contact> }, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update contact');
      }
      return { contactId, data };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update contact');
    }
  }
);

// Update contact company
export const updateContactCompany = createAsyncThunk(
  'contacts/updateContactCompany',
  async ({ contactId, data }: { contactId: string; data: Partial<Contact> }, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      const response = await fetch(`/api/contacts/${contactId}/company`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update contact company');
      }
      return { contactId, data };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update contact company');
    }
  }
);

// Delete contact
export const deleteContact = createAsyncThunk(
  'contacts/deleteContact',
  async (contactId: string, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete contact');
      }
      return contactId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete contact');
    }
  }
);
