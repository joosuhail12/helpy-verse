
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { initializeApp } from './AppInitializer';
import { getCookie } from '@/utils/helpers/helpers';

const RootRedirect: React.FC = () => {
  useEffect(() => {
    initializeApp();
  }, []);

  const token = getCookie("customerToken") || localStorage.getItem("token");
  return token ? <Navigate to="/home" replace /> : <Navigate to="/sign-in" replace />;
};

export default RootRedirect;
