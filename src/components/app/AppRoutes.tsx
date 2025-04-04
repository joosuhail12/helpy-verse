
import * as React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import LoadingFallback from './LoadingFallback';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import RootRedirect from './RootRedirect';

// Lazily import layouts 
const DashboardLayout = React.lazy(() => import('@/layouts/DashboardLayout'));

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
const SignIn = React.lazy(() => import('@/pages/SignIn'));

const AppRoutes: React.FC = () => {
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
          {/* Add nested routes */}
          {renderRoutes(dashboardRoutes)}
          {renderRoutes(inboxRoutes)}
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
    return <Route key={route.path} path={route.path} element={route.element} />;
  });
}

export default AppRoutes;
