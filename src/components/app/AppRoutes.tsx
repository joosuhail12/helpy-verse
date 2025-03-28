
import React, { Suspense } from 'react';
import { RouterProvider } from "react-router-dom";
import { router } from '@/routes';
import LoadingFallback from './LoadingFallback';

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RouterProvider router={router} fallbackElement={<LoadingFallback />} />
    </Suspense>
  );
};

export default AppRoutes;
