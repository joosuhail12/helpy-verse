
import React, { useEffect, useState } from 'react';
import { isAuthenticated, getAuthToken, isTokenExpired } from '@/utils/auth/tokenManager';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HttpClient } from '@/api/services/http';

const Unassigned = () => {
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated
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

  // Show loading indicator while checking authentication
  if (isAuthChecking) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Verifying your session...</span>
      </div>
    );
  }

  // Show error message if authentication failed
  if (authError) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-xl font-semibold mb-2">Authentication Error</h2>
        <p className="text-gray-600 mb-4">{authError}</p>
        <Button onClick={() => window.location.href = '/sign-in'}>
          Sign In Again
        </Button>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthorized && !isAuthChecking) {
    return <Navigate to="/sign-in" replace />;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Unassigned Tickets</h1>
      {/* Content will be added later */}
    </div>
  );
};

export default Unassigned;
