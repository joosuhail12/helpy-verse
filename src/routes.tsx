
import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import RootRedirect from './components/app/RootRedirect';
import RouteErrorBoundary from '@/components/app/RouteErrorBoundary';
import { PrivateRoute } from '@/utils/helpers/Routes';

// Import route modules
import { dashboardRoutes } from './routes/dashboardRoutes';
import { inboxRoutes } from './routes/inboxRoutes';
import { settingsRoutes } from './routes/settingsRoutes';
import { automationRoutes } from './routes/automationRoutes';

// Define LoadingSpinner first to avoid reference errors
export const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Lazy load components
const SignIn = lazy(() => import('./pages/SignIn'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const SignUp = lazy(() => import('./pages/SignUp'));
const NotFound = lazy(() => import('./pages/NotFound'));
const LandingPage = lazy(() => import('./pages/LandingPage'));

// Lazy load dashboard layout
const DashboardLayoutComponent = lazy(() => import('./layouts/DashboardLayout'));

// Helper to wrap components with Suspense and RouteErrorBoundary
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
          <DashboardLayoutComponent />
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

// Log the routes for debugging
logRoutes(router.routes);
console.log('Routes initialized:', router.routes);

export default router;
