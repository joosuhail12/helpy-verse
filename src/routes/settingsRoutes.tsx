
import React, { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
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
const Teammates = lazy(() => import('../pages/settings/Teammates'));
const TeammateDetail = lazy(() => import('../pages/settings/teammates/TeammateDetail'));
const Teams = lazy(() => import('../pages/settings/Teams'));
const EditTeam = lazy(() => import('../pages/settings/EditTeam'));
const Tags = lazy(() => import('../pages/settings/Tags'));

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

// Export routes array for use in router configuration
export const SettingsRoutes = [
  { 
    path: "settings", 
    element: withSuspenseAndProtection(<Settings />),
    children: [
      { path: "", element: <Navigate to="chat" replace /> },
      { path: "chat", element: withSuspenseAndProtection(<ChatSettings />) },
      { path: "profile", element: withSuspenseAndProtection(<Profile />) },
      { path: "team", element: withSuspenseAndProtection(<TeamSettings />) },
      { path: "account", element: withSuspenseAndProtection(<AccountSettings />) },
      { path: "teammates", element: withSuspenseAndProtection(<Teammates />) },
      { path: "teammates/:id", element: withSuspenseAndProtection(<TeammateDetail />) },
      { path: "teams", element: withSuspenseAndProtection(<Teams />) },
      { path: "teams/:id/edit", element: withSuspenseAndProtection(<EditTeam />) },
      { path: "tags", element: withSuspenseAndProtection(<Tags />) }
    ]
  }
];
