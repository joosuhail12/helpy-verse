
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Contact } from '@/types/contact';
import { mockContacts } from '../mockData';
import { UpdateContactPayload } from '../contactsTypes';

// Contact management actions - using domain/event pattern
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
