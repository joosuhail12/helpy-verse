
import { v4 as uuidv4 } from 'uuid';
import { getCookie, setCookie } from '../cookies/cookieManager';
import { emitEvent } from '../events/eventManager';
import { ChatEventType } from '../events/eventTypes';

interface ContactInfo {
  id: string;
  email?: string;
  name?: string;
  verified: boolean;
  lastVerified?: string;
  metadata?: Record<string, any>;
}

class ContactAuth {
  private contact: ContactInfo | null = null;
  private readonly CONTACT_KEY = 'chat_contact';
  private readonly CONTACT_TOKEN_KEY = 'chat_contact_token';
  
  /**
   * Initialize contact authentication
   */
  init(): ContactInfo | null {
    // Try to restore contact info from storage
    const savedContact = this.getStoredContact();
    
    if (savedContact) {
      this.contact = savedContact;
      console.log('Restored contact:', this.contact.id);
      return this.contact;
    }
    
    return null;
  }
  
  /**
   * Get current contact info
   */
  getContact(): ContactInfo | null {
    if (!this.contact) {
      // Try to restore from storage
      this.contact = this.getStoredContact();
    }
    
    return this.contact;
  }
  
  /**
   * Create a new anonymous contact
   */
  createAnonymousContact(): ContactInfo {
    const id = uuidv4();
    
    this.contact = {
      id,
      verified: false
    };
    
    this.updateContactStorage();
    
    // Emit contact creation event
    emitEvent({
      type: ChatEventType.CONTACT_IDENTIFIED,
      timestamp: new Date().toISOString(),
      source: 'contact-auth',
      contactId: id,
      isAnonymous: true
    });
    
    console.log('Created anonymous contact:', id);
    return this.contact;
  }
  
  /**
   * Identify contact with specific info
   */
  identifyContact(email: string, name?: string, metadata?: Record<string, any>): ContactInfo {
    const existingContact = this.getContact();
    const id = existingContact?.id || uuidv4();
    
    this.contact = {
      id,
      email,
      name,
      verified: false,
      metadata
    };
    
    this.updateContactStorage();
    
    // Emit contact identified event
    emitEvent({
      type: ChatEventType.CONTACT_IDENTIFIED,
      timestamp: new Date().toISOString(),
      source: 'contact-auth',
      contactId: id,
      email,
      name,
      isAnonymous: false
    });
    
    console.log('Identified contact:', id);
    return this.contact;
  }
  
  /**
   * Mark contact as verified
   */
  verifyContact(token?: string): boolean {
    if (!this.contact) {
      return false;
    }
    
    // In a real implementation, you would validate the token server-side
    // Here we're just simulating verification
    
    this.contact.verified = true;
    this.contact.lastVerified = new Date().toISOString();
    
    if (token) {
      setCookie(this.CONTACT_TOKEN_KEY, token, 30);
    }
    
    this.updateContactStorage();
    
    // Emit verification event
    emitEvent({
      type: ChatEventType.USER_IDENTIFIED,
      timestamp: new Date().toISOString(),
      source: 'contact-auth',
      contactId: this.contact.id,
      email: this.contact.email,
      name: this.contact.name,
      verified: true
    });
    
    console.log('Verified contact:', this.contact.id);
    return true;
  }
  
  /**
   * Check if contact is verified
   */
  isVerified(): boolean {
    return !!this.contact?.verified;
  }
  
  /**
   * Clear contact info
   */
  clearContact(): void {
    if (this.contact) {
      const contactId = this.contact.id;
      
      this.contact = null;
      localStorage.removeItem(this.CONTACT_KEY);
      setCookie(this.CONTACT_TOKEN_KEY, '', -1); // Expire the cookie
      
      console.log('Cleared contact:', contactId);
    }
  }
  
  /**
   * Get verification token
   */
  getToken(): string | null {
    return getCookie(this.CONTACT_TOKEN_KEY);
  }
  
  /**
   * Get contact from storage
   */
  private getStoredContact(): ContactInfo | null {
    try {
      const contactJson = localStorage.getItem(this.CONTACT_KEY);
      return contactJson ? JSON.parse(contactJson) : null;
    } catch (error) {
      console.error('Error retrieving contact from storage:', error);
      return null;
    }
  }
  
  /**
   * Update contact in storage
   */
  private updateContactStorage(): void {
    if (this.contact) {
      try {
        localStorage.setItem(this.CONTACT_KEY, JSON.stringify(this.contact));
      } catch (error) {
        console.error('Error saving contact to storage:', error);
      }
    }
  }
}

export const contactAuth = new ContactAuth();
export default contactAuth;
