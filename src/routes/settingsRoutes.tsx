
import { lazy, Suspense, ReactNode } from 'react';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { Loader2 } from 'lucide-react';
import RouteErrorBoundary from '@/components/app/RouteErrorBoundary';

// Define LoadingSpinner explicitly in this file to avoid reference errors
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Lazy load settings pages
const Settings = lazy(() => import('../pages/Settings'));
const EmailDomainsSettings = lazy(() => import('../pages/settings/email/domains/Domains'));
const EmailDomainDetail = lazy(() => import('../pages/settings/email/domain-detail/DomainDetail'));
const EmailChannels = lazy(() => import('../pages/settings/email/channels/Channels'));
const Tags = lazy(() => import('../pages/settings/Tags'));

// Helper to wrap components with Suspense, ProtectedRoute and RouteErrorBoundary
const withSuspenseAndProtection = (component: ReactNode) => (
  <ProtectedRoute>
    <RouteErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        {component}
      </Suspense>
    </RouteErrorBoundary>
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
      {
        path: 'tags',
        element: <Suspense fallback={<LoadingSpinner />}><Tags /></Suspense>,
      }
    ],
  },
];
