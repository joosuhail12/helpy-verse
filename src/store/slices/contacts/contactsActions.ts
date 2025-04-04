
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Contact } from '@/types/contact';
import { RootState } from '../../store';
import { contactsService } from '@/api/services';
import { CACHE_DURATION } from './types';

export const fetchCustomers = createAsyncThunk(
  'contacts/fetchCustomers',
  async (_, { getState, rejectWithValue }) => {
    try {
      console.log('Fetching customers in thunk');
      const state = getState() as RootState;
      const { lastFetchTime } = state.contacts;
      
      if (lastFetchTime && Date.now() - lastFetchTime < CACHE_DURATION) {
        console.log('Using cached contacts data');
        return null;
      }
      
      const response = await contactsService.getAll();
      console.log('Customer service response:', response);
      return response.data;
    } catch (error: any) {
      console.error('Error in fetchCustomers thunk:', error);
      return rejectWithValue(error.message || 'Failed to fetch customers');
    }
  }
);

export const fetchContactById = createAsyncThunk(
  'contacts/fetchContactById',
  async (contactId: string, { rejectWithValue }) => {
    try {
      console.log(`Fetching contact details for ID: ${contactId}`);
      const contact = await contactsService.getById(contactId);
      return contact;
    } catch (error: any) {
      console.error(`Error fetching contact ${contactId}:`, error);
      const errorMessage = error.message || 'Failed to fetch contact details';
      return rejectWithValue(errorMessage);
    }
  }
);

// Alias for fetchContactById for better semantics in UI components
export const fetchContactDetails = fetchContactById;

export const createContact = createAsyncThunk(
  'contacts/createContact',
  async (contactData: Partial<Contact>, { rejectWithValue }) => {
    try {
      const contact = await contactsService.create(contactData);
      return contact;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create contact');
    }
  }
);

// Alias for createContact for better semantics in UI components
export const addContact = createContact;

// Define the return type for update operations
interface UpdateContactPayload {
  contactId: string;
  data: Contact;
}

export const updateContact = createAsyncThunk<UpdateContactPayload, { contactId: string; data: Partial<Contact> }>(
  'contacts/updateContact',
  async ({ contactId, data }, { rejectWithValue }) => {
    try {
      const updatedContact = await contactsService.update(contactId, data);
      // Return a properly typed object containing both contactId and response data
      return { contactId, data: updatedContact };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update contact');
    }
  }
);

export const updateContactCompany = createAsyncThunk<UpdateContactPayload, { contactId: string; companyId: string | null }>(
  'contacts/updateContactCompany',
  async ({ contactId, companyId }, { rejectWithValue }) => {
    try {
      const updatedContact = await contactsService.update(contactId, { company: companyId });
      // Return a properly typed object containing both contactId and response data
      return { contactId, data: updatedContact };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update contact company');
    }
  }
);

export const deleteContact = createAsyncThunk(
  'contacts/deleteContact',
  async (contactId: string, { rejectWithValue }) => {
    try {
      await contactsService.delete(contactId);
      return contactId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete contact');
    }
  }
);
