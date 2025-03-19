
import { lazy, Suspense, ReactNode } from 'react';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { LoadingSpinner } from './index';

// Lazy load settings pages
const Settings = lazy(() => import('../pages/Settings'));
const EmailDomainsSettings = lazy(() => import('../pages/settings/email/domains/Domains'));
const EmailDomainDetail = lazy(() => import('../pages/settings/email/domain-detail/DomainDetail'));
const EmailChannels = lazy(() => import('../pages/settings/email/channels/Channels'));

// Helper to wrap components with Suspense and ProtectedRoute
const withSuspenseAndProtection = (component: ReactNode) => (
  <ProtectedRoute>
    <Suspense fallback={<LoadingSpinner />}>
      {component}
    </Suspense>
  </ProtectedRoute>
);

export const settingsRoutes = [
  {
    path: 'home/settings',
    element: withSuspenseAndProtection(<Settings />),
    children: [
      {
        path: 'email/domains',
        element: <Suspense fallback={<LoadingSpinner />}><EmailDomainsSettings /></Suspense>,
      },
      {
        path: 'email/domains/:id',
        element: <Suspense fallback={<LoadingSpinner />}><EmailDomainDetail /></Suspense>,
      },
      {
        path: 'email/channels',
        element: <Suspense fallback={<LoadingSpinner />}><EmailChannels /></Suspense>,
      },
    ],
  },
];
