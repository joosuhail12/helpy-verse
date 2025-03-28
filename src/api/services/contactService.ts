
import { HttpClient } from '@/api/services/http';
import { Contact } from '@/types/contact';

const API_URL = '/contact';

export interface ContactResponse {
  status: string;
  message: string;
  data: Contact;
}

/**
 * Service for handling contact operations
 */
export const contactService = {
  /**
   * Find or create a contact
   */
  async findOrCreateContact(contactData: {
    workspace_id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone?: string;
  }): Promise<Contact | null> {
    try {
      const response = await HttpClient.apiClient.post<ContactResponse>(`${API_URL}/identify`, contactData);
      return response.data.data;
    } catch (error) {
      console.error('Error finding or creating contact:', error);
      return null;
    }
  },

  /**
   * Check if a contact exists by email
   */
  async contactExists(email: string, workspace_id: string): Promise<boolean> {
    try {
      const response = await HttpClient.apiClient.get<{ exists: boolean }>(`${API_URL}/exists`, {
        params: { email, workspace_id }
      });
      return response.data.exists;
    } catch (error) {
      console.error('Error checking if contact exists:', error);
      return false;
    }
  },

  /**
   * Get contact by ID
   */
  async getContact(id: string, workspace_id: string): Promise<Contact | null> {
    try {
      const response = await HttpClient.apiClient.get<ContactResponse>(`${API_URL}/${id}`, {
        params: { workspace_id }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error getting contact:', error);
      return null;
    }
  },

  /**
   * Update contact information
   */
  async updateContact(id: string, data: Partial<Contact>, workspace_id: string): Promise<Contact | null> {
    try {
      const response = await HttpClient.apiClient.put<ContactResponse>(`${API_URL}/${id}`, {
        ...data,
        workspace_id
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating contact:', error);
      return null;
    }
  }
};
