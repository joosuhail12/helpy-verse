
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import RootRedirect from '../components/app/RootRedirect';

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

export const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
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
    path: '/',
    element: <DashboardLayoutComponent />,
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

export default router;
