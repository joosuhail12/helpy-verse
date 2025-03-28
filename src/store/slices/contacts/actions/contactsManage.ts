
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Contact } from '@/types/contact';
import { mockContacts } from '../mockData';

// Create a new contact
export const createContact = createAsyncThunk(
  'contacts/createContact',
  async (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Simulating an API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newContact: Contact = {
      ...contact,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return newContact;
  }
);

// Update an existing contact
export const updateContact = createAsyncThunk(
  'contacts/updateContact',
  async ({ id, updates }: { id: string; updates: Partial<Contact> }) => {
    // Simulating an API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find the contact
    const contact = mockContacts.find(c => c.id === id);
    
    if (!contact) {
      throw new Error('Contact not found');
    }
    
    const updatedContact: Contact = {
      ...contact,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return updatedContact;
  }
);

// For supporting the existing components that use contactId parameter
export const updateContactCompany = createAsyncThunk(
  'contacts/updateContactCompany',
  async ({ contactId, companyId }: { contactId: string; companyId: string | null }) => {
    // Simulating an API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find the contact
    const contact = mockContacts.find(c => c.id === contactId);
    
    if (!contact) {
      throw new Error('Contact not found');
    }
    
    const updatedContact: Contact = {
      ...contact,
      company: companyId,
      updatedAt: new Date().toISOString()
    };
    
    return updatedContact;
  }
);

// Alias for addContact to support existing components
export const addContact = createAsyncThunk(
  'contacts/addContact',
  async (contactData: Partial<Contact>) => {
    // Simulating an API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newContact: Contact = {
      ...contactData,
      id: contactData.id || String(Date.now()),
      firstname: contactData.firstname || '',
      lastname: contactData.lastname || '',
      email: contactData.email || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return newContact;
  }
);

// Delete a contact
export const deleteContact = createAsyncThunk(
  'contacts/deleteContact',
  async (id: string) => {
    // Simulating an API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real scenario, you would delete the contact from the backend
    return id;
  }
);
