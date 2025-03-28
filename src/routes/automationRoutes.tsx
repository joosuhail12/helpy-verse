
import { lazy, Suspense } from 'react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export const automationRoutes = [
  {
    path: 'automation',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <div className="p-4">
          <h1 className="text-2xl font-bold">Automation</h1>
          <div className="mt-4 p-8 bg-gray-50 rounded-md text-center">
            <p className="text-gray-500">No automation workflows configured.</p>
          </div>
        </div>
      </Suspense>
    ),
  },
];
