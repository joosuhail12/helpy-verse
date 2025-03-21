
import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { initializeApp } from './AppInitializer';
import { getCookie } from '@/utils/helpers/helpers';

const RootRedirect: React.FC = () => {
  const location = useLocation();
  
  useEffect(() => {
    console.log('Initializing app from RootRedirect');
    initializeApp();
  }, []);

  const token = getCookie("customerToken") || localStorage.getItem("token");
  console.log('RootRedirect - token exists:', !!token, 'Current path:', location.pathname);
  
  // If we're already on a specific path, don't redirect
  if (location.pathname !== '/' && location.pathname !== '') {
    console.log('Already on a specific path, not redirecting');
    return null;
  }
  
  // Direct to home/contacts/all instead of just /home
  return token ? <Navigate to="/home/contacts/all" replace /> : <Navigate to="/sign-in" replace />;
};

export default RootRedirect;
