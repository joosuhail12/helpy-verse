
import { lazy, Suspense, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { LoadingSpinner } from './index';

// Lazy load dashboard pages
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Companies = lazy(() => import('../pages/contacts/Companies'));
const CompanyDetail = lazy(() => import('../pages/contacts/CompanyDetail'));

// Helper to wrap components with Suspense and ProtectedRoute
const withSuspenseAndProtection = (component: ReactNode) => (
  <ProtectedRoute>
    <Suspense fallback={<LoadingSpinner />}>
      {component}
    </Suspense>
  </ProtectedRoute>
);

export const dashboardRoutes = [
  {
    path: 'home',
    element: withSuspenseAndProtection(<Dashboard />),
  },
  {
    path: 'home/contacts/companies',
    element: withSuspenseAndProtection(<Companies />),
  },
  {
    path: 'home/contacts/companies/:id',
    element: withSuspenseAndProtection(<CompanyDetail />),
  },
  // Redirect root to home
  {
    path: '',
    element: <Navigate to="/home" replace />,
  },
];
