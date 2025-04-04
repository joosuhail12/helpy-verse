
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import ProtectedRouteWrapper from '../components/auth/ProtectedRouteWrapper';

// Lazy load dashboard pages - all using lowercase paths
const Dashboard = lazy(() => import('../pages/Dashboard'));
const ContactsPage = lazy(() => import('../pages/contacts/index'));
const AllContacts = lazy(() => import('../pages/contacts/All'));
const Companies = lazy(() => import('../pages/contacts/Companies'));
const CompanyDetail = lazy(() => import('../pages/contacts/CompanyDetail'));
const ContactDetail = lazy(() => import('../pages/contacts/Detail'));

// Helper function to wrap a component with ProtectedRouteWrapper
const withProtection = (Component) => (
  <ProtectedRouteWrapper>
    <Component />
  </ProtectedRouteWrapper>
);

export const dashboardRoutes = [
  {
    path: '',
    element: withProtection(Dashboard),
  },
  {
    path: 'contacts',
    element: withProtection(ContactsPage),
    children: [
      {
        path: '',
        element: <Navigate to="all" replace />,
      },
      {
        path: 'all',
        element: withProtection(AllContacts),
      },
      {
        path: 'companies',
        element: withProtection(Companies),
      },
      {
        path: 'companies/:id',
        element: withProtection(CompanyDetail),
      },
      {
        path: ':id',
        element: withProtection(ContactDetail),
      },
    ],
  },
];
