
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

// Import route components - fixing the imports to match the exported names
import { DashboardRoutes } from './dashboardRoutes';
import { InboxRoutes } from './inboxRoutes';
import { AutomationRoutes } from './automationRoutes';
// Import settings routes correctly
import SettingsRoutes from './settingsRoutes';

// Lazy load components
const SignIn = lazy(() => import('../pages/SignIn'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/ResetPassword'));
const SignUp = lazy(() => import('../pages/SignUp'));
const NotFound = lazy(() => import('../pages/NotFound'));
const LandingPage = lazy(() => import('../pages/LandingPage'));

// Lazy load dashboard layout - make sure it's imported correctly
const DashboardLayout = lazy(() => import('../layouts/DashboardLayout'));

// Helper to wrap components with Suspense and RouteErrorHandling
const withSuspenseAndErrorHandling = (Component) => (
  <RouteErrorBoundary>
    <Suspense fallback={<LoadingSpinner />}>
      <Component />
    </Suspense>
  </RouteErrorBoundary>
);

// Log all available routes for debugging
const logRoutes = (routes) => {
  console.log('Available routes:');
  const flattenRoutes = (routeArray, parentPath = '') => {
    routeArray.forEach(route => {
      if (route.path) {
        const fullPath = parentPath ? `${parentPath}/${route.path}` : route.path;
        console.log(`- ${fullPath}`);
      }
      if (route.children) {
        const nextParent = route.path ? (parentPath ? `${parentPath}/${route.path}` : route.path) : parentPath;
        flattenRoutes(route.children, nextParent);
      }
    });
  };
  
  flattenRoutes(routes);
};

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
      ...DashboardRoutes,
      ...InboxRoutes,
      ...AutomationRoutes,
      {
        path: "settings/*",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <SettingsRoutes />
          </Suspense>
        )
      }
    ],
  },
  {
    path: '*',
    element: withSuspenseAndErrorHandling(NotFound),
  },
]);

// Log the routes for debugging
logRoutes(router.routes);
console.log('Routes initialized:', router.routes);

export default router;
