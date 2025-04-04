
import { useState, useEffect } from 'react';
import { isAuthenticated, getAuthToken, isTokenExpired } from '@/utils/auth/tokenManager';
import { HttpClient } from '@/api/services/http';

interface UseAuthCheckResult {
  isAuthChecking: boolean;
  isAuthorized: boolean;
  authError: string | null;
}

/**
 * Custom hook to handle authentication checking with token validation
 */
export const useAuthCheck = (): UseAuthCheckResult => {
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const auth = isAuthenticated();
        
        // Check token validity
        if (auth) {
          const token = getAuthToken();
          
          if (isTokenExpired()) {
            console.error('Token has expired, user needs to login again');
            setAuthError('Your session has expired. Please sign in again.');
            setIsAuthorized(false);
          } else {
            console.log('Valid token found, configuring HTTP client');
            HttpClient.setAxiosDefaultConfig(token);
            setIsAuthorized(true);
          }
        } else {
          console.error('User not authenticated');
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error('Error during authentication check:', error);
        setAuthError('There was a problem verifying your session.');
        setIsAuthorized(false);
      } finally {
        setIsAuthChecking(false);
      }
    };
    
    checkAuth();
  }, []);

  return { isAuthChecking, isAuthorized, authError };
};

export default useAuthCheck;
