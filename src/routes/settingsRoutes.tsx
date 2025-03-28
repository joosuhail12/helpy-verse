
import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Define LoadingSpinner component to avoid reference errors
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Lazy load settings components
const Settings = lazy(() => import('@/pages/Settings'));
const Domains = lazy(() => import('@/pages/settings/email/domains/Domains'));
const Channels = lazy(() => import('@/pages/settings/email/channels/Channels'));
const DomainDetail = lazy(() => import('@/pages/settings/email/domain-detail/DomainDetail'));

export const settingsRoutes = [
  {
    path: 'settings',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Settings />
      </Suspense>
    ),
    children: [
      {
        path: 'email/domains',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Domains />
          </Suspense>
        ),
      },
      {
        path: 'email/domains/:id',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <DomainDetail />
          </Suspense>
        ),
      },
      {
        path: 'email/channels',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Channels />
          </Suspense>
        ),
      },
    ],
  },
];
