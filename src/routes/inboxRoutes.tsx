
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import ProtectedRouteWrapper from '@/components/auth/ProtectedRouteWrapper';

// Lazy load inbox pages
const YourInbox = lazy(() => import('../pages/inbox/YourInbox'));
const AllInbox = lazy(() => import('../pages/inbox/All'));
const UnassignedInbox = lazy(() => import('../pages/inbox/Unassigned'));
const MentionsInbox = lazy(() => import('../pages/inbox/Mentions'));

// Helper function to wrap a component with ProtectedRouteWrapper
const withProtection = (Component) => (
  <ProtectedRouteWrapper>
    <Component />
  </ProtectedRouteWrapper>
);

export const inboxRoutes = [
  {
    path: 'inbox',
    element: <Navigate to="/home/inbox/all" replace />,
  },
  {
    path: 'inbox/your-inbox',
    element: withProtection(YourInbox),
  },
  {
    path: 'inbox/all',
    element: withProtection(AllInbox),
  },
  {
    path: 'inbox/unassigned',
    element: withProtection(UnassignedInbox),
  },
  {
    path: 'inbox/mentions',
    element: withProtection(MentionsInbox),
  },
];
