
import { useState, useEffect, useCallback } from 'react';
import { getCookie, setCookie } from '@/api/services/http/cookieManager';
import { contactsService } from '@/api/services/ContactsService';
import { Contact } from '@/types/contact';

/**
 * Hook for integrating with the Contact API as shown in the flowchart
 */
export const useContactIntegration = (workspaceId: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [apiKeyValid, setApiKeyValid] = useState(false);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Function to validate API Key
  const validateApiKey = useCallback(async (apiKey: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      // Perform validation request
      // This is a placeholder - implement the actual validation logic
      console.log('Validating API key:', apiKey);
      
      // Simulate API validation
      const isValid = apiKey && apiKey.length > 10;
      
      if (isValid) {
        // Store API key securely
        localStorage.setItem('chatWidgetApiKey', apiKey);
        setApiKeyValid(true);
      } else {
        setError('Invalid API key');
        setApiKeyValid(false);
      }
      
      return isValid;
    } catch (error) {
      console.error('Error validating API key:', error);
      setError('Failed to validate API key');
      setApiKeyValid(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to check if contact token exists in cookies
  const checkContactToken = useCallback((): boolean => {
    const token = getCookie('contactToken');
    return !!token;
  }, []);

  // Function to create a new contact
  const createNewContact = useCallback(async (contactData: Partial<Contact>): Promise<string | null> => {
    try {
      setIsLoading(true);
      console.log('Creating new contact with data:', contactData);
      
      // Create contact through service
      const newContact = await contactsService.create(contactData);
      
      // Store the contact ID in a cookie
      if (newContact && newContact.id) {
        setCookie('contactToken', newContact.id, 30); // 30 days expiry
        setCurrentContact(newContact);
        return newContact.id;
      }
      
      return null;
    } catch (error) {
      console.error('Error creating new contact:', error);
      setError('Failed to create contact');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to fetch contact data and past conversations
  const fetchContactData = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      const contactToken = getCookie('contactToken');
      
      if (!contactToken) {
        setError('No contact token found');
        return;
      }
      
      // Fetch contact data
      const contact = await contactsService.getById(contactToken);
      setCurrentContact(contact);
      
      // Fetch past conversations would go here
      console.log('Contact data fetched successfully:', contact);
    } catch (error) {
      console.error('Error fetching contact data:', error);
      setError('Failed to fetch contact data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize contact integration on component mount
  useEffect(() => {
    const initializeContact = async () => {
      setIsLoading(true);
      
      // Step 1: Check if API key exists and is valid
      const apiKey = localStorage.getItem('chatWidgetApiKey');
      if (!apiKey) {
        setApiKeyValid(false);
        setIsLoading(false);
        return;
      }
      
      // Validate API key
      const isValid = await validateApiKey(apiKey);
      if (!isValid) {
        setIsLoading(false);
        return;
      }
      
      // Step 2: Check if contact token exists in cookies
      const hasToken = checkContactToken();
      
      if (hasToken) {
        // Step 3a: If token exists, fetch contact data and past conversations
        await fetchContactData();
      } else {
        // Step 3b: Token doesn't exist, we'll create a contact when user interacts
        console.log('No contact token found, will create one when user interacts');
      }
      
      setIsLoading(false);
    };

    if (workspaceId) {
      initializeContact();
    }
  }, [workspaceId, validateApiKey, checkContactToken, fetchContactData]);

  return {
    isLoading,
    apiKeyValid,
    currentContact,
    error,
    validateApiKey,
    createNewContact,
    fetchContactData,
    hasContactToken: checkContactToken
  };
};
