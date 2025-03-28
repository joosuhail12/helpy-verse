
import { useState, useCallback } from 'react';
import { HttpClient } from '@/api/services/http';
import { contactAuth } from '@/utils/auth/contactAuth';

/**
 * Hook for making secure API calls from the chat widget
 * Automatically handles authentication and error states
 */
export const useSecureApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generic API call function with authentication
  const secureApiCall = useCallback(async <T>(
    endpoint: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // Get contact authentication token
      const token = contactAuth.getToken();
      const contactId = contactAuth.getContactId();
      
      if (!token || !contactId) {
        setError('Authentication required');
        return null;
      }
      
      // Configure request with auth token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      let response;
      
      switch (method) {
        case 'GET':
          response = await HttpClient.apiClient.get<T>(endpoint, config);
          break;
        case 'POST':
          response = await HttpClient.apiClient.post<T>(endpoint, data, config);
          break;
        case 'PUT':
          response = await HttpClient.apiClient.put<T>(endpoint, data, config);
          break;
        case 'DELETE':
          response = await HttpClient.apiClient.delete<T>(endpoint, config);
          break;
      }
      
      return response.data;
    } catch (err: any) {
      console.error('Secure API call failed:', err);
      setError(err.message || 'Failed to complete the request');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Contact-specific API calls
  const getContactData = useCallback(async () => {
    const contactId = contactAuth.getContactId();
    if (!contactId) {
      setError('Authentication required');
      return null;
    }
    
    return secureApiCall<any>(`/contact/${contactId}`);
  }, [secureApiCall]);
  
  // Get conversation history for authenticated contact
  const getContactConversations = useCallback(async () => {
    const contactId = contactAuth.getContactId();
    if (!contactId) {
      setError('Authentication required');
      return null;
    }
    
    return secureApiCall<any>(`/contact/${contactId}/conversations`);
  }, [secureApiCall]);
  
  return {
    loading,
    error,
    secureApiCall,
    getContactData,
    getContactConversations,
    isAuthenticated: contactAuth.isAuthenticated()
  };
};
