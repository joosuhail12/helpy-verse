
import * as React from 'react';
import { RouterProvider } from "react-router-dom";
import { router } from '@/routes';
import LoadingFallback from './LoadingFallback';

const AppRoutes: React.FC = () => {
  return (
    <React.Suspense fallback={<LoadingFallback />}>
      <RouterProvider router={router} fallbackElement={<LoadingFallback />} />
    </React.Suspense>
  );
};

export default AppRoutes;
