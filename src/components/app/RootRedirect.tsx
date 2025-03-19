
import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { initializeApp } from './AppInitializer';
import { getCookie } from '@/utils/helpers/helpers';

const RootRedirect: React.FC = () => {
  const location = useLocation();
  
  useEffect(() => {
    initializeApp();
  }, []);

  const token = getCookie("customerToken") || localStorage.getItem("token");
  
  // If we're already on the home or sign-in page, don't redirect
  if (location.pathname === '/home' || location.pathname === '/sign-in') {
    return null;
  }
  
  return token ? <Navigate to="/home" replace /> : <Navigate to="/sign-in" replace />;
};

export default RootRedirect;
