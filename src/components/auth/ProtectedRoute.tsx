
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { getCookie } from '@/utils/helpers/helpers';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchUserData } from '@/store/slices/authSlice';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [isChecking, setIsChecking] = useState(true);
  const { isAuthenticated, loading, error } = useAppSelector((state) => state.auth);
  
  useEffect(() => {
    const checkAuth = async () => {
      // Get token from cookie
      const token = getCookie("customerToken");
      
      // If we have a token but Redux state says we're not authenticated,
      // try to refresh user data, but don't wait for the result
      if (token && !isAuthenticated && !loading) {
        try {
          dispatch(fetchUserData());
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Continue anyway since we have a token
        }
      }
      
      // Short delay to ensure state is settled
      setTimeout(() => {
        setIsChecking(false);
      }, 300);
    };
    
    checkAuth();
  }, [dispatch, isAuthenticated, loading]);

  // Show loading state while checking
  if (isChecking || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Consider authenticated if either Redux state OR token exists
  const hasToken = !!getCookie("customerToken");
  
  // Critical: Both conditions are checked to determine authentication status
  if (isAuthenticated || hasToken) {
    console.log('ProtectedRoute: Authentication verified, rendering protected content');
    return <>{children}</>;
  }

  // Not authenticated, redirect to login
  console.log('ProtectedRoute: Not authenticated, redirecting to login');
  return <Navigate to="/sign-in" state={{ from: location.pathname }} replace />;
};
