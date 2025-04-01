
import { BaseService } from './BaseService';
import { getCookie, setCookie } from '@/api/services/http/cookieManager';
import { Contact } from '@/types/contact';

/**
 * Service for Chat Widget integration with Contact API
 */
export class ChatWidgetService extends BaseService<any, any> {
  protected endpoint = '/chat-widget';

  /**
   * Validate an API key
   */
  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await this.request<{ valid: boolean }>('post', `${this.endpoint}/validate-key`, { apiKey });
      return response.data.valid;
    } catch (error) {
      console.error('API key validation error:', error);
      return false;
    }
  }

  /**
   * Get configuration for chat widget
   */
  async getWidgetConfig(apiKey: string): Promise<any> {
    try {
      const response = await this.request<any>('get', `${this.endpoint}/config`, null, {
        headers: {
          'X-API-Key': apiKey
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching widget config:', error);
      throw error;
    }
  }

  /**
   * Create a new contact for the chat
   */
  async createContact(contactData: Partial<Contact>): Promise<Contact> {
    try {
      const response = await this.request<Contact>('post', `${this.endpoint}/contact`, contactData);
      
      // Store the contact token in a cookie
      if (response.data && response.data.id) {
        setCookie('contactToken', response.data.id, 30); // 30 days expiry
      }
      
      return response.data;
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  }

  /**
   * Get contact by token from cookie
   */
  async getContactByToken(): Promise<Contact | null> {
    const token = getCookie('contactToken');
    
    if (!token) {
      console.log('No contact token found in cookies');
      return null;
    }
    
    try {
      const response = await this.request<Contact>('get', `${this.endpoint}/contact/${token}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching contact data:', error);
      return null;
    }
  }

  /**
   * Get past conversations for a contact
   */
  async getPastConversations(contactToken: string): Promise<any[]> {
    try {
      const response = await this.request<any[]>('get', `${this.endpoint}/conversations/${contactToken}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching past conversations:', error);
      return [];
    }
  }
}

// Export singleton instance
export const chatWidgetService = new ChatWidgetService();
