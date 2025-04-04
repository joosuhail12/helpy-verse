
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import RouteErrorBoundary from '@/components/app/RouteErrorBoundary';

// Loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Lazy load settings pages
const Settings = lazy(() => import('../pages/Settings'));
const ChatSettings = lazy(() => import('../pages/settings/ChatSettings'));
const Profile = lazy(() => import('../pages/settings/Profile'));
const TeamSettings = lazy(() => import('../pages/settings/TeamSettings'));
const AccountSettings = lazy(() => import('../pages/settings/AccountSettings'));

// Helper function to wrap a component with Suspense, ProtectedRoute and RouteErrorBoundary
const withSuspenseAndProtection = (Component: React.ReactNode) => (
  <ProtectedRoute>
    <RouteErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        {Component}
      </Suspense>
    </RouteErrorBoundary>
  </ProtectedRoute>
);

// Settings Routes component
const SettingsRoutes = () => {
  return (
    <Routes>
      <Route path="" element={<Settings />}>
        <Route path="" element={<Navigate to="chat" replace />} />
        <Route path="chat" element={withSuspenseAndProtection(<ChatSettings />)} />
        <Route path="profile" element={withSuspenseAndProtection(<Profile />)} />
        <Route path="team" element={withSuspenseAndProtection(<TeamSettings />)} />
        <Route path="account" element={withSuspenseAndProtection(<AccountSettings />)} />
      </Route>
    </Routes>
  );
};

export default SettingsRoutes;
