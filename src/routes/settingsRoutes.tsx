import { lazy, ReactNode } from 'react';
import ProtectedRouteWrapper from '@/components/auth/ProtectedRouteWrapper';
import { Suspense } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import RouteErrorBoundary from '@/components/app/RouteErrorBoundary';

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

// Helper function to wrap components with protection
const withProtection = (component: ReactNode) => (
  <ProtectedRouteWrapper>
    {component}
  </ProtectedRouteWrapper>
);

// Helper for child routes that don't need the full wrapper
const withSuspenseOnly = (Component: React.ComponentType) => (
  <RouteErrorBoundary>
    <Suspense fallback={<LoadingSpinner />}>
      <Component />
    </Suspense>
  </RouteErrorBoundary>
);

export const settingsRoutes = [
  {
    path: 'settings',
    element: withProtection(<Settings />),
    children: [
      {
        path: 'email/domains',
        element: withSuspenseOnly(EmailDomainsSettings),
      },
      {
        path: 'email/domains/:id',
        element: withSuspenseOnly(EmailDomainDetail),
      },
      {
        path: 'email/channels',
        element: withSuspenseOnly(EmailChannels),
      },
      {
        path: 'tags',
        element: withSuspenseOnly(Tags),
      },
      {
        path: 'custom-data',
        element: withSuspenseOnly(CustomData),
      },
      {
        path: 'custom-objects',
        element: withSuspenseOnly(CustomObjects),
      },
      {
        path: 'custom-objects/:id',
        element: withSuspenseOnly(CustomObjectDetail),
      },
      {
        path: 'teammates',
        element: withSuspenseOnly(Teammates),
      },
      {
        path: 'teammates/:id',
        element: withSuspenseOnly(TeammateDetail),
      },
      {
        path: 'teams',
        element: withSuspenseOnly(Teams),
      },
      {
        path: 'teams/:id',
        element: withSuspenseOnly(TeamDetail),
      },
      {
        path: 'teams/:id/edit',
        element: withSuspenseOnly(EditTeam),
      },
      {
        path: 'canned-responses',
        element: withSuspenseOnly(CannedResponses),
      },
      {
        path: 'canned-responses/create',
        element: withSuspenseOnly(CreateCannedResponse),
      },
      {
        path: 'canned-responses/:id',
        element: withSuspenseOnly(CannedResponseDetail),
      }
    ],
  },
];
