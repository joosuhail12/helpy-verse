
import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
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
      <RouteErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Inbox />
        </Suspense>
      </RouteErrorBoundary>
    ),
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
  },
  {
    path: 'inbox/mine',
    element: (
      <RouteErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <YourInbox />
        </Suspense>
      </RouteErrorBoundary>
    ),
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
  },
];
