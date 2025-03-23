
import { lazy, Suspense } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import { LoadingSpinner } from './index';
import RouteErrorBoundary from '@/components/app/RouteErrorBoundary';

// Lazy load inbox pages
const Inbox = lazy(() => import('../pages/Inbox'));
const YourInbox = lazy(() => import('../pages/inbox/YourInbox'));
const Unassigned = lazy(() => import('../pages/inbox/Unassigned'));
const Mentions = lazy(() => import('../pages/inbox/Mentions'));
const Channels = lazy(() => import('../pages/inbox/Channels'));
const AllTickets = lazy(() => import('../pages/inbox/All'));

// Helper for creating consistent route objects with error handling
const createInboxRoute = (path: string, Component: React.ComponentType) => ({
  path,
  element: (
    <RouteErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <Component />
      </Suspense>
    </RouteErrorBoundary>
  )
});

export const inboxRoutes: RouteObject[] = [
  {
    path: 'inbox',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Navigate to="/home/inbox/all" replace />
      </Suspense>
    ),
  },
  createInboxRoute('inbox/all', AllTickets),
  createInboxRoute('inbox/your-inbox', YourInbox),
  createInboxRoute('inbox/unassigned', Unassigned),
  createInboxRoute('inbox/mentions', Mentions),
  {
    path: 'inbox/channel/:channelId',
    element: (
      <RouteErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Channels />
        </Suspense>
      </RouteErrorBoundary>
    ),
  },
];

// Add debug logs for all routes
console.log('Inbox routes initialized:', inboxRoutes.map(route => route.path));
