
import React from 'react';
import { RouterProvider } from "react-router-dom";
import { router } from '@/routes';
import LoadingFallback from './LoadingFallback';

const AppRoutes: React.FC = () => {
  // RouterProvider provides the routing context needed for useNavigate
  return <RouterProvider router={router} fallbackElement={<LoadingFallback />} />;
};

export default AppRoutes;
