
import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '@/utils/auth/tokenManager';

/**
 * Handles redirection for root and /home paths to the appropriate dashboard page
 */
const RootRedirect = () => {
  const navigate = useNavigate();
  const isAuth = isAuthenticated();
  
  console.log('RootRedirect: Checking auth status:', isAuth);
  
  useEffect(() => {
    // Add logging to track navigation
    console.log('RootRedirect: Redirecting authenticated user to inbox');
  }, []);
  
  // If authenticated, redirect to inbox as the default landing page
  if (isAuth) {
    console.log('RootRedirect: User is authenticated, redirecting to /home/inbox/all');
    return <Navigate to="/home/inbox/all" replace />;
  }
  
  // If not authenticated, redirect to sign-in
  console.log('RootRedirect: User is not authenticated, redirecting to /sign-in');
  return <Navigate to="/sign-in" replace />;
};

export default RootRedirect;
