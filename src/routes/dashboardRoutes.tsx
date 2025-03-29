
import { lazy, Suspense, ReactNode } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
const withSuspenseAndProtection = (Component: ReactNode) => (
  <ProtectedRoute>
    <RouteErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        {Component}
      </Suspense>
    </RouteErrorBoundary>
  </ProtectedRoute>
);

export const DashboardRoutes = () => {
  return (
    <Routes>
      <Route path="" element={withSuspenseAndProtection(<Dashboard />)} />
      <Route path="contacts/all" element={withSuspenseAndProtection(<AllContacts />)} />
      <Route path="contacts/companies" element={withSuspenseAndProtection(<Companies />)} />
      <Route path="contacts/companies/:id" element={withSuspenseAndProtection(<CompanyDetail />)} />
      <Route path="contacts/:id" element={withSuspenseAndProtection(<ContactDetail />)} />
    </Routes>
  );
};
