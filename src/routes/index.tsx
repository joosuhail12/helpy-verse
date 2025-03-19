
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import SignIn from '../pages/SignIn';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import SignUp from '../pages/SignUp';
import NotFound from '../pages/NotFound';

// Import route modules
import { dashboardRoutes } from './dashboardRoutes';
import { inboxRoutes } from './inboxRoutes';
import { settingsRoutes } from './settingsRoutes';
import { automationRoutes } from './automationRoutes';

// Lazy load dashboard layout
const DashboardLayoutComponent = lazy(() => import('../layouts/DashboardLayout').catch(() => {
  console.error('Failed to load DashboardLayout');
  throw new Error('Failed to load DashboardLayout');
}));

export const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SignIn />,
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
