
import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { initializeApp } from './AppInitializer';
import { isAuthenticated } from '@/utils/auth/tokenManager';

const RootRedirect: React.FC = () => {
  const location = useLocation();
  
  useEffect(() => {
    console.log('Initializing app from RootRedirect');
    initializeApp();
  }, []);

  // Check authentication directly
  const isAuth = isAuthenticated();
  console.log('RootRedirect - Authentication status:', isAuth, 'Current path:', location.pathname);
  
  // If we're already on a specific path, don't redirect
  if (location.pathname !== '/home' && location.pathname !== '/home/') {
    console.log('Already on a specific path, not redirecting');
    return null;
  }
  
  // Direct to home/inbox/all as the default authenticated route
  if (isAuth) {
    return <Navigate to="/home/inbox/all" replace />;
  } else {
    return <Navigate to="/sign-in" replace />;
  }
};

export default RootRedirect;
