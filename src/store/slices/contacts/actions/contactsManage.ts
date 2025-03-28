
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Contact } from '@/types/contact';
import { UpdateContactPayload } from '../contactsTypes';
import api from '@/api/Api';

// Create contact
export const createContact = createAsyncThunk(
  'contacts/createContact',
  async (contact: Partial<Contact>, { rejectWithValue }) => {
    try {
      const response = await api.post('/contacts', contact);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Update contact
export const updateContact = createAsyncThunk(
  'contacts/updateContact',
  async ({ id, updates }: UpdateContactPayload, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/contacts/${id}`, updates);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Delete contact
export const deleteContact = createAsyncThunk(
  'contacts/deleteContact',
  async (contactId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/contacts/${contactId}`);
      return contactId;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Update contact's company
export const updateContactCompany = createAsyncThunk(
  'contacts/updateContactCompany',
  async ({ contactId, companyId }: { contactId: string, companyId: string | null }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/contacts/${contactId}/company`, { companyId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
