
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import RootRedirect from '../components/app/RootRedirect';
import { PrivateRoute } from '@/utils/helpers/Routes';
import ProtectedRouteWrapper from '@/components/auth/ProtectedRouteWrapper';
import LoadingSpinner from '@/components/common/LoadingSpinner';

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

// Lazy load dashboard layout
const DashboardLayoutComponent = lazy(() => import('../layouts/DashboardLayout'));

// Helper to wrap components with ProtectedRouteWrapper
const withProtection = (Component) => (
  <ProtectedRouteWrapper>
    <Component />
  </ProtectedRouteWrapper>
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
    element: <LandingPage />,
  },
  {
    path: '/home',
    element: <RootRedirect />,
  },
  {
    path: '/sign-in',
    element: <SignIn />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
  {
    path: '/sign-up',
    element: <SignUp />,
  },
  {
    path: '/home',
    element: (
      <PrivateRoute>
        <DashboardLayoutComponent />
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
    element: <NotFound />,
  },
]);

// Log the routes for debugging
console.log('Routes initialized:', router);
logRoutes(router.routes);

export default router;
