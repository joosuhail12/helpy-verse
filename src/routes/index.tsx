import React, { lazy } from 'react';
import { createBrowserRouter, RouteObject } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import SignIn from '@/pages/SignIn';
import Home from '@/pages/Home';
import LoadingFallback from '@/components/app/LoadingFallback';

// Lazy load routes for better performance
const SignUp = lazy(() => import('@/pages/SignUp'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/sign-in',
    element: <SignIn />,
  },
  {
    path: '/sign-up',
    element: 
      <React.Suspense fallback={<LoadingFallback />}>
        <SignUp />
      </React.Suspense>,
  },
  {
    path: '/forgot-password',
    element: 
      <React.Suspense fallback={<LoadingFallback />}>
        <ForgotPassword />
      </React.Suspense>,
  },
  {
    path: '/home/*',
    element: <Home />,
    children: [
      // Home sub-routes can be added here
    ],
  },
  {
    path: '*',
    element: 
      <React.Suspense fallback={<LoadingFallback />}>
        <NotFound />
      </React.Suspense>,
  },
];

export const router = createBrowserRouter(routes);
export default router;
