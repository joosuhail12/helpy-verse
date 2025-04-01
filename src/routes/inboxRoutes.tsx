
import { lazy, Suspense, ReactNode } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Loader2 } from 'lucide-react';
import RouteErrorBoundary from '@/components/app/RouteErrorBoundary';

// Define LoadingSpinner component at the top of the file to avoid reference errors
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Lazy load inbox pages - Fix the import paths to use the exact path without potential casing issues
const YourInbox = lazy(() => import('../pages/inbox/YourInbox'));
const AllInbox = lazy(() => import('../pages/inbox/All')); // Fixed import path back to lowercase folder
const UnassignedInbox = lazy(() => import('../pages/inbox/Unassigned'));
const MentionsInbox = lazy(() => import('../pages/inbox/Mentions'));

// Helper function to wrap a component with Suspense, ProtectedRoute and RouteErrorBoundary
const withSuspenseAndProtection = (Component: ReactNode) => (
  <ProtectedRoute>
    <RouteErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        {Component}
      </Suspense>
    </RouteErrorBoundary>
  </ProtectedRoute>
);

// Export routes array for use in router configuration
export const InboxRoutes = [
  { path: "inbox", element: <Navigate to="all" replace /> },
  { path: "inbox/your-inbox", element: withSuspenseAndProtection(<YourInbox />) },
  { path: "inbox/all", element: withSuspenseAndProtection(<AllInbox />) },
  { path: "inbox/unassigned", element: withSuspenseAndProtection(<UnassignedInbox />) },
  { path: "inbox/mentions", element: withSuspenseAndProtection(<MentionsInbox />) }
];

// Also export as a component for direct usage
export const InboxRoutesComponent = () => {
  return (
    <Routes>
      <Route path="" element={<Navigate to="all" replace />} />
      <Route path="your-inbox" element={withSuspenseAndProtection(<YourInbox />)} />
      <Route path="all" element={withSuspenseAndProtection(<AllInbox />)} />
      <Route path="unassigned" element={withSuspenseAndProtection(<UnassignedInbox />)} />
      <Route path="mentions" element={withSuspenseAndProtection(<MentionsInbox />)} />
    </Routes>
  );
};
