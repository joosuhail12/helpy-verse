import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useEffect, useState } from 'react';
import { Loader2, WifiOff, AlertTriangle, RefreshCw, LogIn } from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchUserData } from '@/store/slices/authSlice';
import { refreshAuthToken } from '@/store/slices/auth/authActions';
import { HttpClient } from '@/api/services/http';
import { AuthService } from '@/services/authService';
import { WorkspaceService } from '@/services/workspaceService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [isChecking, setIsChecking] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const { loading } = useAppSelector((state) => state.auth);
  const [hasValidToken, setHasValidToken] = useState(false);
  
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
      
      if (isOffline) {
        console.log('ProtectedRoute: Device is offline');
        setAuthError('You are currently offline. Please check your internet connection.');
        setIsChecking(false);
        return;
      }
      
      const token = AuthService.getAuthToken();
      const isTokenPresent = !!token;
      console.log('ProtectedRoute: Token exists:', isTokenPresent, isTokenPresent ? 'Token value found' : 'No token found', 'Current path:', location.pathname);
      
      if (isTokenPresent) {
        if (AuthService.isTokenExpired()) {
          console.log('ProtectedRoute: Token is expired, attempting refresh');
          
          try {
            const refreshResult = await dispatch(refreshAuthToken()).unwrap();
            
            if (refreshResult?.data?.accessToken?.token) {
              console.log('ProtectedRoute: Token refreshed successfully');
              setHasValidToken(true);
            } else {
              console.error('ProtectedRoute: Token refresh failed - no token returned');
              setHasValidToken(false);
              setAuthError('Your session has expired. Please sign in again.');
              setIsChecking(false);
              return;
            }
          } catch (error) {
            console.error('ProtectedRoute: Token refresh failed:', error);
            setHasValidToken(false);
            setAuthError('Your session has expired. Please sign in again.');
            setIsChecking(false);
            return;
          }
        } else {
          setHasValidToken(true);
        }
        
        console.log('ProtectedRoute: Found valid token, configuring axios');
        HttpClient.setAxiosDefaultConfig(token);
        
        try {
          if (!WorkspaceService.hasWorkspaceId()) {
            console.log('ProtectedRoute: No workspace ID found, fetching user data to get workspace ID');
          }
          
          await dispatch(fetchUserData());
          console.log('ProtectedRoute: Successfully fetched user data');
          
          if (!WorkspaceService.hasWorkspaceId()) {
            console.warn('ProtectedRoute: Still no workspace ID after fetching user data');
            setAuthError('Unable to determine your workspace. Please sign in again.');
            setHasValidToken(false);
          }
        } catch (error: any) {
          console.error("Error fetching user data:", error);
          
          if (error?.response?.status === 401) {
            console.log('Token appears to be invalid');
            setHasValidToken(false);
            setAuthError('Your session has expired. Please sign in again.');
          } else if (error?.isOfflineError) {
            setAuthError('Cannot connect to the server. Please check your internet connection.');
          } else if (error?.isServerError) {
            setAuthError('The server is currently unavailable. Please try again later.');
          } else if (error?.isTimeoutError) {
            setAuthError('The server is taking too long to respond. Please try again later.');
          } else {
            console.warn('Non-fatal error while fetching user data:', error?.message || 'Unknown error');
          }
        }
      } else {
        setHasValidToken(false);
      }
      
      setTimeout(() => {
        setIsChecking(false);
      }, 500);
    };
    
    checkAuth();
  }, [dispatch, location.pathname, isOffline, isRetrying]);

  const handleRetry = async () => {
    setIsRetrying(true);
    setIsChecking(true);
    setAuthError(null);
    
    try {
      if (AuthService.isTokenExpired()) {
        await dispatch(refreshAuthToken());
      }
      
      if (navigator.onLine) {
        setIsOffline(false);
      } else {
        setIsOffline(true);
        throw new Error("Still offline");
      }
    } catch (error) {
      console.error("Retry failed:", error);
    } finally {
      setTimeout(() => {
        setIsRetrying(false);
      }, 1000);
    }
  };

  if (isOffline) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <Card className="w-full max-w-md p-6 shadow-lg">
          <div className="flex flex-col items-center text-center">
            <WifiOff className="h-16 w-16 text-destructive mb-4" />
            <h1 className="text-2xl font-bold mb-2">You're offline</h1>
            <p className="text-center text-muted-foreground mb-6">
              You need an internet connection to access this page
            </p>
            <Button 
              onClick={handleRetry} 
              variant="outline"
              className="flex items-center gap-2"
              disabled={isRetrying}
            >
              {isRetrying && <RefreshCw className="h-4 w-4 animate-spin" />}
              {isRetrying ? 'Checking connection...' : 'Try Again'}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (isChecking || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <div className="text-lg text-primary font-medium">Checking authentication...</div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <Card className="w-full max-w-md p-6 shadow-lg">
          <div className="flex flex-col items-center text-center">
            <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
            <h1 className="text-2xl font-bold mb-2">Authentication Error</h1>
            <p className="text-center text-muted-foreground mb-6">
              {authError}
            </p>
            <div className="flex gap-3">
              <Button 
                onClick={handleRetry} 
                variant="outline"
                className="flex items-center gap-2"
                disabled={isRetrying}
              >
                {isRetrying && <RefreshCw className="h-4 w-4 animate-spin" />}
                {isRetrying ? 'Retrying...' : 'Try Again'}
              </Button>
              <Button 
                onClick={() => window.location.href = '/sign-in'}
                className="flex items-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (hasValidToken && AuthService.isAuthenticated()) {
    console.log('ProtectedRoute: Valid token exists, rendering protected content', location.pathname);
    return <>{children}</>;
  }

  console.log('ProtectedRoute: No valid token found, redirecting to login');
  return <Navigate to="/sign-in" state={{ from: location.pathname }} replace />;
};
