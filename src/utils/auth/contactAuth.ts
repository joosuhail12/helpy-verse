
import { HttpClient } from '@/api/services/http';
import { jwtDecode } from 'jwt-decode';
import { Contact } from '@/types/contact';
import { encryptBase64, decryptBase64 } from '@/utils/helpers/helpers';

interface ContactTokenPayload {
  sub: string;
  email: string;
  exp: number;
  contactId: string;
}

interface VerificationResponse {
  status: string;
  token: string;
  contact: Contact;
}

/**
 * Contact Authentication System
 * Handles verification and authentication of contacts against the database
 */
export const contactAuth = {
  // Verify a contact using email and a verification code
  async verifyContact(email: string, verificationCode: string): Promise<boolean> {
    try {
      const response = await HttpClient.apiClient.post<VerificationResponse>('/contact/verify', {
        email,
        code: verificationCode,
      });
      
      if (response.data?.token) {
        // Store the token securely
        localStorage.setItem('contactToken', response.data.token);
        localStorage.setItem('contactId', response.data.contact.id);
        
        // Store contact email in encrypted format
        const encryptedEmail = encryptBase64(email);
        localStorage.setItem('contactEmail', encryptedEmail);
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error verifying contact:', error);
      return false;
    }
  },
  
  // Request a verification code to be sent to a contact's email
  async requestVerificationCode(email: string): Promise<boolean> {
    try {
      await HttpClient.apiClient.post('/contact/request-verification', {
        email,
      });
      return true;
    } catch (error) {
      console.error('Error requesting verification code:', error);
      return false;
    }
  },
  
  // Check if contact is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('contactToken');
    if (!token) return false;
    
    try {
      const decoded = this.decodeToken(token);
      
      // Check if token is expired
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTime) {
        this.logout();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Invalid token:', error);
      this.logout();
      return false;
    }
  },
  
  // Get authenticated contact ID
  getContactId(): string | null {
    return localStorage.getItem('contactId');
  },
  
  // Get authenticated contact email
  getContactEmail(): string | null {
    const encryptedEmail = localStorage.getItem('contactEmail');
    if (!encryptedEmail) return null;
    
    try {
      return decryptBase64(encryptedEmail);
    } catch {
      return null;
    }
  },
  
  // Decode JWT token
  decodeToken(token: string): ContactTokenPayload {
    return jwtDecode<ContactTokenPayload>(token);
  },
  
  // Get the authentication token
  getToken(): string | null {
    return localStorage.getItem('contactToken');
  },
  
  // Logout the contact
  logout(): void {
    localStorage.removeItem('contactToken');
    localStorage.removeItem('contactId');
    localStorage.removeItem('contactEmail');
  },
  
  // Check if token is about to expire (within 5 minutes)
  isTokenExpiringSoon(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const decoded = this.decodeToken(token);
      const currentTime = Math.floor(Date.now() / 1000);
      const fiveMinutesInSeconds = 5 * 60;
      
      return decoded.exp - currentTime < fiveMinutesInSeconds;
    } catch {
      return false;
    }
  },
};
