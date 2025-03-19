
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

// Lazy load dashboard pages
const Dashboard = lazy(() => import('../pages/Dashboard'));
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
    path: 'home',
    element: withSuspenseAndProtection(Dashboard),
  },
  {
    path: 'home/contacts/all',
    element: withSuspenseAndProtection(AllContacts),
  },
  {
    path: 'home/contacts/companies',
    element: withSuspenseAndProtection(Companies),
  },
  {
    path: 'home/contacts/companies/:id',
    element: withSuspenseAndProtection(CompanyDetail),
  },
  {
    path: 'home/contacts/:id',
    element: withSuspenseAndProtection(ContactDetail),
  },
  // Redirect default path to a meaningful location
  {
    path: '',
    element: <Navigate to="/home/contacts/all" replace />,
  },
];
