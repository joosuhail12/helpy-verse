
import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { Loader2 } from 'lucide-react';
import RouteErrorBoundary from '@/components/app/RouteErrorBoundary';

// Create the loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Lazy load dashboard pages - fixed imports to ensure proper lazy loading
const Dashboard = lazy(() => import('../pages/Dashboard'));
const ContactsPage = lazy(() => import('../pages/contacts/index'));
const AllContacts = lazy(() => import('../pages/contacts/All'));
const Companies = lazy(() => import('../pages/contacts/Companies'));
const CompanyDetail = lazy(() => import('../pages/contacts/CompanyDetail'));
const ContactDetail = lazy(() => import('../pages/contacts/Detail'));

// Helper function to wrap a component with Suspense, ProtectedRoute and RouteErrorBoundary
const withSuspenseAndProtection = (Component) => (
  <ProtectedRoute>
    <RouteErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <Component />
      </Suspense>
    </RouteErrorBoundary>
  </ProtectedRoute>
);

export const dashboardRoutes = [
  {
    path: '',
    element: withSuspenseAndProtection(Dashboard),
  },
  {
    path: 'contacts',
    element: withSuspenseAndProtection(ContactsPage),
    children: [
      {
        path: '',
        element: <Navigate to="all" replace />,
      },
      {
        path: 'all',
        element: withSuspenseAndProtection(AllContacts),
      },
      {
        path: 'companies',
        element: withSuspenseAndProtection(Companies),
      },
      {
        path: 'companies/:id',
        element: withSuspenseAndProtection(CompanyDetail),
      },
      {
        path: ':id',
        element: withSuspenseAndProtection(ContactDetail),
      },
    ],
  },
];
