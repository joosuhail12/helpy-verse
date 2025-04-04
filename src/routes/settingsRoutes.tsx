
import { lazy } from 'react';
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

export const settingsRoutes = [
  {
    path: 'settings',
    element: (
      <RouteErrorBoundary>
        <Settings />
      </RouteErrorBoundary>
    ),
    children: [
      {
        path: 'email/domains',
        element: (
          <RouteErrorBoundary>
            <EmailDomainsSettings />
          </RouteErrorBoundary>
        ),
      },
      {
        path: 'email/domains/:id',
        element: (
          <RouteErrorBoundary>
            <EmailDomainDetail />
          </RouteErrorBoundary>
        ),
      },
      {
        path: 'email/channels',
        element: (
          <RouteErrorBoundary>
            <EmailChannels />
          </RouteErrorBoundary>
        ),
      },
      {
        path: 'tags',
        element: (
          <RouteErrorBoundary>
            <Tags />
          </RouteErrorBoundary>
        ),
      },
      {
        path: 'custom-data',
        element: (
          <RouteErrorBoundary>
            <CustomData />
          </RouteErrorBoundary>
        ),
      },
      {
        path: 'custom-objects',
        element: (
          <RouteErrorBoundary>
            <CustomObjects />
          </RouteErrorBoundary>
        ),
      },
      {
        path: 'custom-objects/:id',
        element: (
          <RouteErrorBoundary>
            <CustomObjectDetail />
          </RouteErrorBoundary>
        ),
      },
      {
        path: 'teammates',
        element: (
          <RouteErrorBoundary>
            <TeammateDetail />
          </RouteErrorBoundary>
        ),
      },
      {
        path: 'teammates/:id',
        element: (
          <RouteErrorBoundary>
            <TeammateDetail />
          </RouteErrorBoundary>
        ),
      },
      {
        path: 'teams',
        element: (
          <RouteErrorBoundary>
            <Teams />
          </RouteErrorBoundary>
        ),
      },
      {
        path: 'teams/:id',
        element: (
          <RouteErrorBoundary>
            <TeamDetail />
          </RouteErrorBoundary>
        ),
      },
      {
        path: 'teams/:id/edit',
        element: (
          <RouteErrorBoundary>
            <EditTeam />
          </RouteErrorBoundary>
        ),
      },
      {
        path: 'canned-responses',
        element: (
          <RouteErrorBoundary>
            <CannedResponses />
          </RouteErrorBoundary>
        ),
      },
      {
        path: 'canned-responses/create',
        element: (
          <RouteErrorBoundary>
            <CreateCannedResponse />
          </RouteErrorBoundary>
        ),
      },
      {
        path: 'canned-responses/:id',
        element: (
          <RouteErrorBoundary>
            <CannedResponseDetail />
          </RouteErrorBoundary>
        ),
      }
    ],
  },
];
