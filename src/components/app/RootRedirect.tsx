
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { initializeApp } from './AppInitializer';
import { isAuthenticated } from '@/utils/auth/tokenManager';

const RootRedirect: React.FC = () => {
  useEffect(() => {
    console.log('Initializing app from RootRedirect');
    initializeApp();
  }, []);

  // Check authentication directly
  const isAuth = isAuthenticated();
  console.log('RootRedirect - Authentication status:', isAuth);
  
  // Direct to home/inbox/all as the default authenticated route
  if (isAuth) {
    console.log('RootRedirect: User is authenticated, redirecting to inbox');
    return <Navigate to="/home/inbox/all" replace />;
  } else {
    console.log('RootRedirect: User is not authenticated, redirecting to sign-in');
    return <Navigate to="/sign-in" replace />;
  }
};

export default RootRedirect;
