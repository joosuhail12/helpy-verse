
import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Loader2 } from 'lucide-react';

// Define LoadingSpinner component at the top of the file to avoid reference errors
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Lazy load inbox pages
const YourInbox = lazy(() => import('../pages/inbox/YourInbox'));
const AllInbox = lazy(() => import('../pages/inbox/All'));
const UnassignedInbox = lazy(() => import('../pages/inbox/Unassigned'));
const MentionsInbox = lazy(() => import('../pages/inbox/Mentions'));

// Helper function to wrap a component with Suspense and ProtectedRoute
const withSuspenseAndProtection = (Component) => (
  <ProtectedRoute>
    <Suspense fallback={<LoadingSpinner />}>
      <Component />
    </Suspense>
  </ProtectedRoute>
);

export const inboxRoutes = [
  {
    path: 'inbox',
    element: <Navigate to="/inbox/all" replace />,
  },
  {
    path: 'inbox/your-inbox',
    element: withSuspenseAndProtection(YourInbox),
  },
  {
    path: 'inbox/all',
    element: withSuspenseAndProtection(AllInbox),
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
