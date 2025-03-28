
import React, { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import RootRedirect from '../components/app/RootRedirect';
import RouteErrorBoundary from '@/components/app/RouteErrorBoundary';
import { PrivateRoute } from '@/utils/helpers/Routes';

// Define LoadingSpinner first to avoid reference errors
export const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Import route modules
import { dashboardRoutes } from './dashboardRoutes';
import { inboxRoutes } from './inboxRoutes';
import { settingsRoutes } from './settingsRoutes';
import { automationRoutes } from './automationRoutes';

// Lazy load components
const SignIn = lazy(() => import('../pages/SignIn'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/ResetPassword'));
const SignUp = lazy(() => import('../pages/SignUp'));
const NotFound = lazy(() => import('../pages/NotFound'));
const LandingPage = lazy(() => import('../pages/LandingPage'));

// Lazy load dashboard layout - make sure it's imported correctly
const DashboardLayout = lazy(() => import('../layouts/DashboardLayout'));

// Helper to wrap components with Suspense and RouteErrorBoundary
const withSuspenseAndErrorHandling = (Component) => (
  <RouteErrorBoundary>
    <Suspense fallback={<LoadingSpinner />}>
      <Component />
    </Suspense>
  </RouteErrorBoundary>
);

// Ensure we have the router instance properly created
export const router = createBrowserRouter([
  {
    path: '/',
    element: withSuspenseAndErrorHandling(LandingPage),
  },
  {
    path: '/home',
    element: <RootRedirect />,
  },
  {
    path: '/sign-in',
    element: withSuspenseAndErrorHandling(SignIn),
  },
  {
    path: '/forgot-password',
    element: withSuspenseAndErrorHandling(ForgotPassword),
  },
  {
    path: '/reset-password',
    element: withSuspenseAndErrorHandling(ResetPassword),
  },
  {
    path: '/sign-up',
    element: withSuspenseAndErrorHandling(SignUp),
  },
  {
    path: '/home',
    element: (
      <PrivateRoute>
        <Suspense fallback={<LoadingSpinner />}>
          <DashboardLayout />
        </Suspense>
      </PrivateRoute>
    ),
    children: [
      ...dashboardRoutes,
      ...inboxRoutes,
      ...settingsRoutes, 
      ...automationRoutes,
    ],
  },
  {
    path: '*',
    element: withSuspenseAndErrorHandling(NotFound),
  },
]);

export default router;
