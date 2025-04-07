
import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '@/utils/auth/tokenManager';

const RootRedirect: React.FC = () => {
  console.log('RootRedirect: Checking authentication status');
  const isAuth = isAuthenticated();
  
  if (isAuth) {
    console.log('RootRedirect: User is authenticated, redirecting to inbox');
    return <Navigate to="/home/inbox/all" replace />;
  } else {
    console.log('RootRedirect: User is not authenticated, redirecting to sign-in');
    return <Navigate to="/sign-in" replace />;
  }
};

export default RootRedirect;
