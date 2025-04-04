
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/routing/ProtectedRoute';

// Import the components directly to avoid dynamic import issues
const YourInbox = lazy(() => import('../pages/inbox/YourInbox'));
const AllInbox = lazy(() => import('../pages/inbox/All'));
const UnassignedInbox = lazy(() => import('../pages/inbox/Unassigned'));
const MentionsInbox = lazy(() => import('../pages/inbox/Mentions'));

export const inboxRoutes = [
  {
    path: 'inbox',
    element: <Navigate to="/home/inbox/all" replace />,
  },
  {
    path: 'inbox/your-inbox',
    element: (
      <ProtectedRoute>
        <YourInbox />
      </ProtectedRoute>
    ),
  },
  {
    path: 'inbox/all',
    element: (
      <ProtectedRoute>
        <AllInbox />
      </ProtectedRoute>
    ),
  },
  {
    path: 'inbox/unassigned',
    element: (
      <ProtectedRoute>
        <UnassignedInbox />
      </ProtectedRoute>
    ),
  },
  {
    path: 'inbox/mentions',
    element: (
      <ProtectedRoute>
        <MentionsInbox />
      </ProtectedRoute>
    ),
  },
];
