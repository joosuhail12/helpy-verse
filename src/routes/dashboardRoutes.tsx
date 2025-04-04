
import React from 'react';
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

// Import Dashboard directly instead of lazy loading to fix the error
import Dashboard from '../pages/Dashboard';

// Lazy load other pages
const AllContacts = React.lazy(() => import('../pages/contacts/All'));
const Companies = React.lazy(() => import('../pages/contacts/Companies'));
const CompanyDetail = React.lazy(() => import('../pages/contacts/CompanyDetail'));
const ContactDetail = React.lazy(() => import('../pages/contacts/Detail'));

// Helper function to wrap a component with Suspense, ProtectedRoute and RouteErrorBoundary
const withSuspenseAndProtection = (Component) => (
  <ProtectedRoute>
    <RouteErrorBoundary>
      <React.Suspense fallback={<LoadingSpinner />}>
        <Component />
      </React.Suspense>
    </RouteErrorBoundary>
  </ProtectedRoute>
);

// For Dashboard, use the direct import instead of lazy loading
const withDashboardProtection = () => (
  <ProtectedRoute>
    <RouteErrorBoundary>
      <Dashboard />
    </RouteErrorBoundary>
  </ProtectedRoute>
);

export const dashboardRoutes = [
  {
    path: '',
    element: withDashboardProtection(),
  },
  {
    path: 'contacts/all',
    element: withSuspenseAndProtection(AllContacts),
  },
  {
    path: 'contacts/companies',
    element: withSuspenseAndProtection(Companies),
  },
  {
    path: 'contacts/companies/:id',
    element: withSuspenseAndProtection(CompanyDetail),
  },
  {
    path: 'contacts/:id',
    element: withSuspenseAndProtection(ContactDetail),
  },
];
