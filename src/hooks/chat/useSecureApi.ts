
import { useState, useCallback } from 'react';
import { contactAuth } from '@/utils/auth/contactAuth';

interface ApiOptions {
  headers?: Record<string, string>;
  baseUrl?: string;
  timeout?: number;
}

export const useSecureApi = (options: ApiOptions = {}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  const {
    headers: additionalHeaders = {},
    baseUrl = '/api',
    timeout = 10000
  } = options;
  
  const fetchWithAuth = useCallback(async (
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any
  ) => {
    setIsLoading(true);
    setError(null);
    
    const token = contactAuth.getToken();
    const contactId = contactAuth.getContactId();
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const headers = {
        'Content-Type': 'application/json',
        'X-Client-ID': contactId || 'anonymous',
        ...additionalHeaders
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
        credentials: 'include',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl, timeout, additionalHeaders]);
  
  const get = useCallback((endpoint: string) => {
    return fetchWithAuth(endpoint, 'GET');
  }, [fetchWithAuth]);
  
  const post = useCallback((endpoint: string, data: any) => {
    return fetchWithAuth(endpoint, 'POST', data);
  }, [fetchWithAuth]);
  
  const put = useCallback((endpoint: string, data: any) => {
    return fetchWithAuth(endpoint, 'PUT', data);
  }, [fetchWithAuth]);
  
  const del = useCallback((endpoint: string) => {
    return fetchWithAuth(endpoint, 'DELETE');
  }, [fetchWithAuth]);
  
  const isAuthenticated = useCallback(() => {
    return contactAuth.isAuthenticated();
  }, []);
  
  return {
    get,
    post,
    put,
    del,
    isLoading,
    error,
    isAuthenticated
  };
};

export default useSecureApi;
