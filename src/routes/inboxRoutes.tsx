
import { lazy, Suspense } from 'react';
import { LoadingSpinner } from '@/routes';

// Lazy load inbox components
const Inbox = lazy(() => import('@/pages/Inbox'));

export const inboxRoutes = [
  {
    path: 'inbox',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Inbox />
      </Suspense>
    ),
    children: [
      {
        path: 'all',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <div className="p-4">
              <h1 className="text-2xl font-bold">All Messages</h1>
              <div className="mt-4 p-8 bg-gray-50 rounded-md text-center">
                <p className="text-gray-500">No messages to display.</p>
              </div>
            </div>
          </Suspense>
        ),
      },
      {
        path: 'your-inbox',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <div className="p-4">
              <h1 className="text-2xl font-bold">Your Inbox</h1>
              <div className="mt-4 p-8 bg-gray-50 rounded-md text-center">
                <p className="text-gray-500">Your inbox is empty.</p>
              </div>
            </div>
          </Suspense>
        ),
      },
    ],
  },
];
