
import * as React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import LoadingFallback from './LoadingFallback';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import RootRedirect from './RootRedirect';

// Import directly instead of lazy loading for problematic components
import DashboardLayout from '@/layouts/DashboardLayout';
import AllInbox from '@/pages/inbox/All';
import SignIn from '@/pages/SignIn';
import Dashboard from '@/pages/Dashboard'; // Import Dashboard directly

// Import route configs
import { dashboardRoutes } from '@/routes/dashboardRoutes';
import { inboxRoutes } from '@/routes/inboxRoutes';
import { settingsRoutes } from '@/routes/settingsRoutes';
import { automationRoutes } from '@/routes/automationRoutes';

// Lazy load auth pages correctly - using consistent naming
const ForgotPassword = React.lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = React.lazy(() => import('@/pages/ResetPassword'));
const SignUp = React.lazy(() => import('@/pages/SignUp'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));
const LandingPage = React.lazy(() => import('@/pages/LandingPage'));

// Lazy load other inbox pages
const YourInbox = React.lazy(() => import('@/pages/inbox/YourInbox'));
const UnassignedInbox = React.lazy(() => import('@/pages/inbox/Unassigned'));
const MentionsInbox = React.lazy(() => import('@/pages/inbox/Mentions'));

const AppRoutes: React.FC = () => {
  console.log('AppRoutes rendering');
  
  return (
    <React.Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<RootRedirect />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/sign-up" element={<SignUp />} />
        
        <Route path="/home" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          {/* Define Dashboard route directly */}
          <Route path="" element={<Dashboard />} />
          
          {/* Define other critical routes directly */}
          <Route path="inbox/all" element={<AllInbox />} />
          <Route path="inbox/your-inbox" element={
            <React.Suspense fallback={<LoadingFallback />}>
              <YourInbox />
            </React.Suspense>
          } />
          <Route path="inbox/unassigned" element={
            <React.Suspense fallback={<LoadingFallback />}>
              <UnassignedInbox />
            </React.Suspense>
          } />
          <Route path="inbox/mentions" element={
            <React.Suspense fallback={<LoadingFallback />}>
              <MentionsInbox />
            </React.Suspense>
          } />
          
          {/* Add nested routes from configs */}
          {renderRoutes(dashboardRoutes.filter(route => route.path !== ''))}
          {renderRoutes(settingsRoutes)}
          {renderRoutes(automationRoutes)}
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </React.Suspense>
  );
};

// Helper function to render routes from config
function renderRoutes(routes: any[]) {
  return routes.map((route) => {
    if (route.children) {
      return (
        <Route key={route.path} path={route.path} element={route.element}>
          {renderRoutes(route.children)}
        </Route>
      );
    }
    
    // Skip routes that we've already defined explicitly
    if (route.path && (
      route.path === 'inbox/all' || 
      route.path === 'inbox/your-inbox' ||
      route.path === 'inbox/unassigned' ||
      route.path === 'inbox/mentions'
    )) {
      return null;
    }
    
    return <Route key={route.path} path={route.path} element={route.element} />;
  }).filter(Boolean);
}

export default AppRoutes;
