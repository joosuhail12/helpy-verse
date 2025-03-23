
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
  if (location.pathname !== '/home' && location.pathname !== '/home/') {
    console.log('Already on a specific path, not redirecting');
    return null;
  }
  
  // If authenticated, go to inbox, otherwise go to landing page
  return token ? 
    <Navigate to="/home/inbox/all" replace /> : 
    <Navigate to="/" replace />;
};

export default RootRedirect;
