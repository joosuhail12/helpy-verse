
import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import RouteErrorBoundary from '@/components/app/RouteErrorBoundary';

// Create the loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Lazy load dashboard pages
const Dashboard = lazy(() => import('../pages/Dashboard'));
const AllContacts = lazy(() => import('../pages/contacts/All'));
const Companies = lazy(() => import('../pages/contacts/Companies'));
const CompanyDetail = lazy(() => import('../pages/contacts/CompanyDetail'));
const ContactDetail = lazy(() => import('../pages/contacts/Detail'));

// Helper function to wrap a component with Suspense and RouteErrorBoundary
const withSuspenseAndErrorHandling = (Component) => (
  <RouteErrorBoundary>
    <Suspense fallback={<LoadingSpinner />}>
      <Component />
    </Suspense>
  </RouteErrorBoundary>
);

export const dashboardRoutes = [
  {
    path: '',
    element: withSuspenseAndErrorHandling(Dashboard),
  },
  {
    path: 'contacts',
    element: <Navigate to="/home/contacts/all" replace />,
  },
  {
    path: 'contacts/all',
    element: withSuspenseAndErrorHandling(AllContacts),
  },
  {
    path: 'contacts/companies',
    element: withSuspenseAndErrorHandling(Companies),
  },
  {
    path: 'contacts/companies/:id',
    element: withSuspenseAndErrorHandling(CompanyDetail),
  },
  {
    path: 'contacts/:id',
    element: withSuspenseAndErrorHandling(ContactDetail),
  },
];
