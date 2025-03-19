
import { lazy, Suspense, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { LoadingSpinner } from './index';

// Lazy load inbox pages
const Inbox = lazy(() => import('../pages/Inbox').catch(() => {
  console.error('Failed to load Inbox page');
  throw new Error('Failed to load Inbox page');
}));
const AllTickets = lazy(() => import('../pages/inbox/All').catch(() => {
  console.error('Failed to load All Tickets page');
  throw new Error('Failed to load All Tickets page');
}));
const YourInbox = lazy(() => import('../pages/inbox/YourInbox').catch(() => {
  console.error('Failed to load Your Inbox page');
  throw new Error('Failed to load Your Inbox page');
}));
const Mentions = lazy(() => import('../pages/inbox/Mentions').catch(() => {
  console.error('Failed to load Mentions page');
  throw new Error('Failed to load Mentions page');
}));
const Unassigned = lazy(() => import('../pages/inbox/Unassigned').catch(() => {
  console.error('Failed to load Unassigned page');
  throw new Error('Failed to load Unassigned page');
}));

// Helper to wrap components with Suspense and ProtectedRoute
const withSuspenseAndProtection = (component: ReactNode) => (
  <ProtectedRoute>
    <Suspense fallback={<LoadingSpinner />}>
      {component}
    </Suspense>
  </ProtectedRoute>
);

export const inboxRoutes = [
  {
    path: 'inbox',
    element: withSuspenseAndProtection(<Inbox />),
    children: [
      {
        path: 'all',
        element: <Suspense fallback={<LoadingSpinner />}><AllTickets /></Suspense>,
      },
      {
        path: 'your-inbox',
        element: <Suspense fallback={<LoadingSpinner />}><YourInbox /></Suspense>,
      },
      {
        path: 'mentions',
        element: <Suspense fallback={<LoadingSpinner />}><Mentions /></Suspense>,
      },
      {
        path: 'unassigned',
        element: <Suspense fallback={<LoadingSpinner />}><Unassigned /></Suspense>,
      },
      {
        path: '',
        element: <Navigate to="all" replace />,
      }
    ],
  },
];
