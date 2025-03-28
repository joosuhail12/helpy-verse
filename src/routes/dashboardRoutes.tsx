
import { lazy, Suspense } from 'react';
import { LoadingSpinner } from './index'; // Import the shared LoadingSpinner

// Lazy load dashboard components
const Home = lazy(() => import('@/pages/Home'));
const Index = lazy(() => import('@/pages/Index'));

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Home />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Index />
          </Suspense>
        ),
      },
    ],
  },
];
