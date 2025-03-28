
/**
 * Authentication utilities for contact/user verification
 */

import { v4 as uuidv4 } from 'uuid';
import { encryptBase64, decryptBase64 } from '@/utils/helpers/helpers';

interface VerificationToken {
  token: string;
  expiry: number;
  contactId: string;
}

// Generate a verification token for a contact
export const generateVerificationToken = (contactId: string, expiryMinutes: number = 15): string => {
  const token = uuidv4();
  const expiry = Date.now() + expiryMinutes * 60 * 1000;
  
  const tokenData: VerificationToken = {
    token,
    expiry,
    contactId,
  };
  
  return encryptBase64(JSON.stringify(tokenData));
};

// Validate a verification token
export const validateVerificationToken = (encodedToken: string): { 
  isValid: boolean; 
  contactId?: string; 
  error?: string; 
} => {
  try {
    // Decode the token
    const decodedData = decryptBase64(encodedToken);
    const tokenData: VerificationToken = JSON.parse(decodedData);
    
    // Check if token has expired
    if (Date.now() > tokenData.expiry) {
      return {
        isValid: false,
        error: 'Token has expired',
      };
    }
    
    return {
      isValid: true,
      contactId: tokenData.contactId,
    };
  } catch (error) {
    return {
      isValid: false,
      error: 'Invalid token format',
    };
  }
};

// Generate a secure session ID for contact
export const generateContactSessionId = (): string => {
  return uuidv4();
};

// Store contact session in local storage (for demo purposes)
export const storeContactSession = (contactId: string, sessionId: string): void => {
  try {
    localStorage.setItem('contactSession', encryptBase64(JSON.stringify({ contactId, sessionId })));
  } catch (error) {
    console.error('Failed to store contact session:', error);
  }
};

// Retrieve contact session from local storage
export const getContactSession = (): { contactId: string; sessionId: string } | null => {
  try {
    const session = localStorage.getItem('contactSession');
    if (!session) return null;
    
    return JSON.parse(decryptBase64(session));
  } catch (error) {
    console.error('Failed to retrieve contact session:', error);
    return null;
  }
};

// Clear contact session
export const clearContactSession = (): void => {
  localStorage.removeItem('contactSession');
};

// Check if contact is authenticated
export const isContactAuthenticated = (): boolean => {
  return !!getContactSession();
};

export default {
  generateVerificationToken,
  validateVerificationToken,
  generateContactSessionId,
  storeContactSession,
  getContactSession,
  clearContactSession,
  isContactAuthenticated,
};
