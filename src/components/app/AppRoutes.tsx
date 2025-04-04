
import React from 'react';
import { RouterProvider } from "react-router-dom";
import { router } from '@/routes';
import LoadingFallback from './LoadingFallback';

const AppRoutes: React.FC = () => {
  // Add debugging to verify the router is properly initialized
  console.log('AppRoutes rendering with router:', router);
  return <RouterProvider router={router} fallbackElement={<LoadingFallback />} />;
};

export default AppRoutes;
