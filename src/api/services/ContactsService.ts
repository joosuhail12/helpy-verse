
import { BaseService } from './BaseService';
import type { Contact } from '@/types/contact';

interface ContactsResponse {
  data: Contact[];
  total: number;
}

/**
 * Service for managing contacts/customers
 */
export class ContactsService extends BaseService<Contact, ContactsResponse> {
  protected endpoint = '/customer';

  /**
   * Override getAll to handle pagination and filtering
   */
  async getAll(params?: Record<string, any>): Promise<ContactsResponse> {
    const response = await this.request<ContactsResponse>('get', this.endpoint, null, { params });
    return response.data;
  }

  /**
   * Import contacts from CSV
   */
  async importFromCsv(file: File): Promise<{ success: boolean; count: number }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await this.request<{ success: boolean; count: number }>(
      'post',
      `${this.endpoint}/import`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    return response.data;
  }

  /**
   * Get contact activities
   */
  async getContactActivities(contactId: string): Promise<any[]> {
    const response = await this.request<any[]>(
      'get',
      `${this.endpoint}/${contactId}/activities`
    );
    return response.data;
  }
}

// Export singleton instance
export const contactsService = new ContactsService();
