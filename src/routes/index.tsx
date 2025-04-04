
import * as React from 'react';
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

// Lazy load components - make sure to use consistent naming pattern
const SignIn = React.lazy(() => import('../pages/SignIn'));
const ForgotPassword = React.lazy(() => import('../pages/ForgotPassword'));
const ResetPassword = React.lazy(() => import('../pages/ResetPassword'));
const SignUp = React.lazy(() => import('../pages/SignUp'));
const NotFound = React.lazy(() => import('../pages/NotFound'));
const LandingPage = React.lazy(() => import('../pages/LandingPage'));

// Lazy load dashboard layout
const DashboardLayoutComponent = React.lazy(() => import('../layouts/DashboardLayout'));

// Helper to wrap components with Suspense and RouteErrorBoundary
const withSuspenseAndErrorHandling = (Component) => (
  <RouteErrorBoundary>
    <React.Suspense fallback={<LoadingSpinner />}>
      <Component />
    </React.Suspense>
  </RouteErrorBoundary>
);

// Define the router - this will be used for reference but not directly used in the app
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
        <React.Suspense fallback={<LoadingSpinner />}>
          <DashboardLayoutComponent />
        </React.Suspense>
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

// Export routes to be used by AppRoutes.tsx
export const allRoutes = [
  ...dashboardRoutes,
  ...inboxRoutes,
  ...settingsRoutes,
  ...automationRoutes
];

console.log('Routes initialized:', router.routes);
