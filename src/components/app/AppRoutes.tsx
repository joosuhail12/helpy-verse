
import React from 'react';
import { RouterProvider } from "react-router-dom";
import { router } from '@/routes';
import LoadingFallback from './LoadingFallback';

/**
 * Main routing component that manages application routes
 */
const AppRoutes: React.FC = () => {
  return (
    <RouterProvider 
      router={router} 
      fallbackElement={<LoadingFallback />} 
    />
  );
};

export default AppRoutes;
