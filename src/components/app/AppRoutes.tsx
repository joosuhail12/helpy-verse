
import * as React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import LoadingFallback from './LoadingFallback';

// Lazily import layouts and pages
const DashboardLayout = React.lazy(() => import('@/layouts/DashboardLayout'));

// Import route configs
import { dashboardRoutes } from '@/routes/dashboardRoutes';
import { inboxRoutes } from '@/routes/inboxRoutes';
import { settingsRoutes } from '@/routes/settingsRoutes';
import { automationRoutes } from '@/routes/automationRoutes';

// Lazy load auth pages correctly
const ForgotPasswordLazy = React.lazy(() => import('@/pages/ForgotPassword'));
const ResetPasswordLazy = React.lazy(() => import('@/pages/ResetPassword'));
const SignUpLazy = React.lazy(() => import('@/pages/SignUp'));
const NotFoundLazy = React.lazy(() => import('@/pages/NotFound'));
const LandingPageLazy = React.lazy(() => import('@/pages/LandingPage'));
const SignInLazy = React.lazy(() => import('@/pages/SignIn'));

const AppRoutes: React.FC = () => {
  return (
    <React.Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<LandingPageLazy />} />
        <Route path="/home" element={<Navigate to="/home/inbox/all" replace />} />
        <Route path="/sign-in" element={<SignInLazy />} />
        <Route path="/forgot-password" element={<ForgotPasswordLazy />} />
        <Route path="/reset-password" element={<ResetPasswordLazy />} />
        <Route path="/sign-up" element={<SignUpLazy />} />
        
        <Route path="/home" element={<DashboardLayout />}>
          {/* Add nested routes */}
          {renderRoutes(dashboardRoutes)}
          {renderRoutes(inboxRoutes)}
          {renderRoutes(settingsRoutes)}
          {renderRoutes(automationRoutes)}
        </Route>
        
        <Route path="*" element={<NotFoundLazy />} />
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
