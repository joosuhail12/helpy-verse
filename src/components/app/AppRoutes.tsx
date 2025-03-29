
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes/index';

/**
 * Component for application routing
 * Uses React Router v6 for handling routes
 */
const AppRoutes: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
