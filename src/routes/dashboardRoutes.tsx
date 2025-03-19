
import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { Loader2 } from 'lucide-react';

// Create the loading spinner component
export const LoadingSpinner = () => (
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
  },
  {
    path: 'home/contacts/all',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingSpinner />}>
          <AllContacts />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: 'home/contacts/companies',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingSpinner />}>
          <Companies />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: 'home/contacts/companies/:id',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingSpinner />}>
          <CompanyDetail />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: 'home/contacts/:id',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingSpinner />}>
          <ContactDetail />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  // Redirect default path to a meaningful location
  {
    path: '',
    element: <Navigate to="/home/contacts/all" replace />,
  },
];
