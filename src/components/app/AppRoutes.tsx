
import React from 'react';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { router } from '@/routes';
import LoadingFallback from './LoadingFallback';

/**
 * AppRoutes component responsible for setting up the router
 * This ensures the Router context is properly initialized
 */
const AppRoutes: React.FC = () => {
  // Ensure we have a valid router instance
  if (!router) {
    console.error('Router is not properly initialized');
    return <div>Router initialization error</div>;
  }
  
  return <RouterProvider router={router} fallbackElement={<LoadingFallback />} />;
};

export default AppRoutes;
