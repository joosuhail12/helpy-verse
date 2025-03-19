
import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { LoadingSpinner } from './index';

// Lazy load dashboard pages
const Dashboard = lazy(() => import('../pages/Dashboard'));
const AllContacts = lazy(() => import('../pages/contacts/All'));
const Companies = lazy(() => import('../pages/contacts/Companies'));
const CompanyDetail = lazy(() => import('../pages/contacts/CompanyDetail'));
const ContactDetail = lazy(() => import('../pages/contacts/Detail'));

export const dashboardRoutes = [
  {
    path: 'home',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingSpinner />}>
          <Dashboard />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'contacts/all',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <AllContacts />
          </Suspense>
        ),
      },
      {
        path: 'contacts/companies',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Companies />
          </Suspense>
        ),
      },
      {
        path: 'contacts/companies/:id',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <CompanyDetail />
          </Suspense>
        ),
      },
      {
        path: 'contacts/:id',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ContactDetail />
          </Suspense>
        ),
      },
      // Redirect default path to a meaningful location
      {
        path: '',
        element: <Navigate to="/home/contacts/all" replace />,
      },
    ],
  },
];
