
import * as React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import RootRedirect from '../components/app/RootRedirect';
import RouteErrorBoundary from '@/components/app/RouteErrorBoundary';
import { isAuthenticated } from '@/utils/auth/tokenManager';

// Define LoadingSpinner first to avoid reference errors
export const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Import directly instead of lazy loading for problematic components
import AllInbox from '@/pages/inbox/All';
import DashboardLayout from '@/layouts/DashboardLayout';

// Import route modules
import { dashboardRoutes } from './dashboardRoutes';
import { settingsRoutes } from './settingsRoutes';
import { automationRoutes } from './automationRoutes';

// Lazy load auth pages and other components correctly
const SignIn = React.lazy(() => import('../pages/SignIn'));
const ForgotPassword = React.lazy(() => import('../pages/ForgotPassword'));
const ResetPassword = React.lazy(() => import('../pages/ResetPassword'));
const SignUp = React.lazy(() => import('../pages/SignUp'));
const NotFound = React.lazy(() => import('../pages/NotFound'));
const LandingPage = React.lazy(() => import('../pages/LandingPage'));
const YourInbox = React.lazy(() => import('../pages/inbox/YourInbox'));
const UnassignedInbox = React.lazy(() => import('../pages/inbox/Unassigned'));
const MentionsInbox = React.lazy(() => import('../pages/inbox/Mentions'));

// Helper to wrap components with Suspense and RouteErrorBoundary
const withSuspenseAndErrorHandling = (Component: React.FC) => (
  <RouteErrorBoundary>
    <React.Suspense fallback={<LoadingSpinner />}>
      <Component />
    </React.Suspense>
  </RouteErrorBoundary>
);

// Simple PrivateRoute component for the router
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  return isAuthenticated() ? children : <Navigate to="/sign-in" replace />;
};

// Define the router
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
          <DashboardLayout />
        </React.Suspense>
      </PrivateRoute>
    ),
    children: [
      // Define critical inbox routes directly to avoid dynamic import issues
      {
        path: 'inbox/all',
        element: (
          <RouteErrorBoundary>
            <AllInbox />
          </RouteErrorBoundary>
        ),
      },
      {
        path: 'inbox/your-inbox',
        element: (
          <RouteErrorBoundary>
            <React.Suspense fallback={<LoadingSpinner />}>
              <YourInbox />
            </React.Suspense>
          </RouteErrorBoundary>
        ),
      },
      {
        path: 'inbox/unassigned',
        element: (
          <RouteErrorBoundary>
            <React.Suspense fallback={<LoadingSpinner />}>
              <UnassignedInbox />
            </React.Suspense>
          </RouteErrorBoundary>
        ),
      },
      {
        path: 'inbox/mentions',
        element: (
          <RouteErrorBoundary>
            <React.Suspense fallback={<LoadingSpinner />}>
              <MentionsInbox />
            </React.Suspense>
          </RouteErrorBoundary>
        ),
      },
      // Add redirect for inbox index
      {
        path: 'inbox',
        element: <Navigate to="all" replace />,
      },
      // Add other routes from route configs, filtering out duplicates
      ...dashboardRoutes.filter(route => !route.path.includes('inbox/')),
      ...settingsRoutes,
      ...automationRoutes,
    ],
  },
  {
    path: '*',
    element: withSuspenseAndErrorHandling(NotFound),
  },
]);

// Log for debugging
console.log('Router initialized with routes:', router.routes.length);

// For compatibility with existing code
export const allRoutes = [
  ...dashboardRoutes,
  ...settingsRoutes,
  ...automationRoutes
];
