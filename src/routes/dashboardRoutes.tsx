
import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Define LoadingSpinner component first before using it
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

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
