
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

export const inboxRoutes: RouteObject[] = [
  {
    path: 'inbox',
    element: (
      <Navigate to="/home/inbox/all" replace />
    ),
    errorElement: <RouteErrorBoundary><LoadingSpinner /></RouteErrorBoundary>,
  },
  {
    path: 'inbox/all',
    element: (
      <RouteErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Inbox />
        </Suspense>
      </RouteErrorBoundary>
    ),
    errorElement: <RouteErrorBoundary><LoadingSpinner /></RouteErrorBoundary>,
  },
  {
    path: 'inbox/your-inbox',
    element: (
      <RouteErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <YourInbox />
        </Suspense>
      </RouteErrorBoundary>
    ),
    errorElement: <RouteErrorBoundary><LoadingSpinner /></RouteErrorBoundary>,
  },
  {
    path: 'inbox/unassigned',
    element: (
      <RouteErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Unassigned />
        </Suspense>
      </RouteErrorBoundary>
    ),
    errorElement: <RouteErrorBoundary><LoadingSpinner /></RouteErrorBoundary>,
  },
  {
    path: 'inbox/mentions',
    element: (
      <RouteErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Mentions />
        </Suspense>
      </RouteErrorBoundary>
    ),
    errorElement: <RouteErrorBoundary><LoadingSpinner /></RouteErrorBoundary>,
  },
  {
    path: 'inbox/channel/:channelId',
    element: (
      <RouteErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Channels />
        </Suspense>
      </RouteErrorBoundary>
    ),
    errorElement: <RouteErrorBoundary><LoadingSpinner /></RouteErrorBoundary>,
  },
];
