
import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Loader2, WifiOff, AlertTriangle, RefreshCw, LogIn } from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchUserData } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuthContext } from '@/hooks/useAuthContext';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { 
    isAuthenticated, 
    isLoading: authLoading, 
    hasWorkspace,
    refreshToken,
    validateAuthContext
  } = useAuthContext();
  
  const [isChecking, setIsChecking] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  
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
      
      if (!isAuthenticated) {
        console.warn('ProtectedRoute: Not authenticated, will redirect to login');
        setAuthError('Authentication required');
        setIsChecking(false);
        return;
      }

      if (!hasWorkspace) {
        console.warn('ProtectedRoute: No workspace ID found');
        
        try {
          // Try to fetch user data to get workspace ID
          await dispatch(fetchUserData()).unwrap();
          
          // Check if we now have a workspace ID
          if (!validateAuthContext()) {
            setAuthError('Unable to determine your workspace. Please sign in again.');
            setIsChecking(false);
            return;
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setAuthError('Failed to load workspace data. Please sign in again.');
          setIsChecking(false);
          return;
        }
      }

      // All checks passed
      setAuthError(null);
      setIsChecking(false);
    };

    // Only run check if not already authenticated or if retrying
    if (!isChecking || authLoading) {
      return;
    }
    
    checkAuth();
  }, [dispatch, location.pathname, isOffline, isRetrying, isAuthenticated, hasWorkspace, validateAuthContext, isChecking, authLoading]);

  const handleRetry = async () => {
    setIsRetrying(true);
    setIsChecking(true);
    setAuthError(null);
    
    try {
      if (isAuthenticated) {
        await refreshToken();
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

  if (isChecking || authLoading) {
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

  if (isAuthenticated && validateAuthContext()) {
    console.log('ProtectedRoute: Valid authentication, rendering protected content', location.pathname);
    return <>{children}</>;
  }

  console.log('ProtectedRoute: Authentication validation failed, redirecting to login');
  return <Navigate to="/sign-in" state={{ from: location.pathname }} replace />;
};
