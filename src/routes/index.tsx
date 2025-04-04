import * as React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import RootRedirect from '../components/app/RootRedirect';
import RouteErrorBoundary from '@/components/app/RouteErrorBoundary';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Import directly instead of lazy loading for crucial components to avoid loading errors
import LandingPage from '@/pages/LandingPage';
import DashboardLayout from '@/layouts/DashboardLayout';
import AllInbox from '@/pages/inbox/All';
import SignIn from '@/pages/SignIn'; // Import SignIn directly instead of lazy loading

// Lazy load auth pages and other components with consistent fallback
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Lazy load these components instead
const ForgotPassword = React.lazy(() => import('../pages/ForgotPassword'));
const ResetPassword = React.lazy(() => import('../pages/ResetPassword'));
const SignUp = React.lazy(() => import('../pages/SignUp'));
const NotFound = React.lazy(() => import('../pages/NotFound'));
const YourInbox = React.lazy(() => import('../pages/inbox/YourInbox'));
const UnassignedInbox = React.lazy(() => import('../pages/inbox/Unassigned'));
const MentionsInbox = React.lazy(() => import('../pages/inbox/Mentions'));

// Import route modules
import { dashboardRoutes } from './dashboardRoutes';
import { settingsRoutes } from './settingsRoutes';
import { automationRoutes } from './automationRoutes';

// Helper to wrap components with Suspense and RouteErrorBoundary
const withSuspenseAndErrorHandling = (Component) => (
  <RouteErrorBoundary>
    <React.Suspense fallback={<LoadingSpinner />}>
      {Component}
    </React.Suspense>
  </RouteErrorBoundary>
);

// Define the router
export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <RouteErrorBoundary>
        <LandingPage />
      </RouteErrorBoundary>
    ),
  },
  {
    path: '/home',
    element: <RootRedirect />,
  },
  {
    path: '/sign-in',
    element: (
      <RouteErrorBoundary>
        <SignIn />
      </RouteErrorBoundary>
    ),
  },
  {
    path: '/forgot-password',
    element: withSuspenseAndErrorHandling(<ForgotPassword />),
  },
  {
    path: '/reset-password',
    element: withSuspenseAndErrorHandling(<ResetPassword />),
  },
  {
    path: '/sign-up',
    element: withSuspenseAndErrorHandling(<SignUp />),
  },
  {
    path: '/home',
    element: (
      <ProtectedRoute>
        <React.Suspense fallback={<LoadingSpinner />}>
          <DashboardLayout />
        </React.Suspense>
      </ProtectedRoute>
    ),
    children: [
      // Define critical inbox routes directly
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
      // Process all settings routes with proper error handling
      ...processRoutes([...dashboardRoutes, ...settingsRoutes, ...automationRoutes]),
    ],
  },
  {
    path: '*',
    element: withSuspenseAndErrorHandling(<NotFound />),
  },
]);

// Simplified route processing function
function processRoutes(routes) {
  return routes.map(route => {
    // Skip routes that are explicitly handled above
    if (route.path && (
      route.path === 'inbox/all' || 
      route.path === 'inbox/your-inbox' ||
      route.path === 'inbox/unassigned' ||
      route.path === 'inbox/mentions'
    )) {
      return null;
    }
    
    if (route.element) {
      return {
        ...route,
        element: (
          <RouteErrorBoundary>
            <React.Suspense fallback={<LoadingSpinner />}>
              {route.element}
            </React.Suspense>
          </RouteErrorBoundary>
        )
      };
    }
    
    return route;
  }).filter(Boolean);
}

// Log for debugging
console.log('Router initialized with routes:', router.routes.length);

// For compatibility with existing code
export const allRoutes = [
  ...dashboardRoutes,
  ...settingsRoutes,
  ...automationRoutes
];
