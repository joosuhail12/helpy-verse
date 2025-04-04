
import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Loader2 } from 'lucide-react';
import RouteErrorBoundary from '@/components/app/RouteErrorBoundary';

// Define LoadingSpinner component at the top of the file to avoid reference errors
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Import directly instead of using lazy loading for problematic components
import AllInbox from '../pages/inbox/All';

// Lazy load other inbox pages 
const YourInbox = lazy(() => import('../pages/inbox/YourInbox'));
const UnassignedInbox = lazy(() => import('../pages/inbox/Unassigned'));
const MentionsInbox = lazy(() => import('../pages/inbox/Mentions'));

// Helper function to wrap a component with Suspense, ProtectedRoute and RouteErrorBoundary
const withSuspenseAndProtection = (Component) => (
  <ProtectedRoute>
    <RouteErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <Component />
      </Suspense>
    </RouteErrorBoundary>
  </ProtectedRoute>
);

export const inboxRoutes = [
  {
    path: 'inbox',
    element: <Navigate to="all" replace />,
  },
  {
    path: 'inbox/your-inbox',
    element: withSuspenseAndProtection(YourInbox),
  },
  {
    path: 'inbox/all',
    // Use the directly imported component
    element: (
      <ProtectedRoute>
        <RouteErrorBoundary>
          <AllInbox />
        </RouteErrorBoundary>
      </ProtectedRoute>
    ),
  },
  {
    path: 'inbox/unassigned',
    element: withSuspenseAndProtection(UnassignedInbox),
  },
  {
    path: 'inbox/mentions',
    element: withSuspenseAndProtection(MentionsInbox),
  },
];
