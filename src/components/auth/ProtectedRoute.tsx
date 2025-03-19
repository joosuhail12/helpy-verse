
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useEffect, useState } from 'react';
import { Loader2, WifiOff, AlertTriangle } from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchUserData } from '@/store/slices/authSlice';
import { HttpClient } from '@/api/services/http';
import { isAuthenticated, getAuthToken, isTokenExpired } from '@/utils/auth/tokenManager';
import { refreshToken } from '@/store/slices/auth/authActions';
import { Button } from '@/components/ui/button';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [isChecking, setIsChecking] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [authError, setAuthError] = useState<string | null>(null);
  const { loading } = useAppSelector((state) => state.auth);
  const [hasValidToken, setHasValidToken] = useState(false);
  
  // Listen for online/offline status changes
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  useEffect(() => {
    const checkAuth = async () => {
      console.log('ProtectedRoute: Checking authentication status');
      
      // Check if offline
      if (isOffline) {
        console.log('ProtectedRoute: Device is offline');
        setAuthError('You are currently offline. Please check your internet connection.');
        setIsChecking(false);
        return;
      }
      
      // Get token directly from tokenManager
      const token = getAuthToken();
      const isTokenPresent = !!token;
      console.log('ProtectedRoute: Token exists:', isTokenPresent, 'Token value:', token?.slice(0, 10));
      
      // Check token validity
      if (isTokenPresent) {
        // Check if token is expired
        if (isTokenExpired()) {
          console.log('Token is expired, attempting to refresh');
          try {
            // Try to refresh the token
            await dispatch(refreshToken()).unwrap();
            console.log('Token refreshed successfully');
          } catch (error) {
            console.error('Token refresh failed:', error);
            setHasValidToken(false);
            setAuthError('Your session has expired. Please sign in again.');
            setIsChecking(false);
            return;
          }
        }
        
        // Token is valid or was refreshed
        setHasValidToken(true);
        console.log('ProtectedRoute: Found valid token, configuring axios');
        HttpClient.apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        HttpClient.setAxiosDefaultConfig(token);
        
        try {
          // Try to refresh user data if needed
          await dispatch(fetchUserData());
          console.log('ProtectedRoute: Successfully fetched user data');
        } catch (error: any) {
          console.error("Error fetching user data:", error);
          // Only set error if it's a critical failure
          if (error?.isOfflineError) {
            setAuthError('Cannot connect to the server. Please check your internet connection.');
          }
          // Continue anyway since we have a token
        }
      } else {
        console.log('ProtectedRoute: No valid token found');
        setHasValidToken(false);
      }
      
      // Short delay to ensure state is settled
      setTimeout(() => {
        setIsChecking(false);
      }, 500);
    };
    
    checkAuth();
  }, [dispatch, location.pathname, isOffline]);

  // Add debug logging for render state
  useEffect(() => {
    console.log('ProtectedRoute state:', { 
      isChecking, 
      loading, 
      hasValidToken,
      isOffline, 
      path: location.pathname
    });
  }, [isChecking, loading, hasValidToken, isOffline, location.pathname]);

  // Handle offline state
  if (isOffline) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <WifiOff className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">You're offline</h1>
        <p className="text-center text-muted-foreground mb-6">
          You need an internet connection to access this page
        </p>
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline"
        >
          Try Again
        </Button>
      </div>
    );
  }

  // Show loading state while checking
  if (isChecking || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-primary">Checking authentication...</span>
      </div>
    );
  }

  // Show auth error if we have one
  if (authError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Authentication Error</h1>
        <p className="text-center text-muted-foreground mb-6">
          {authError}
        </p>
        <div className="flex gap-3">
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
          >
            Try Again
          </Button>
          <Button 
            onClick={() => window.location.href = '/sign-in'}
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  // We prioritize token existence over Redux state
  if (hasValidToken && isAuthenticated()) {
    console.log('ProtectedRoute: Token exists, rendering protected content', location.pathname);
    return <>{children}</>;
  }

  // No token, redirect to login
  console.log('ProtectedRoute: No token found, redirecting to login');
  return <Navigate to="/sign-in" state={{ from: location.pathname }} replace />;
};
