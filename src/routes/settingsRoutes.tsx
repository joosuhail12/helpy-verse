
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
const CustomData = lazy(() => import('../pages/settings/CustomData'));
const CustomObjects = lazy(() => import('../pages/settings/CustomObjects'));
const CustomObjectDetail = lazy(() => import('../pages/settings/CustomObjectDetail'));
const Teammates = lazy(() => import('../pages/settings/Teammates'));
const TeammateDetail = lazy(() => import('../pages/settings/teammates/TeammateDetail'));
const Teams = lazy(() => import('../pages/settings/Teams'));
const TeamDetail = lazy(() => import('../pages/settings/TeamDetail'));
const EditTeam = lazy(() => import('../pages/settings/EditTeam'));
const CannedResponses = lazy(() => import('../pages/settings/CannedResponses'));
const CreateCannedResponse = lazy(() => import('../pages/settings/CreateCannedResponse'));
const CannedResponseDetail = lazy(() => import('../pages/settings/CannedResponseDetail'));
const ChatSettings = lazy(() => import('../pages/settings/ChatSettings'));

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
    path: 'settings',
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
      },
      {
        path: 'custom-data',
        element: <Suspense fallback={<LoadingSpinner />}><CustomData /></Suspense>,
      },
      {
        path: 'custom-objects',
        element: <Suspense fallback={<LoadingSpinner />}><CustomObjects /></Suspense>,
      },
      {
        path: 'custom-objects/:id',
        element: <Suspense fallback={<LoadingSpinner />}><CustomObjectDetail /></Suspense>,
      },
      {
        path: 'teammates',
        element: <Suspense fallback={<LoadingSpinner />}><Teammates /></Suspense>,
      },
      {
        path: 'teammates/:id',
        element: <Suspense fallback={<LoadingSpinner />}><TeammateDetail /></Suspense>,
      },
      {
        path: 'teams',
        element: <Suspense fallback={<LoadingSpinner />}><Teams /></Suspense>,
      },
      {
        path: 'teams/:id',
        element: <Suspense fallback={<LoadingSpinner />}><TeamDetail /></Suspense>,
      },
      {
        path: 'teams/:id/edit',
        element: <Suspense fallback={<LoadingSpinner />}><EditTeam /></Suspense>,
      },
      {
        path: 'canned-responses',
        element: <Suspense fallback={<LoadingSpinner />}><CannedResponses /></Suspense>,
      },
      {
        path: 'canned-responses/create',
        element: <Suspense fallback={<LoadingSpinner />}><CreateCannedResponse /></Suspense>,
      },
      {
        path: 'canned-responses/:id',
        element: <Suspense fallback={<LoadingSpinner />}><CannedResponseDetail /></Suspense>,
      },
      {
        path: 'chat',
        element: <Suspense fallback={<LoadingSpinner />}><ChatSettings /></Suspense>,
      }
    ],
  },
];
