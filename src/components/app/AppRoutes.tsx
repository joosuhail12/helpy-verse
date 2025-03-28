
import React from 'react';
import { RouterProvider } from "react-router-dom";
import { router } from '@/routes/index';
import LoadingFallback from './LoadingFallback';

const AppRoutes: React.FC = () => {
  console.log('Rendering AppRoutes component');
  return <RouterProvider router={router} fallbackElement={<LoadingFallback />} />;
};

export default AppRoutes;
