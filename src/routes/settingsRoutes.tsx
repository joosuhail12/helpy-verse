
import { lazy } from 'react';
import ProtectedRoute from '@/components/routing/ProtectedRoute';

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
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'email/domains',
        element: <EmailDomainsSettings />,
      },
      {
        path: 'email/domains/:id',
        element: <EmailDomainDetail />,
      },
      {
        path: 'email/channels',
        element: <EmailChannels />,
      },
      {
        path: 'tags',
        element: <Tags />,
      },
      {
        path: 'custom-data',
        element: <CustomData />,
      },
      {
        path: 'custom-objects',
        element: <CustomObjects />,
      },
      {
        path: 'custom-objects/:id',
        element: <CustomObjectDetail />,
      },
      {
        path: 'teammates',
        element: <Teammates />,
      },
      {
        path: 'teammates/:id',
        element: <TeammateDetail />,
      },
      {
        path: 'teams',
        element: <Teams />,
      },
      {
        path: 'teams/:id',
        element: <TeamDetail />,
      },
      {
        path: 'teams/:id/edit',
        element: <EditTeam />,
      },
      {
        path: 'canned-responses',
        element: <CannedResponses />,
      },
      {
        path: 'canned-responses/create',
        element: <CreateCannedResponse />,
      },
      {
        path: 'canned-responses/:id',
        element: <CannedResponseDetail />,
      }
    ],
  },
];
