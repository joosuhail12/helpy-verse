
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Contact } from '@/types/contact';
import { RootState } from '../../store';
import { customerService } from '@/api/services/customerService';
import { CACHE_DURATION } from './types';

export const fetchCustomers = createAsyncThunk(
  'contacts/fetchCustomers',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { lastFetchTime } = state.contacts;
      
      if (lastFetchTime && Date.now() - lastFetchTime < CACHE_DURATION) {
        console.log('Using cached contacts data');
        return null;
      }
      
      const response = await customerService.fetchCustomers();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch customers');
    }
  }
);

export const fetchContactById = createAsyncThunk(
  'contacts/fetchContactById',
  async (contactId: string, { rejectWithValue }) => {
    try {
      const response = await customerService.getCustomerDetails(contactId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch contact details');
    }
  }
);

// Alias for fetchContactById for better semantics in UI components
export const fetchContactDetails = fetchContactById;

export const createContact = createAsyncThunk(
  'contacts/createContact',
  async (contactData: Partial<Contact>, { rejectWithValue }) => {
    try {
      const response = await customerService.createCustomer(contactData as any);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create contact');
    }
  }
);

// Alias for createContact for better semantics in UI components
export const addContact = createContact;

export const updateContact = createAsyncThunk(
  'contacts/updateContact',
  async ({ contactId, data }: { contactId: string; data: Partial<Contact> }, { rejectWithValue }) => {
    try {
      const response = await customerService.updateCustomer(contactId, data);
      // Make sure to return both the contactId and response data
      return { contactId, ...response };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update contact');
    }
  }
);

export const updateContactCompany = createAsyncThunk(
  'contacts/updateContactCompany',
  async ({ contactId, companyId }: { contactId: string; companyId: string | null }, { rejectWithValue }) => {
    try {
      const response = await customerService.updateCustomer(contactId, { company: companyId });
      // Make sure to return both the contactId and response data
      return { contactId, ...response };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update contact company');
    }
  }
);

export const deleteContact = createAsyncThunk(
  'contacts/deleteContact',
  async (contactId: string, { rejectWithValue }) => {
    try {
      await customerService.deleteContact(contactId);
      return contactId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete contact');
    }
  }
);
