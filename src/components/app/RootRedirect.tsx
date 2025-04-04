
import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '@/utils/auth/tokenManager';
import { initializeApp } from './AppInitializer';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchUserData } from '@/store/slices/auth/userActions';

const RootRedirect: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    console.log('RootRedirect: Initializing app');
    // Initialize app and fetch user data if authenticated
    initializeApp();
    
    if (isAuthenticated()) {
      dispatch(fetchUserData()).catch(error => {
        console.error('Error fetching user data in RootRedirect:', error);
      });
    }
  }, [dispatch]);

  // If user is not authenticated, redirect to sign-in
  if (!isAuthenticated()) {
    console.log('RootRedirect: User not authenticated, redirecting to login');
    return <Navigate to="/sign-in" replace />;
  }
  
  // For authenticated users at /home path, redirect to inbox
  if (location.pathname === '/home' || location.pathname === '/home/') {
    console.log('RootRedirect: User authenticated, redirecting to inbox');
    return <Navigate to="/home/inbox/all" replace />;
  }
  
  // For other paths, don't redirect
  console.log('RootRedirect: No redirection needed');
  return null;
};

export default RootRedirect;
