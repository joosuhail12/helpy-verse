
import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import RootRedirect from '../components/app/RootRedirect';

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

// Lazy load dashboard layout
const DashboardLayoutComponent = lazy(() => import('../layouts/DashboardLayout'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />,
  },
  {
    path: '/sign-in',
    element: <Suspense fallback={<LoadingSpinner />}><SignIn /></Suspense>,
  },
  {
    path: '/forgot-password',
    element: <Suspense fallback={<LoadingSpinner />}><ForgotPassword /></Suspense>,
  },
  {
    path: '/reset-password',
    element: <Suspense fallback={<LoadingSpinner />}><ResetPassword /></Suspense>,
  },
  {
    path: '/sign-up',
    element: <Suspense fallback={<LoadingSpinner />}><SignUp /></Suspense>,
  },
  {
    path: '/',
    element: <Suspense fallback={<LoadingSpinner />}><DashboardLayoutComponent /></Suspense>,
    children: [
      ...dashboardRoutes,
      ...inboxRoutes,
      ...settingsRoutes,
      ...automationRoutes,
    ],
  },
  {
    path: '*',
    element: <Suspense fallback={<LoadingSpinner />}><NotFound /></Suspense>,
  },
]);

// Log the routes for debugging
console.log('Routes initialized:', router.routes);

export default router;
