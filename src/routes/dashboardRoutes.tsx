
import { lazy, Suspense } from 'react';
import RouteErrorBoundary from '@/components/app/RouteErrorBoundary';
import { Loader2 } from 'lucide-react';

// Define LoadingSpinner component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Lazy load dashboard pages
const Dashboard = lazy(() => import('../pages/Dashboard'));
const EmptyDashboard = lazy(() => import('../components/dashboard/EmptyDashboard'));

// Helper to wrap components with Suspense and ErrorBoundary
const withSuspenseAndErrorHandling = (Component) => (
  <RouteErrorBoundary>
    <Suspense fallback={<LoadingSpinner />}>
      <Component />
    </Suspense>
  </RouteErrorBoundary>
);

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: withSuspenseAndErrorHandling(Dashboard),
  },
  {
    path: '',
    element: withSuspenseAndErrorHandling(EmptyDashboard),
  }
];
